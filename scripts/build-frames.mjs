#!/usr/bin/env node
/**
 * Builds the frame sequence that ScrollFrameAnimation scrubs.
 *
 * Takes either a video or a directory of already-rendered numbered stills —
 * an unzipped export from an image or video generator comes as the latter:
 *
 *   node scripts/build-frames.mjs media-source/entry-sequence.mp4
 *   node scripts/build-frames.mjs media-source/whatever_frames
 *   node scripts/build-frames.mjs <in> --frames 96 --width 1600 --quality 34
 *
 * Frames are sampled evenly across the whole source rather than taken at its
 * own rate, so the count is exactly what you asked for. Scroll distance is
 * mapped onto that count, so an uneven sample would show up as the move
 * speeding up and slowing down under a constant scroll.
 *
 * PNG stills are usually 1 MB each and cannot ship as they are; the point of
 * this step is as much the re-encode as the sampling. AVIF by default — see
 * the note on `--format` below for why, and for the trap in encoding it.
 *
 * Requires ffmpeg and ffprobe on PATH.
 */

import { execFile, execFileSync } from "node:child_process";
import { cpus } from "node:os";
import { promisify } from "node:util";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";

const argv = process.argv.slice(2);

const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

// The first bare word that is not itself a flag's value.
let input;
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith("--")) {
    i++; // skip this flag's value
    continue;
  }
  input = argv[i];
  break;
}

if (!input) {
  console.error("usage: node scripts/build-frames.mjs <video|frames-dir> [--name entry] [--frames 96]");
  console.error("       [--width 1600] [--quality 34] [--format avif|webp] [--sharpen 1]");
  process.exit(1);
}

const name = flag("name", "entry");
const frames = Number(flag("frames", 96));
const width = Number(flag("width", 1600));

/*
  AVIF by default. On this footage it is both sharper and smaller than WebP —
  measured at 1600px it came out around 26 KB a frame against 30 KB for WebP at
  1280px, so the sequence gets a 25% resolution increase for slightly *less*
  weight. `--quality` is therefore a CRF (lower is better, ~28–40 useful) for
  AVIF and a 0–100 quality for WebP; the defaults below match whichever is
  chosen.

  A browser too old for AVIF is handled without a fallback set: frame 1 fails
  to decode, ScrollFrameAnimation's guard stops after that one request, and the
  visitor keeps the WebP poster and a static hero. The poster is always WebP
  for exactly that reason.
*/
const format = String(flag("format", "avif")).toLowerCase();
if (format !== "avif" && format !== "webp") {
  console.error(`unknown --format ${format}; expected avif or webp`);
  process.exit(1);
}

const quality = Number(flag("quality", format === "avif" ? 34 : 62));

/*
  The source is 720p and the hero is full-bleed, so every frame is being
  enlarged. Doing that enlargement here with lanczos plus a light unsharp beats
  leaving it to the browser's bilinear filter at draw time — it is the single
  biggest thing that stops the sequence looking soft. Mild on purpose: heavier
  settings ring on the corrugated wall and crush the dark interior.
*/
const sharpen = flag("sharpen", "1") !== "0";

const src = resolve(input);
if (!existsSync(src)) {
  console.error(`no such file: ${src}`);
  process.exit(1);
}

const outDir = resolve("public", "frames", name);

const run = (bin, args) =>
  execFileSync(bin, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

const runAsync = promisify(execFile);

/** Run `task` over every item, at most `limit` at a time. */
const pool = async (items, limit, task) => {
  const queue = [...items];
  let done = 0;
  const workers = Array.from({ length: limit }, async () => {
    for (;;) {
      const item = queue.shift();
      if (item === undefined) return;
      await task(item);
      done++;
      if (done % 12 === 0 || done === items.length) {
        process.stdout.write(`\r  encoding ${done}/${items.length}`);
      }
    }
  });
  await Promise.all(workers);
  process.stdout.write("\n");
};

const STILL = new Set([".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"]);

/**
 * Resolve the input to ffmpeg arguments plus a source length in frames.
 *
 * A directory of stills is fed through ffmpeg's image2 demuxer at a nominal
 * rate, which turns it into an ordinary video stream — everything downstream
 * then treats a folder and a clip identically.
 */
const readInput = () => {
  if (!statSync(src).isDirectory()) {
    let duration;
    try {
      duration = Number(
        run("ffprobe", [
          "-v", "error",
          "-show_entries", "format=duration",
          "-of", "default=noprint_wrappers=1:nokey=1",
          src,
        ]).trim(),
      );
    } catch {
      console.error("ffprobe failed — is ffmpeg installed and on PATH?");
      process.exit(1);
    }
    if (!Number.isFinite(duration) || duration <= 0) {
      console.error(`could not read a duration from ${basename(src)}`);
      process.exit(1);
    }
    return { args: ["-i", src], duration, sourceFrames: null, label: basename(src) };
  }

  // Numbered stills: frame_001.png, 0001.webp, shot.0001.jpg — anything that
  // ends in digits before the extension.
  const stills = readdirSync(src)
    .filter((f) => STILL.has(extname(f).toLowerCase()))
    .map((f) => ({ f, m: /^(.*?)(\d+)$/.exec(f.slice(0, -extname(f).length)) }))
    .filter((x) => x.m)
    .sort((a, b) => Number(a.m[2]) - Number(b.m[2]));

  if (!stills.length) {
    console.error(`no numbered image frames in ${basename(src)}`);
    process.exit(1);
  }

  const { m } = stills[0];
  const pattern = join(src, `${m[1]}%0${m[2].length}d${extname(stills[0].f)}`);
  const RATE = 25;

  return {
    args: [
      "-framerate", String(RATE),
      "-start_number", String(Number(m[2])),
      "-i", pattern,
    ],
    duration: stills.length / RATE,
    sourceFrames: stills.length,
    label: `${basename(src)}/ (${stills.length} stills)`,
  };
};

const { args: inputArgs, duration, sourceFrames, label } = readInput();

if (sourceFrames && frames > sourceFrames) {
  console.error(`asked for ${frames} frames but the source only has ${sourceFrames}.`);
  console.error(`Resampling up would only duplicate frames — use --frames ${sourceFrames} or fewer.`);
  process.exit(1);
}

// Taking every frame of a still sequence needs no resampling at all, and
// asking for it anyway risks the rate filter dropping or doubling one at the
// seam. Otherwise sample just inside the tail: a frame requested at exactly
// `duration` lands past the last one and ffmpeg quietly returns a short set.
const resample = sourceFrames !== frames;

/*
  Rounded, and that matters. Left at full float precision this lands on values
  like 11.993004580369975, which ffmpeg turns into the timebase
  160425687/1923985999 — libaom rejects that outright with a bare "Invalid
  argument" and writes no frames at all. Three decimals is a small rational it
  accepts, and over a sequence this length the drift is a ten-thousandth of a
  frame.
*/
const fps = Number((frames / (duration - 1 / 60)).toFixed(3));

// A stale longer sequence left in place would leave orphan frames past the new
// count sitting in the deploy, so the directory is rebuilt from empty.
if (existsSync(outDir)) rmSync(outDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

console.log(
  `${label} — ${duration.toFixed(2)}s → ${frames} frames @ ${width}px, ` +
    `${format} q${quality}${sharpen ? " +sharpen" : ""}`,
);

const filters = [
  resample ? `fps=${fps}` : null,
  `scale=${width}:-2:flags=lanczos`,
  sharpen ? "unsharp=5:5:0.8:3:3:0.4" : null,
]
  .filter(Boolean)
  .join(",");

if (format === "avif") {
  /*
    AVIF has to be encoded one file at a time.

    ffmpeg's image2 muxer will happily write a numbered run of `.avif` files,
    and they even carry an `ftypavif` header — but they are bare AV1 streams
    without the HEIF item boxes a real AVIF needs, and every browser refuses
    them. Worse, without `-g 1` they are inter-coded, so most of those "frames"
    are delta frames that could not stand alone even in principle. It looks
    like it worked: files appear, ffprobe reads them, the sizes look great.

    Only ffmpeg's dedicated AVIF muxer writes valid stills, and it emits a
    single file per invocation. So: extract the sampled frames losslessly in
    one pass, then encode them individually, several at a time.
  */
  const tmp = join(outDir, ".tmp-frames");
  mkdirSync(tmp, { recursive: true });

  run("ffmpeg", [
    "-y",
    ...inputArgs,
    "-vf", filters,
    "-frames:v", String(frames),
    "-an",
    join(tmp, "%04d.png"),
  ]);

  const pngs = readdirSync(tmp)
    .filter((f) => f.endsWith(".png"))
    .sort();
  const limit = Math.max(2, Math.min(8, cpus().length - 1));
  console.log(`  ${pngs.length} frames extracted, encoding ${limit} at a time`);

  await pool(pngs, limit, (file) =>
    runAsync("ffmpeg", [
      "-y", "-v", "error",
      "-i", join(tmp, file),
      "-c:v", "libaom-av1",
      // Tells libaom this is a single still rather than one frame of a video.
      "-still-picture", "1",
      "-crf", String(quality),
      // 6 is the quality/time knee; 8 roughly halves encode time for a few
      // percent more weight.
      "-cpu-used", "6",
      "-pix_fmt", "yuv420p",
      join(outDir, file.replace(/\.png$/, ".avif")),
    ]),
  );

  rmSync(tmp, { recursive: true });
} else {
  run("ffmpeg", [
    "-y",
    ...inputArgs,
    "-vf", filters,
    "-frames:v", String(frames),
    "-c:v", "libwebp",
    "-quality", String(quality),
    "-compression_level", "6",
    "-preset", "picture",
    "-an",
    join(outDir, "%04d.webp"),
  ]);
}

// The poster is the first frame, not a separate render: it is what the sequence
// sits on before any frame has loaded, and any difference between the two reads
// as a flash at the moment the canvas takes over.
run("ffmpeg", [
  "-y",
  "-i", join(outDir, `0001.${format}`),
  // Always WebP, whatever the frames are: the poster is the one image every
  // browser must be able to show, including the ones that cannot read AVIF and
  // will therefore never get past frame 1.
  "-c:v", "libwebp",
  "-quality", "82",
  join(outDir, "poster.webp"),
]);

// Backslashes doubled on purpose: this is a template literal, so `\d` would
// collapse to a plain `d` and the pattern would match nothing.
const written = readdirSync(outDir).filter((f) =>
  new RegExp(`^\\d+\\.${format}$`).test(f),
);
const bytes = readdirSync(outDir).reduce(
  (n, f) => n + statSync(join(outDir, f)).size,
  0,
);
const mb = bytes / 1024 / 1024;

console.log(`\n  ${written.length} frames + poster → public/frames/${name}/`);
console.log(`  ${mb.toFixed(2)} MB total, ~${Math.round(bytes / written.length / 1024)} KB per frame`);

if (written.length !== frames) {
  console.warn(`\n  ! got ${written.length} frames, asked for ${frames}.`);
  console.warn(`    Harmless — src/lib/frames.ts reads the directory — but a source`);
  console.warn(`    whose length divides evenly into --frames resamples cleanly and`);
  console.warn(`    avoids the rate filter dropping one at the seam.`);
}

if (mb > 3.2) {
  console.warn(`\n  ! ${mb.toFixed(2)} MB is over the ~3 MB budget. Lower --quality`);
  console.warn(`    before lowering --frames; below ~60 frames the scrub reads as a flip-book.`);
}

// Nothing to wire up by hand: src/lib/frames.ts reads this directory during
// `next build`. That does mean a rebuilt set is not live until the next build.
console.log(`\n  Rebuild the site to pick these up — src/lib/frames.ts reads`);
console.log(`  the directory at build time, so there is no count to edit.\n`);

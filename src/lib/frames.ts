/**
 * Frame-sequence manifests, read off disk.
 *
 * SERVER ONLY. This module touches `node:fs`, so it may only be imported from
 * a Server Component. The pages that use it are statically prerendered, so
 * every `readFrameSet` call happens during `next build` and nothing reads the
 * filesystem at request time — which also means a set added to `public/frames`
 * after a build is not picked up until the next one.
 *
 * Reading the directory rather than hardcoding a count is the point: the frame
 * count changes every time the sequence is re-cut at a different length, and a
 * hardcoded number that drifts past what actually shipped leaves the scrub
 * stalled on the last real frame for the rest of the section.
 *
 * Sets are produced by `scripts/build-frames.mjs`; see `docs/entry-sequence.md`.
 */

import { readdirSync } from "node:fs";
import { join } from "node:path";

export type FrameSet = {
  /** Public URLs, in playback order. */
  urls: string[];
  /** First frame, doubling as the LCP image and the reduced-motion still. */
  poster: string;
};

/**
 * Any filename ending in digits before a supported extension: `0001.webp`,
 * `frame-7.webp`, `shot.0042.avif`. `poster.webp` has no trailing digits and
 * is deliberately excluded — it is returned separately, not scrubbed through.
 */
const NUMBERED = /^(.*?)(\d+)\.(?:webp|avif|png|jpe?g)$/i;

/**
 * Read one set out of `public/frames/<name>/`.
 *
 * Frames are sorted by their numeric suffix, never lexicographically: a plain
 * string sort puts `frame-10` between `frame-1` and `frame-2` and the sequence
 * plays out of order. Zero-padded names happen to sort correctly as strings,
 * but the padding is a property of whatever produced them, not something to
 * rely on.
 */
export function readFrameSet(name: string): FrameSet {
  const dir = join(process.cwd(), "public", "frames", name);

  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    // A set that has not been generated yet is not a build failure: the
    // component falls back to the poster, and an empty list tells it to skip
    // loading entirely rather than requesting frames that are not there.
    return { urls: [], poster: `/frames/${name}/poster.webp` };
  }

  const urls = entries
    .map((file) => ({ file, match: NUMBERED.exec(file) }))
    .filter((x): x is { file: string; match: RegExpExecArray } => !!x.match)
    .sort((a, b) => Number(a.match[2]) - Number(b.match[2]))
    .map((x) => `/frames/${name}/${x.file}`);

  return { urls, poster: `/frames/${name}/poster.webp` };
}

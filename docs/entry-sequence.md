# Entry sequence — door → car in the air

The homepage opens on a scroll-scrubbed frame sequence: the shop's roll-up door
fills the screen closed, rolls up as you scroll, the camera pushes through the
opening onto the shop floor and up to a car, and the lift takes it into the
air, closing on the hero shot.

Production is three steps: **generate two keyframes → generate a video between
them → cut it into frames**. Only step 3 touches the repo, and if you already
have a frame export, sections 1 and 2 are just the record of how it was made —
skip to section 3.

---

## 1. Image prompts (the two keyframes)

Both prompts are written against the real shop in `public/images/` — tan
corrugated steel exterior, galvanized roof deck on charcoal I-beams, white
painted wainscot under silver corrugated upper walls, black HALO Lifts posts
with yellow arms, bare grey concrete. Keep that vocabulary; the site's
photography sits a few sections below and a mismatch is obvious.

**Both images must share:** 16:9, 2560×1440, the same 35mm full-frame look, the
same blue-hour exterior / warm fluorescent interior lighting, camera at ~1.5m
eye height and dead level. The video model interpolates between them — if the
horizon or the colour temperature jumps, the move will wobble.

### START FRAME — `entry-start.png`

> Cinematic wide shot, 16:9, shot on a 35mm lens at f/4, camera at eye height
> and perfectly level, centred head-on: the closed corrugated-steel roll-up
> door of a small industrial auto shop at blue hour. The door is tan/beige
> ribbed metal, weathered, with faint scuffs and a dented lower panel, filling
> the centre two-thirds of the frame. Around it, the tan corrugated metal
> building wall and a plain concrete apron in the foreground with a damp patch
> reflecting a single overhead security lamp. A thin seam of warm yellow light
> escapes from under the bottom edge of the closed door and glows on the wet
> concrete. Deep blue evening sky above, no sun, no people, no cars, no text,
> no signage, no logos. Muted industrial palette — cool blue exterior against
> that one warm strip of light. Photographic, high detail, natural grain,
> no HDR halos, no lens flare, no vignette.

### END FRAME — `entry-end.png`

> Cinematic wide shot, 16:9, shot on a 35mm lens at f/4, camera at eye height
> and perfectly level, centred head-on, interior of a small industrial DIY auto
> shop at night. A dark grey sedan is raised about 1.5 metres in the air on a
> black two-post lift with bright yellow swing arms, centred in frame, wheels
> hanging free, its full undercarriage exposed and lit. Behind it: a white
> painted wainscot running along the lower wall, silver corrugated metal upper
> walls, a galvanized corrugated roof deck on charcoal steel I-beams, and long
> fluorescent tube fixtures suspended on chains casting hard white pools of
> light. Bare grey concrete floor with faint oil staining and a floor drain.
> A second black lift post and a rolling red tool chest sit out of focus in the
> background. No people, no text, no signage, no logos, no brand marks.
> Muted industrial palette, warm fluorescent white against cool shadow.
> Photographic, high detail, natural grain, no HDR halos, no lens flare.

Reference images to attach if the generator accepts them:
`public/images/garagepass-oakland-exterior-77th-avenue.webp` for the start,
`public/images/garagepass-oakland-truck-on-two-post-lift.webp` and
`garagepass-oakland-diy-auto-shop-lift-bays.webp` for the end.

## 2. Video prompt (start frame → end frame)

Feed `entry-start.png` as the first frame and `entry-end.png` as the last.
6 seconds, 24fps, 16:9, no audio.

> The roll-up door rolls smoothly upward, warm interior light spilling out
> wider and wider across the wet concrete as it opens. The camera pushes slowly
> and steadily forward through the open doorway into the shop, the doorway
> frame passing out of view at the edges. Inside, a dark grey sedan sits on a
> two-post lift, and the lift rises steadily, carrying the car up until its
> undercarriage is fully exposed. One continuous forward dolly move, constant
> speed, locked level, no cuts, no camera shake, no zoom, no pan, no orbit.
> No people enter frame. No text or captions.

**What to check before cutting frames:** the move has to be monotonic — one
direction, no drift back, no hold-then-lurch. Scrubbing exposes any hesitation
in the source as a dead spot where the user scrolls and nothing moves. Regenerate
rather than fix it in post.

Keep the render in `media-source/` (gitignored) as `entry-sequence.mp4`.

## 3. Cut it into frames

The build script takes either a video or a directory of numbered stills — an
unzipped frame export from a generator is the latter, and needs no video step
at all:

```bash
node scripts/build-frames.mjs media-source/entry-sequence.mp4
node scripts/build-frames.mjs media-source/<whatever>_frames
```

It writes `public/frames/entry/0001.webp … NNNN.webp` plus `poster.webp`, and
prints the frame count and total weight. **Set `frameCount` in
`src/lib/sequence.ts` to the number it printed**, not the one you asked for —
the rate filter lands a frame or two either side, and a count higher than what
shipped leaves the scrub stalled on the last real frame.

Budget: **keep the set under ~3 MB total.** That is roughly what the existing
all-intra scrub video costs, and it is the number to beat. If it comes in
heavy, drop quality before dropping frames — under about 60 frames the scrub
starts to read as a flip-book.

The frames are only ever fetched on a fine-pointer viewport with motion
enabled. Phones, reduced-motion users and crawlers get `poster.webp` and never
request the rest — see `src/components/motion/ScrollSequence.tsx`. If the
sequence is missing entirely, the loader probes frame 1, stops, and leaves the
poster showing rather than firing a hundred 404s.

## How it is rendered

`ScrollFrameAnimation` (`src/components/motion/ScrollFrameAnimation.tsx`) is the
reusable piece; `EntryHero` is just content passed to it.

- **Canvas, not `<img>`.** One canvas, one blit per frame change. Frames are
  decoded off the main thread with `img.decode()` as they arrive.
- **GSAP ScrollTrigger**, because `MotionProvider` already drives
  `ScrollTrigger.update` from Lenis — the scrub and the page's smooth scrolling
  run off one clock. Reading native scroll separately puts the frames a beat
  behind the eased position.
- **Sticky, not `pin: true`.** No pin-spacer, no layout shift, still correct if
  GSAP never loads.
- **Draws are rAF-gated** and skipped when the frame index has not moved, so a
  burst of scroll events inside one animation frame paints once. Nothing in
  React re-renders while scrubbing — the playhead is a ref.
- **Loading is playhead-first.** Frame 0 alone, painted as soon as it decodes;
  then the eight frames after it; then everything else, with the queue re-sorted
  by distance from the playhead on every completion, so scrolling steers the
  download rather than waiting on it. A frame that has not arrived holds the
  nearest earlier one, never a blank.
- **Canvas backing store** is `min(DPR, 2)` and capped at 2560px wide — beyond
  that it is upscaling a 1280px source further for no visible gain.
- **The frame list is read off disk at build time** by `src/lib/frames.ts`,
  sorted by the numeric suffix rather than lexicographically (`frame-10` must
  come after `frame-2`). There is no frame count to keep in sync by hand.

## What currently ships

Built from `media-source/569c51a4-2e94-486e-a4c8-194d5020c972.mp4` — 1280×720,
24 fps, 192 frames, 8.02 s. Its length divides evenly, so the sample lands on
exact counts with no seam:

```bash
node scripts/build-frames.mjs media-source/569c51a4-….mp4   --name entry --frames 96 --width 1280 --quality 54
node scripts/build-frames.mjs media-source/569c51a4-….mp4   --name entry-mobile --frames 48 --width 854 --quality 54
```

**96 frames / 2.91 MB** for desktop, **48 frames / 0.92 MB** for viewports under
1024px, which take the smaller poster too. Under `prefers-reduced-motion`,
under Save-Data, below 480px, or with no JS, nothing past the poster is fetched
and the section is a plain one-screen hero with the copy stacked in flow.

Note the earlier 125-still zip in `media-source/` was a **truncated export** of
this same video — it stopped once the camera was inside and never showed the
lift. The video is the source of truth; ignore the zip.

### Where the move turns

Read off the shipped frames. `EntryHero`'s copy beats are timed to these, and
they are not evenly spaced — the move is outside for its first fifth and spends
its last fifth raising the car:

| Progress | On screen |
|---|---|
| 0.00 | exterior, door shut |
| 0.18 | door starting to lift |
| 0.33 | door most of the way up, dark interior behind |
| 0.45 | at the threshold |
| 0.58 | inside, car ahead between the posts |
| 0.71 | up close to the car, still on the ground |
| 0.83 | lift rising, car off the ground |
| 1.00 | car high on the lift — the hero shot |

**Re-read this table off the new frames if the footage is ever re-rendered.**
Evenly-spaced beats over an unevenly-paced move put "Inside" on screen while
the camera is still in the car park.

## The AVIF trap

The frames are AVIF, and there is one way to get this badly wrong.

`ffmpeg -f image2 … out/%04d.avif` will happily write a numbered run of files.
They carry a valid `ftypavif` header, ffprobe reads them, and the total comes
out suspiciously small. **Every browser refuses them.** They are bare AV1
streams without the HEIF item boxes a real AVIF needs — and worse, they are
inter-coded, so most of those "frames" are delta frames that could not stand
alone even in principle.

Only ffmpeg's dedicated AVIF muxer writes valid stills, and it emits one file
per invocation. `build-frames.mjs` therefore extracts the sampled frames as PNG
in a single pass, then encodes them individually, eight at a time. Roughly 70
seconds for 96 frames.

Two smaller traps in the same area:

- **Round the sample rate.** At full float precision it lands on values like
  `11.993004580369975`, which becomes the timebase `160425687/1923985999`;
  libaom rejects that with a bare "Invalid argument" and writes nothing.
- **The poster stays WebP.** It is the one image every browser must be able to
  show, including the ones that will never get past frame 1.

A browser too old for AVIF needs no fallback set: frame 1 fails to decode, the
loader's guard stops after that single request, and the visitor keeps the
poster and a static hero.

## Sharpness

The source is 720p and the hero is full-bleed, so every frame is enlarged.
Three things decide how soft it looks, and all three are easy to get wrong:

1. **Encode quality.** WebP at q54 — where the old 3 MB budget forced it —
   visibly mushes the corrugated wall and the dark interior gradients.
2. **Where the enlargement happens.** Doing it at encode time with lanczos plus
   a light unsharp (`--sharpen`, on by default) beats leaving it to the
   browser's filter at draw time.
3. **`ctx.imageSmoothingQuality`.** It defaults to `"low"`, a cheap bilinear
   filter, on every draw. ScrollFrameAnimation sets it to `"high"` — and
   re-applies it after every resize, because assigning `canvas.width` resets
   the entire 2D context to its defaults and silently undoes it.

## The second sequence

`/tools` carries the same component with the pickup-on-a-lift footage:

```bash
node scripts/build-frames.mjs media-source/Pickup_truck_on_car_lift_….mp4   --name lift --frames 64 --width 1440 --quality 34
node scripts/build-frames.mjs media-source/Pickup_truck_on_car_lift_….mp4   --name lift-mobile --frames 32 --width 900 --quality 36
```

**64 frames / 1.9 MB**, 32 / 0.56 MB on phones. Fewer and slightly smaller than
the homepage set because it is one locked-off rise rather than a journey, and
350vh rather than 500 for the same reason — stretching a single lift movement
over five screens just makes it crawl.

It sits below the fold, which is why `ScrollFrameAnimation` holds every request
behind an IntersectionObserver until the section is within a screen of the
viewport. A visitor who never scrolls that far pays only for the poster. A
sequence used as a page's hero is already intersecting on load, so the gate
costs it nothing.

## Previewing it when your own machine says no

`prefers-reduced-motion` follows the operating system, and **Windows reports
"reduce" whenever Settings → Accessibility → Visual effects → Animation effects
is off** — a common default, and what battery saver does. On such a machine
this section is a still image, and there is no way to tell that apart from a
bug.

So `?motion=on` forces the scrub for one page load and `?motion=off` forces the
still:

    http://localhost:3000/?motion=on

It is a preview switch for whoever is building or demoing the site: per-URL,
never persisted, and it changes nothing for anyone who does not type it. Note
that `MotionProvider` still skips Lenis under reduced motion, so the preview
scrubs against raw native scroll — correct, but without the site's usual
easing.

**The default is to respect the setting**, which is what Apple and most
comparable sites do: a full-screen camera push is exactly the kind of motion
that triggers vestibular symptoms. If you would rather every visitor got the
animation regardless, that is a one-line change in `useScrubEnabled` — but it
is a deliberate accessibility trade, not an oversight.

## Known compromise

The source is 720p, and a full-bleed hero on a 1440×900 window cover-fits it to
roughly 1600×900 — about a 25% upscale. Soft, but acceptable on dark cinematic
footage. Re-render at 1080p if it ever needs to be sharper; the pipeline needs
no changes for it.

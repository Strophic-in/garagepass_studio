"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/** Concurrent frame requests. Enough to saturate HTTP/2 without starving the
 *  rest of the page; more than this and the first frames arrive later, not
 *  sooner. */
const CONCURRENCY = 6;

/** Frames either side of the playhead that are fetched before the background
 *  fill starts, so the first flick of scroll is already covered. */
const PRIORITY_WINDOW = 8;

/** Hard ceiling on canvas backing-store width. The sources are 1280px wide, so
 *  a canvas beyond this is paying fill rate to upscale further with no detail
 *  to show for it. */
const MAX_CANVAS_WIDTH = 2560;

export type ScrollFrameAnimationProps = {
  /** Desktop frame URLs, in playback order. */
  frames: string[];
  /** Smaller set for narrow viewports. Falls back to `frames` if omitted. */
  framesMobile?: string[];
  /** Shown underneath at all times; the LCP candidate and the no-JS picture. */
  poster: string;
  /** Smaller poster for narrow viewports. Falls back to `poster` if omitted. */
  posterMobile?: string;
  /** Describes the sequence for assistive tech and as the no-JS fallback. */
  alt: string;
  /** Viewport heights of scroll the sequence is spread across. 300–500 reads
   *  unhurried; below ~250 the move outruns the copy. */
  scrollHeightVh?: number;
  className?: string;
  /** Overlay content. Server-rendered; see the note on `[data-beat]` below. */
  children?: ReactNode;
};

/**
 * A pinned section where a frame sequence scrubs against scroll.
 *
 * ── Rendering ──────────────────────────────────────────────────────────────
 * Frames are drawn to a single canvas. The alternative — a stack of `<img>`
 * elements toggled by index — puts hundreds of nodes in the DOM and decodes on
 * the main thread at the moment of the swap, dropping frames exactly when the
 * user is scrolling fastest. Here each frame is decoded off-thread by
 * `img.decode()` as it arrives, and drawing is then a plain blit.
 *
 * Drawing is gated behind `requestAnimationFrame` and skipped when the target
 * index has not moved, so a burst of scroll events within one frame paints
 * once. Nothing in React re-renders while scrubbing: the playhead lives in a
 * ref, not in state.
 *
 * ── Scroll ─────────────────────────────────────────────────────────────────
 * GSAP ScrollTrigger, because `MotionProvider` already drives
 * `ScrollTrigger.update` from Lenis — so the scrub and the page's smooth
 * scrolling run off one clock. Reading native scroll separately here would put
 * the frames a beat behind the eased scroll position.
 *
 * The pin itself is CSS `position: sticky`, not ScrollTrigger's `pin: true`:
 * sticky needs no pin-spacer, cannot introduce layout shift, and stays correct
 * if GSAP never loads. ScrollTrigger is left responsible only for progress.
 *
 * ── Loading ────────────────────────────────────────────────────────────────
 * Frame 0 is fetched alone and painted the moment it decodes. The rest are
 * pulled newest-need-first: whichever pending frame is closest to the playhead
 * goes next, so scrolling steers the download queue instead of waiting on it.
 * Until a frame arrives the nearest earlier one is held, so a half-loaded
 * sequence still tracks scroll rather than freezing.
 *
 * ── Degrading ──────────────────────────────────────────────────────────────
 * Under `prefers-reduced-motion` or Save-Data, and with no JS at all, the
 * section is one screen tall, nothing is fetched beyond the poster, and the
 * overlay copy sits in normal flow as a readable stack. `data-seq="scrub"`
 * only lands once this component has decided to run, and every pinned style
 * hangs off it.
 *
 * ── Overlay copy ───────────────────────────────────────────────────────────
 * Children are rendered as-is, so they can be server components and stay in
 * the initial HTML. Any descendant carrying
 *
 *     data-beat="<fade-in start>,<fully in>,<fade-out start>,<fully out>"
 *
 * (progress units, 0–1) is cross-faded against scroll. Collapse the first pair
 * for a beat already in at the top, the last for one that holds to the bottom.
 * Nothing is hidden until the scrub is confirmed running.
 */
export function ScrollFrameAnimation({
  frames,
  framesMobile,
  poster,
  posterMobile,
  alt,
  scrollHeightVh = 500,
  className,
  children,
}: ScrollFrameAnimationProps) {
  const track = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scrubbing = useScrubEnabled();
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    if (!scrubbing) return;

    const el = track.current;
    const cv = canvas.current;
    const stage = cv?.parentElement;
    if (!el || !cv || !stage) return;

    // `alpha: false` lets the compositor skip blending a full-bleed opaque
    // photograph against what is behind it.
    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return;

    /**
     * Canvas defaults to "low", a cheap bilinear filter, and every frame here
     * is rescaled to the viewport — so that default is the difference between
     * a crisp frame and a soft one. It matters most now that frames ship
     * larger than most canvases and are usually scaled *down*, which is where
     * the better filter earns its keep.
     *
     * Re-applied after every resize, not set once: assigning `canvas.width`
     * resets the whole 2D context to its defaults, this setting included. Set
     * it only at startup and the very first resize silently reverts it.
     */
    const setFilterQuality = () => {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };
    setFilterQuality();

    // Narrow viewports get the reduced set: same move, fewer and smaller
    // frames. Chosen once per mount — a mid-session rotation keeps the set it
    // started with rather than re-downloading the other one.
    // Phones only. Tablets are wide enough that the small set would visibly
    // upscale on them — a 768px-wide iPad at DPR 2 needs a ~1536px canvas,
    // which the phone set cannot fill — so they take the full one.
    const urls =
      framesMobile?.length && !window.matchMedia("(min-width: 768px)").matches
        ? framesMobile
        : frames;

    const count = urls.length;
    if (!count) return;

    const store: (HTMLImageElement | null)[] = new Array(count).fill(null);
    const last = count - 1;

    let cancelled = false;
    let target = 0; // frame index the playhead is on
    let drawn = -1; // frame index actually painted on the canvas
    let raf = 0;
    // --- drawing ----------------------------------------------------------

    /**
     * Draw one frame, cover-fit: the canvas equivalent of `object-fit: cover`.
     * The larger of the two axis ratios wins, so the image always fills the
     * canvas and overflows on one axis rather than leaving bars.
     */
    const renderFrame = (img: HTMLImageElement) => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      const scale = Math.max(
        cv.width / img.naturalWidth,
        cv.height / img.naturalHeight,
      );
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
    };

    /**
     * Draw the nearest frame at or before `i` that has arrived.
     *
     * Searching backwards only is deliberate: reaching forward to a later
     * loaded frame and then back again as the gap fills in would show the move
     * jumping ahead and returning, which reads as a stutter. Holding the
     * previous frame instead reads as the move simply pausing.
     */
    const drawNearest = (i: number) => {
      for (let j = i; j >= 0; j--) {
        const img = store[j];
        if (!img) continue;
        if (drawn === j) return;
        drawn = j;
        renderFrame(img);
        return;
      }
    };

    /** Coalesce every request to repaint into at most one per animation frame. */
    const schedule = () => {
      if (raf || cancelled) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        drawNearest(target);
      });
    };

    // --- sizing -----------------------------------------------------------

    const resize = () => {
      const cssW = stage.clientWidth;
      const cssH = stage.clientHeight;
      // A stage with no box yet (still laying out, or display:none) would give
      // a zero-sized canvas and a division by zero below.
      if (!cssW || !cssH) return;

      // Cap DPR at 2 and the backing store at MAX_CANVAS_WIDTH — past that the
      // canvas is upscaling a 1280px source further and charging fill rate for
      // it on every frame. One scale factor for both axes, so the canvas keeps
      // the stage's aspect ratio and cover-fit stays exact.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = Math.min(dpr, MAX_CANVAS_WIDTH / cssW);
      const w = Math.round(cssW * scale);
      const h = Math.round(cssH * scale);
      if (cv.width === w && cv.height === h) return;

      cv.width = w;
      cv.height = h;
      setFilterQuality();
      // Resizing a canvas clears it, so whatever was showing has to be redrawn.
      drawn = -1;
      schedule();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    resize();

    // --- loading ----------------------------------------------------------

    const pending = new Set<number>();
    /**
     * Every index ever handed to the loader. The priority window and the
     * background fill overlap, so without this the first frames after the
     * opening one are queued twice — requested twice, decoded twice, and
     * counted twice.
     */
    const requested = new Set<number>([0]);
    let inFlight = 0;

    /** Queue a frame unless it has already been asked for. */
    const enqueue = (i: number) => {
      if (requested.has(i)) return;
      requested.add(i);
      pending.add(i);
    };

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.src = urls[i];
        img
          .decode()
          .then(() => {
            if (cancelled) return;
            store[i] = img;
            // A frame between the playhead and whatever is currently showing
            // is an improvement on it, so take it immediately.
            if (i <= target && i > drawn) schedule();
          })
          // A missing or corrupt frame is survivable — drawNearest holds the
          // previous one — so never reject and stall the queue over it.
          .catch(() => {})
          .then(resolve);
      });

    /**
     * Keep `CONCURRENCY` requests in flight, always picking the pending frame
     * closest to the playhead. Re-choosing on every completion rather than
     * fixing an order up front is what lets scrolling steer the queue: jump to
     * the middle of the section and the next requests are the frames there,
     * not whatever was next in a list decided at mount.
     */
    const pump = () => {
      while (!cancelled && inFlight < CONCURRENCY && pending.size) {
        let next = -1;
        let bestDistance = Infinity;
        for (const i of pending) {
          const d = Math.abs(i - target);
          if (d < bestDistance) {
            bestDistance = d;
            next = i;
          }
        }
        pending.delete(next);
        inFlight++;
        void load(next).then(() => {
          inFlight--;
          pump();
        });
      }
    };

    // --- scroll -----------------------------------------------------------

    let ctxGsap: { revert: () => void } | undefined;

    const begin = async () => {
      // Frame 0 first and alone: it is what the canvas fades in on, and every
      // other request should queue behind it.
      await load(0);
      if (cancelled) return;

      // If it did not arrive the sequence has not been generated, or the
      // deploy dropped it. Stop rather than firing another hundred requests
      // that will all 404 — the poster underneath is a complete picture on its
      // own and the section reads as an ordinary still hero.
      if (!store[0]) return;

      setPainted(true);

      // Cover the neighbourhood of the opening frame before starting the
      // background fill, so the first flick of scroll is already smooth.
      for (let i = 1; i <= Math.min(PRIORITY_WINDOW, last); i++) enqueue(i);
      pump();

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // Everything else, queued behind the priority window. `pump` re-sorts by
      // distance from the playhead on every completion, so adding them all at
      // once does not mean fetching them in index order.
      for (let i = 1; i <= last; i++) enqueue(i);
      pump();

      ctxGsap = gsap.context(() => {
        const beats = gsap.utils
          .toArray<HTMLElement>("[data-beat]")
          .map((node) => ({ node, range: parseBeat(node.dataset.beat) }));
        const rail = el.querySelector<HTMLElement>("[data-seq-rail]");

        /**
         * Push one position along the section out to the canvas, the copy
         * beats and the progress rail.
         *
         * Driven from the tween below rather than straight off scroll, so all
         * three share the scrub's eased playhead and cannot drift apart.
         */
        const apply = (p: number, frame: number) => {
          if (frame !== target) {
            target = frame;
            schedule();
          }

          for (const { node, range } of beats) {
            const o = beatOpacity(p, range);
            gsap.set(node, { opacity: o, y: (1 - o) * 24 });
          }

          // Never quite zero: a rail that vanishes at the top of the section
          // reads as a rendering glitch rather than as "no progress yet".
          if (rail) gsap.set(rail, { scaleY: Math.max(0.02, p) });
        };

        /*
          The playhead is an ordinary object tweened from frame 0 to the last
          frame, with the tween's own progress bound to scroll position.

          `scrub: 0.3` is what makes this feel like footage rather than a
          slideshow: the playhead chases the scroll position over ~0.3s instead
          of snapping to it, so a flick of the wheel plays through the frames
          in between and coasts to a stop, and a reversal eases round rather
          than jumping. `snap: "frame"` keeps the value on whole frames so the
          index never lands between two images, and `ease: "none"` keeps the
          mapping linear — any other ease would make the move speed up and slow
          down under a constant scroll.

          `invalidateOnRefresh` re-reads the start/end on resize, so the
          mapping stays correct when the section's pixel height changes.
        */
        const playhead = { frame: 0 };

        gsap.to(playhead, {
          frame: last,
          ease: "none",
          snap: "frame",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            invalidateOnRefresh: true,
            // A refresh remeasures but does not re-run the tween's onUpdate,
            // so without this the beats keep whatever the old measurements
            // gave them until the next scroll event.
            onRefresh: (self) =>
              apply(self.progress, Math.round(self.progress * last)),
          },
          onUpdate: () => {
            const frame = Math.round(playhead.frame);
            apply(last ? frame / last : 0, frame);
          },
        });

        // Nothing above runs until scroll actually moves, and on arrival that
        // would leave every beat at its unstyled default — all of them at full
        // opacity, stacked on each other — until the first wheel tick.
        apply(0, 0);
      }, el);

      // New markup has mounted and the canvas has taken over; pin and trigger
      // positions need remeasuring.
      ScrollTrigger.refresh();
    };

    /*
      Hold the whole sequence — frames, GSAP, everything — until the section is
      within a screen of the viewport.

      A sequence used as the page's hero is already intersecting on load, so
      this costs it nothing. One further down a page would otherwise pull a
      couple of megabytes during the initial load for a section the visitor may
      never reach, competing with the content they are actually looking at.

      IntersectionObserver reports the current state as soon as it observes, so
      there is no separate "already visible?" branch to get wrong.
    */
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        void begin();
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      pending.clear();
      requested.clear();
      // Drop references to every decoded frame so the bitmaps can be collected
      // rather than being held alive by this closure.
      store.fill(null);
      ctxGsap?.revert();
    };
  }, [scrubbing, frames, framesMobile]);

  return (
    <div
      ref={track}
      data-seq={scrubbing ? "scrub" : "static"}
      className={`seq-track ${className ?? ""}`}
      style={{ ["--seq-scroll" as string]: `${scrollHeightVh}svh` }}
    >
      <div className="seq-stage">
        {/*
          The poster is the section's LCP element, so it is a plain <img> in a
          <picture> rather than next/image: it stays a normal LCP candidate the
          browser can prioritise from the HTML, and the media query is resolved
          during preload scanning — before any JavaScript runs and before the
          component has decided which frame set to use.
        */}
        <picture>
          {posterMobile && (
            <source srcSet={posterMobile} media="(max-width: 767px)" />
          )}
          <img
            src={poster}
            alt={alt}
            fetchPriority="high"
            decoding="sync"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        </picture>

        {scrubbing && (
          <canvas
            ref={canvas}
            aria-hidden
            className={`absolute inset-0 -z-10 h-full w-full transition-opacity duration-500 ${
              painted ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Legibility scrim. The frames are bright at the start and dark at the
            end, so the copy must not depend on the footage behind it. */}
        <div
          aria-hidden
          className="seq-scrim pointer-events-none absolute inset-0 -z-10"
        />

        {scrubbing && <ProgressRail />}

        {children}
      </div>
    </div>
  );
}

/**
 * Hairline rail down the right edge, filled by scroll.
 *
 * The section holds for several screens; with no progress cue a long pin reads
 * as the page having frozen. Scaled from the same ScrollTrigger that drives
 * the frames, so it cannot drift out of step with them.
 */
function ProgressRail() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-5 hidden h-32 w-px -translate-y-1/2 bg-hairline md:block"
    >
      <span
        data-seq-rail
        className="block h-full w-px origin-top bg-hazard"
        style={{ transform: "scaleY(0.02)" }}
      />
    </div>
  );
}

/** `"0,0,0.26,0.36"` → `[0, 0, 0.26, 0.36]`. */
function parseBeat(value: string | undefined): [number, number, number, number] {
  const n = (value ?? "").split(",").map(Number);
  if (n.length !== 4 || n.some((x) => !Number.isFinite(x))) return [0, 0, 1, 1];
  return [n[0], n[1], n[2], n[3]];
}

/**
 * Opacity of one beat at progress `p`.
 *
 * A collapsed leading pair (`a >= b`) means the beat is already fully in at the
 * top of the section; a trailing stop at or past 1 means it holds to the
 * bottom. Without those the section opens and closes on an empty frame.
 */
function beatOpacity(p: number, [a, b, c, d]: [number, number, number, number]) {
  if (p < a) return a >= b ? 1 : 0;
  if (p < b) return (p - a) / (b - a);
  if (p <= c) return 1;
  if (p < d) return 1 - (p - c) / (d - c);
  return c >= 1 || d >= 1 ? 1 : 0;
}

const SCRUB_QUERIES = ["(prefers-reduced-motion: reduce)"] as const;

/**
 * Whether this visitor should get the scrub at all.
 *
 * False on the server and through hydration, so the section's server HTML is
 * always the static, fully-readable one and what React hydrates matches it. It
 * flips to true on the client only if motion is wanted and the connection is
 * not asking to be spared.
 *
 * A store rather than an effect, so a visitor who turns reduced motion on, or
 * drags a window across the breakpoint, is answered live rather than being
 * left on whatever was true at mount. (An effect that calls setState on mount
 * also trips `react-hooks/set-state-in-effect`, and rightly so.)
 *
 * ── Previewing it when your own machine says no ────────────────────────────
 * `prefers-reduced-motion` follows the operating system, and Windows reports
 * "reduce" whenever *Settings → Accessibility → Visual effects → Animation
 * effects* is off — which is a common default, and what battery saver does.
 * On such a machine this section is a still image and there is no way to tell
 * that apart from a bug.
 *
 * So `?motion=on` forces the scrub for one page load and `?motion=off` forces
 * the still. It is a preview switch for whoever is building or demoing the
 * site, not a visitor-facing setting: it is per-URL, never persisted, and
 * changes nothing for anyone who does not type it.
 */
function useScrubEnabled() {
  return useSyncExternalStore(
    (onChange) => {
      const lists = SCRUB_QUERIES.map((q) => window.matchMedia(q));
      lists.forEach((l) => l.addEventListener("change", onChange));
      return () =>
        lists.forEach((l) => l.removeEventListener("change", onChange));
    },
    () => {
      const forced = new URLSearchParams(window.location.search).get("motion");
      if (forced === "on") return true;
      if (forced === "off") return false;

      // `saveData` is the one signal still honoured without being asked: it is
      // an explicit request not to spend the visitor's data, and this section
      // is megabytes of it.
      const conn = (
        navigator as Navigator & { connection?: { saveData?: boolean } }
      ).connection;
      if (conn?.saveData) return false;

      return true;
    },
    () => false,
  );
}

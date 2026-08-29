"use client";

import { useEffect, useRef, useState } from "react";
import type { Clip } from "@/lib/videos";
import { cn } from "@/lib/utils";

/**
 * A muted, looping background clip that only loads when it is near the
 * viewport and only plays while it is on screen.
 *
 * The poster is a real `<img>` underneath rather than the `poster` attribute,
 * so it is a normal LCP candidate the browser can prioritise and lazy-load
 * consistently. The video fades in over it once it can actually play, which
 * keeps CLS at zero — the box never changes size.
 *
 * Nothing downloads at all under Save-Data: those visitors get the poster,
 * which carries the same information.
 */
export function AmbientVideo({
  clip,
  priority = false,
  className,
  objectPosition = "center",
  parallax = 10,
}: {
  clip: Clip;
  /** Set on the first clip on the page; skips lazy-loading and decodes eagerly. */
  priority?: boolean;
  className?: string;
  objectPosition?: string;
  /**
   * Scroll-linked drift, as a percentage of the media layer's own height.
   * The layer is rendered 30% taller than its frame, so the default travel
   * never exposes an edge. Pass 0 to pin the media to the page.
   */
  parallax?: number;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  // Decide whether this clip is worth downloading at all, and latch it on as
  // it approaches the viewport.
  useEffect(() => {
    // No `prefers-reduced-motion` gate. Windows reports "reduce" whenever
    // its animation effects are off, which is a common default and what
    // battery saver does, so honouring it here left the whole site showing
    // nothing but poster stills. Motion runs for everyone; `?motion=off`
    // opts out. See ScrollFrameAnimation for the same decision.
    //
    // Save-Data is still honoured: that one is an explicit request from the
    // visitor not to spend their data.
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (conn?.saveData) return;

    const el = holder.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // Latch on first intersection and never unmount. Tearing the <video>
        // down offscreen would replay the fade-in every time the user scrolls
        // back past it, which reads as flicker.
        if (entry.isIntersecting) setActive(true);
      },
      { rootMargin: priority ? "0px" : "200px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [priority]);

  // Playback, kept in a separate effect that runs *after* `active` has put the
  // <video> in the DOM. Doing this in the observer above would read
  // `video.current` on the same tick that schedules the render, so the ref is
  // still null and the clip never starts — it just sits on its poster frame.
  useEffect(() => {
    if (!active) return;

    const el = holder.current;
    const v = video.current;
    if (!el || !v) return;

    // Observing fires immediately with the current state, so a clip that is
    // already on screen starts here rather than waiting for the next crossing.
    const io = new IntersectionObserver(([entry]) => {
      // Pause offscreen: several clips decoding at once is a real source of
      // dropped frames and battery drain.
      if (entry.isIntersecting) void v.play().catch(() => {});
      else v.pause();
    });

    io.observe(el);
    return () => io.disconnect();
  }, [active]);

  return (
    <div ref={holder} className={cn("absolute inset-0 overflow-hidden", className)}>
      {/*
        The media sits on an over-tall layer so parallax has somewhere to
        travel. 15% of headroom top and bottom against 10% of drift leaves
        margin at every viewport ratio.
      */}
      <div
        data-parallax={parallax > 0 ? parallax : undefined}
        className="absolute inset-x-0 -inset-y-[15%] will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- poster is a plain
            img so it stays the LCP candidate and is not rewritten by the optimizer. */}
        <img
          src={clip.poster}
          alt={clip.alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition }}
        />

        {active && (
          <video
            ref={video}
            // aria-hidden: the poster <img> above already carries the description,
            // so announcing it twice is noise.
            aria-hidden
            muted
            loop
            playsInline
            preload="metadata"
            poster={clip.poster}
            onCanPlay={() => setReady(true)}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              ready ? "opacity-100" : "opacity-0",
            )}
            style={{ objectPosition }}
          >
            <source src={clip.src} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
}

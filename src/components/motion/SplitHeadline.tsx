"use client";

import { useEffect, useRef } from "react";

/**
 * Reveals a headline line-by-line, each line wiping up from behind a mask.
 *
 * This is a client component, but Next still server-renders it, so the heading
 * text is in the initial HTML exactly as authored. GSAP's SplitText only
 * rewrites the DOM after hydration, and it preserves the text content when it
 * does — a crawler reads the same words either way.
 *
 * If anything here fails the heading simply stays as it was: visible, static,
 * fully legible. Nothing is hidden ahead of the animation that could be left
 * hidden by it.
 */
export function SplitHeadline({
  as: Tag = "h1",
  className,
  id,
  children,
}: {
  as?: "h1" | "h2";
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // No `prefers-reduced-motion` gate. Windows reports "reduce" whenever
    // its animation effects are off, which is a common default and what
    // battery saver does, so honouring it here left the whole site showing
    // nothing but poster stills. Motion runs for everyone; `?motion=off`
    // opts out. See ScrollFrameAnimation for the same decision.

    const el = ref.current;
    if (!el) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      try {
        const [{ gsap }, { SplitText }] = await Promise.all([
          import("gsap"),
          import("gsap/SplitText"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(SplitText);

        // Wait for webfonts: splitting before they swap measures the fallback
        // and leaves the mask boxes the wrong height.
        await document.fonts?.ready;
        if (cancelled) return;

        ctx = gsap.context(() => {
          const split = new SplitText(el, {
            type: "lines",
            // Each line gets a wrapper with overflow hidden, so the line can
            // travel up from behind it rather than just fading.
            linesClass: "split-line",
            mask: "lines",
          });

          gsap.from(split.lines, {
            yPercent: 115,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.09,
            // The hero is above the fold; play on load rather than on scroll.
            delay: 0.15,
          });
        }, el);
      } catch {
        // SplitText unavailable — the heading is already visible, so there is
        // nothing to undo.
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

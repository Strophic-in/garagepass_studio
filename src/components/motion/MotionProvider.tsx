"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The motion root. Mounted once in the layout, so every page gets the same
 * behaviour without importing anything.
 *
 * Three responsibilities:
 *
 * 1. Starts Lenis smooth scrolling and drives GSAP's ScrollTrigger from it.
 *
 * 2. Adds `.js-motion` to <html>. Until that lands, `[data-animate]` elements
 *    are fully visible (see globals.css). This is the whole reason a crawler,
 *    a JS failure, or a slow connection still sees a complete, readable page —
 *    hiding content in base CSS and revealing it with JavaScript is how a
 *    heavily-animated site quietly loses its rankings.
 *
 *    The class is deliberately added by the *same* effect that wires the
 *    reveals, and removed again if that wiring throws. Nothing can hide the
 *    copy unless the code that shows it again is already running.
 *
 * 3. Wires the two scroll behaviours, re-running after a client-side
 *    navigation so a soft-navigated page animates exactly like a hard-loaded
 *    one:
 *      - `[data-animate]`  — reveal on entry, siblings staggered together
 *      - `[data-parallax]` — slow scroll-linked drift for background media
 *
 * Motion is not gated on `prefers-reduced-motion` — see the note in the
 * effects below, and the same decision in ScrollFrameAnimation.
 */
export function MotionProvider() {
  const pathname = usePathname();

  // --- Smooth scrolling — set up once for the life of the app -------------
  useEffect(() => {
    // No `prefers-reduced-motion` gate. Windows reports "reduce" whenever
    // its animation effects are off, which is a common default and what
    // battery saver does, so honouring it here left the whole site showing
    // nothing but poster stills. Motion runs for everyone; `?motion=off`
    // opts out. See ScrollFrameAnimation for the same decision.

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    // Dynamically imported so GSAP and Lenis stay out of the initial bundle.
    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.05,
        // Slightly eased-out curve; keeps long scrub sections from feeling loose.
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Native momentum on touch beats an emulated one — smoothing touch
        // scroll is the single most common cause of janky mobile scroll.
        syncTouch: false,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // Recompute pin positions once fonts settle, otherwise reflow shifts them.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      cleanup = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  // --- Reveals and parallax — re-wired on every route --------------------
  useEffect(() => {
    // No `prefers-reduced-motion` gate. Windows reports "reduce" whenever
    // its animation effects are off, which is a common default and what
    // battery saver does, so honouring it here left the whole site showing
    // nothing but poster stills. Motion runs for everyone; `?motion=off`
    // opts out. See ScrollFrameAnimation for the same decision.

    const root = document.documentElement;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        // Only now is it safe to hide anything.
        root.classList.add("js-motion");

        ctx = gsap.context(() => {
          const claimed = new Set<HTMLElement>();

          gsap.utils.toArray<HTMLElement>("[data-animate]").forEach((target) => {
            if (claimed.has(target)) return;

            // Stagger siblings together rather than firing each individually —
            // a grid of cards reads as one gesture, not twelve.
            //
            // Only siblings within a screen of the first one join the group,
            // though. A section's heading and the fine print a thousand pixels
            // below it are also siblings, and sharing a trigger would fire the
            // fine print while it is still far off screen — it would be
            // revealed but never seen to arrive.
            const parent = target.parentElement;
            const siblings = parent
              ? Array.from(
                  parent.querySelectorAll<HTMLElement>(
                    ":scope > [data-animate]",
                  ),
                )
              : [target];

            const top = target.getBoundingClientRect().top;
            const group = siblings.filter(
              (el) =>
                !claimed.has(el) &&
                el.getBoundingClientRect().top - top < window.innerHeight,
            );
            group.forEach((el) => claimed.add(el));

            gsap.to(group, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: {
                // The group's own first element, not the parent: a long
                // section's container starts far above its contents.
                trigger: target,
                // Fires a little before the element reaches the fold, so
                // content is already settled by the time it is properly in
                // view. Anything already on screen at load fires immediately.
                start: "top 85%",
                once: true,
              },
              // Drop the compositor hint once the element has landed; leaving
              // will-change on dozens of nodes costs memory for nothing.
              onComplete: () =>
                group.forEach((el) => {
                  el.style.willChange = "auto";
                }),
            });
          });

          // Background media drifts slower than the page. The element is
          // rendered with vertical headroom (see AmbientVideo), so it can
          // travel without ever exposing an edge.
          gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
            const travel = Number(el.dataset.parallax) || 10;

            gsap.fromTo(
              el,
              { yPercent: -travel },
              {
                yPercent: travel,
                ease: "none",
                scrollTrigger: {
                  trigger: el.parentElement ?? el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });
        });

        // New markup has mounted; pin and trigger positions need remeasuring.
        ScrollTrigger.refresh();
      } catch {
        // GSAP failed to load or wire up. Un-hide everything rather than
        // leaving the page blank — a visible unanimated page is always the
        // correct failure mode.
        root.classList.remove("js-motion");
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
      // `.js-motion` deliberately stays put across a route change. Removing it
      // here would un-hide the outgoing page's elements for the tick before
      // the next effect re-adds it, which reads as a flash of content.
    };
  }, [pathname]);

  return null;
}

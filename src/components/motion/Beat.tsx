import type { ReactNode } from "react";

/**
 * One beat of copy inside a `ScrollFrameAnimation`, cross-faded against scroll.
 *
 * `range` is [fade-in start, fully in, fade-out start, fully out] in progress
 * units, 0–1 across the pinned section. Two rules matter:
 *
 *   - Leave a small gap between one beat's last stop and the next one's first.
 *     Overlapping them puts two full-width headlines at half opacity in the
 *     same spot, which reads as a rendering fault rather than a transition.
 *   - Collapse the first pair (`[0, 0, …]`) for a beat already fully in at the
 *     top of the section, and the last (`[…, 1, 1]`) for one that holds to the
 *     bottom, or the section opens and closes on an empty frame.
 *
 * Deliberately NOT a client component, and the range travels as a data
 * attribute rather than a prop. That is what lets the copy stay server
 * rendered: none of this ships to the browser as JavaScript, the words are in
 * the initial HTML, and nothing is hidden until the scrub confirms it is
 * running. ScrollFrameAnimation finds these by `[data-beat]` and drives them
 * from its own ScrollTrigger.
 */
export function Beat({
  range,
  className,
  children,
}: {
  range: [number, number, number, number];
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={className ? `seq-panel ${className}` : "seq-panel"}
      data-beat={range.join(",")}
    >
      {children}
    </div>
  );
}

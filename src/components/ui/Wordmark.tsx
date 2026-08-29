import { cn } from "@/lib/utils";

/**
 * The GaragePass wordmark.
 *
 * Live text rather than an image, deliberately. It is the site name in the
 * header link on every page, so it wants to be selectable, translatable, and
 * readable by a crawler — and it stays crisp at any size and in any colour
 * scheme without shipping a file.
 *
 * The look is set by three things:
 *
 *   - a hard oblique. Oswald ships no italic, so a synthesised `skewX` is the
 *     honest way to get the forward lean; faux-italic on a condensed grotesque
 *     reads as intentional in a way it would not on a serif.
 *   - negative tracking. The stock header used `0.18em`, which suits small
 *     nav labels and makes a logotype look like a caption. A wordmark wants
 *     its letters touching.
 *   - speed streaks trailing the G, skewed to the same angle so they read as
 *     motion behind the word rather than as decoration beside it.
 *
 * `SKEW` is shared with the app icon so the two lean by exactly the same
 * amount; see `scripts/build-icons.mjs`.
 */
export function Wordmark({
  className,
  streaks = true,
}: {
  className?: string;
  /** Off in tight spots — the streaks need room to read as motion. */
  streaks?: boolean;
}) {
  return (
    <span className={cn("wordmark", className)}>
      {streaks && (
        <span aria-hidden className="wordmark-streaks">
          <i />
          <i />
          <i />
        </span>
      )}
      <span className="wordmark-text">
        Garage<span className="text-hazard">Pass</span>
      </span>
    </span>
  );
}

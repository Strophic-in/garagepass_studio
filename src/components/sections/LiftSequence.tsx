import { site } from "@/lib/site";
import { readFrameSet } from "@/lib/frames";
import { ButtonLink } from "@/components/ui/primitives";
import { Beat } from "@/components/motion/Beat";
import { ScrollFrameAnimation } from "@/components/motion/ScrollFrameAnimation";

/**
 * A pickup going up on a two-post lift, scrubbed against scroll.
 *
 * The payoff for the tool inventory above it: the list says the lifts exist,
 * this shows one doing the thing you came for. The move is a single locked-off
 * side-on shot of the truck rising from the floor to full height, so the copy
 * beats track height rather than location:
 *
 *   0.00 → 0.34  wheels still down    what the lift is
 *   0.30 → 0.68  mid-rise             why the height matters
 *   0.64 → 1.00  at full height       what it costs you (nothing extra)
 *
 * Shorter than the homepage sequence — 350vh against 500 — because it is one
 * continuous rise rather than a journey through four places, and stretching it
 * further would just make the truck crawl.
 *
 * A Server Component: the frame list is read off disk at build time and every
 * word here is in the initial HTML. Nothing loads until the section is within
 * a screen of the viewport, so a visitor who never scrolls this far never pays
 * for it.
 */
export function LiftSequence() {
  const desktop = readFrameSet("lift");
  const mobile = readFrameSet("lift-mobile");

  return (
    <section
      id="lift-sequence"
      aria-labelledby="lift-sequence-heading"
      className="relative isolate"
    >
      <ScrollFrameAnimation
        frames={desktop.urls}
        framesMobile={mobile.urls}
        poster={desktop.poster}
        posterMobile={mobile.poster}
        alt="A pickup truck being raised on a two-post lift at GaragePass Oakland"
        scrollHeightVh={350}
      >
        <div className="seq-copy">
          <Beat range={[0, 0, 0.26, 0.34]}>
            <p className="eyebrow mb-4">The lift</p>
            <h2
              id="lift-sequence-heading"
              className="max-w-3xl text-[clamp(1.9rem,4.5vw,3.5rem)] leading-[1.02] font-bold uppercase"
            >
              A two-post lift
              <br />
              <span className="text-hazard">beats four jack stands.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel">
              Every bay has one. Drive on, set the arms, and take the whole
              vehicle up. No crawling, no creeper, no wondering whether the
              stands are seated right.
            </p>
          </Beat>

          <Beat range={[0.3, 0.38, 0.6, 0.68]}>
            <p className="eyebrow mb-4">Head height</p>
            <h2 className="max-w-3xl text-[clamp(1.9rem,4.5vw,3.5rem)] leading-[1.02] font-bold uppercase">
              Stand up
              <br />
              <span className="text-hazard">under your own car.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel">
              Exhaust work, gearbox drops, suspension, a clutch: the jobs that
              are miserable on the floor are ordinary once the car is at chest
              height and properly lit.
            </p>
          </Beat>

          <Beat range={[0.64, 0.72, 1, 1]}>
            <p className="eyebrow mb-4">Included</p>
            <h2 className="max-w-3xl text-[clamp(1.9rem,4.5vw,3.5rem)] leading-[1.02] font-bold uppercase">
              No rental fee.
              <br />
              <span className="text-hazard">It comes with the bay.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel">
              The lift, the hoist, the transmission jack and everything on the
              tool wall are part of the membership. You book time, not
              equipment.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={site.breely.join} conversion="tools-lift-join">
                Book a bay
              </ButtonLink>
              <ButtonLink href="/tour" variant="secondary">
                See it in person
              </ButtonLink>
            </div>
          </Beat>
        </div>
      </ScrollFrameAnimation>
    </section>
  );
}

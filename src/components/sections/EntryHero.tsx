import { site, tiers } from "@/lib/site";
import { readFrameSet } from "@/lib/frames";
import { ButtonLink } from "@/components/ui/primitives";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { Beat } from "@/components/motion/Beat";
import { ScrollFrameAnimation } from "@/components/motion/ScrollFrameAnimation";

/**
 * Section 00 — arrival.
 *
 * Five screens of scroll drive one continuous move: the shop's roll-up door
 * fills the frame shut, rolls up, the camera pushes through onto the shop
 * floor and up to a car, and the lift takes it into the air. Four beats of
 * copy hand over as it goes, so the argument and the picture advance together
 * — the pitch is not narrated over a video, it is timed to it.
 *
 * The beat boundaries are read off the footage, not spaced evenly. The move is
 * outside until about 0.20, has the door open by 0.45, is inside by 0.52, and
 * spends its last fifth raising the car:
 *
 *   0.00 → 0.26  outside, door shut        what this is
 *   0.28 → 0.50  the door rolling up       how you get in
 *   0.52 → 0.76  on the shop floor         what is waiting inside
 *   0.78 → 1.00  the car going up          the payoff, and the ask
 *
 * The beats do NOT cross-fade through each other. An earlier cut had each
 * beat's fade-out double as the next one's fade-in, which keeps something on
 * screen at all times but puts two full-width uppercase headlines on top of
 * each other at the midpoint — it reads as a rendering fault, not a
 * transition. They now hand over through a two-hundredths gap instead: about a
 * tenth of a second of clear frame, which reads as a cut.
 *
 * If the footage is ever re-rendered at a different pace, re-read those
 * boundaries off the new frames. Evenly-spaced beats over an unevenly-paced
 * move put "Inside" on screen while the camera is still in the car park.
 *
 * A Server Component: the frame list is read off disk at build time and every
 * word of the copy is in the initial HTML. The H1, the lead and both primary
 * CTAs are all in the first beat, which is what renders at progress 0 — and
 * what a crawler, a no-JS visitor and a reduced-motion visitor see, since the
 * section is then a plain one-screen hero with the beats stacked in flow.
 */
export function EntryHero() {
  const desktop = readFrameSet("entry");
  const mobile = readFrameSet("entry-mobile");

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate"
    >
      <ScrollFrameAnimation
        frames={desktop.urls}
        framesMobile={mobile.urls}
        poster={desktop.poster}
        posterMobile={mobile.poster}
        alt="The GaragePass roll-up door opening onto the shop floor, where a sports car is raised on a two-post lift"
        scrollHeightVh={500}
      >
        <div className="seq-copy">
          <Beat range={[0, 0, 0.2, 0.26]}>
            <p className="eyebrow mb-5">
              {site.address.city}, {site.address.regionName}
            </p>

            <SplitHeadline
              id="hero-heading"
              className="max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] font-bold tracking-tight uppercase"
            >
              Oakland&apos;s community
              <br />
              <span className="text-hazard">DIY auto shop</span>
            </SplitHeadline>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-steel sm:text-xl">
              Rent a car lift by the hour with every tool included, from hand
              tools to engine hoists and transmission jacks. Your hours never
              expire, and there&apos;s no contract.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={site.breely.join} conversion="hero-join">
                Join from ${tiers[0].price}/mo
              </ButtonLink>
              <ButtonLink href="/tour" variant="secondary">
                Book a free tour
              </ButtonLink>
            </div>

            <p className="mt-6 text-sm text-steel-dim">
              {site.address.street}, right off the 880 · Tours daily, no pressure
            </p>
          </Beat>

          {/* Lands as the door is rolling up, so the copy is about getting in. */}
          <Beat range={[0.28, 0.34, 0.44, 0.5]}>
            <p className="eyebrow mb-4">Roll up</p>
            <h2 className="max-w-3xl text-[clamp(1.9rem,4.5vw,3.5rem)] leading-[1.02] font-bold uppercase">
              Book the bay.
              <br />
              <span className="text-hazard">Pull straight in.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel">
              Reserve a two-post lift by the hour, from ${tiers[0].price} a
              month. Hours roll over, so a project that stalls for a fortnight
              costs you nothing.
            </p>
          </Beat>

          {/* Over the shop floor, as the bays and the tool wall come into view. */}
          <Beat range={[0.52, 0.58, 0.7, 0.76]}>
            <p className="eyebrow mb-4">Inside</p>
            <h2 className="max-w-3xl text-[clamp(1.9rem,4.5vw,3.5rem)] leading-[1.02] font-bold uppercase">
              Four bays. Every tool
              <br />
              <span className="text-hazard">already on the wall.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel">
              Two-post lifts, an engine hoist, a transmission jack, air, and a
              full wall of hand and power tools. You bring the car and the parts.
            </p>
          </Beat>

          {/* The payoff: holds from the moment the lift starts rising through
              the closing hero shot, so the ask lands on the best frame. */}
          <Beat range={[0.78, 0.84, 1, 1]}>
            <p className="eyebrow mb-4">Up on the lift</p>
            <h2 className="max-w-3xl text-[clamp(1.9rem,4.5vw,3.5rem)] leading-[1.02] font-bold uppercase">
              Get it
              <br />
              <span className="text-hazard">in the air.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel">
              Book a bay, put it on the lift, and take your time. Nobody is
              waiting on the space, and nobody is charging you for it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={site.breely.join} conversion="hero-scrub-join">
                See membership tiers
              </ButtonLink>
            </div>
          </Beat>

          <ScrollCue />
        </div>
      </ScrollFrameAnimation>
    </section>
  );
}

/** "Scroll" cue, faded out by its own beat as soon as the hint is taken. */
function ScrollCue() {
  return (
    <div
      aria-hidden
      data-beat="0,0,0,0.04"
      className="seq-cue pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2"
    >
      <span className="eyebrow text-steel-dim">Scroll</span>
      <span className="h-8 w-px bg-linear-to-b from-hazard to-transparent" />
    </div>
  );
}

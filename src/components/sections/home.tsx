import Image from "next/image";
import {
  site,
  tiers,
  addOns,
  faqs,
  photos,
  includedBenefits,
  formattedAddress,
  PROCESSING_FEE,
} from "@/lib/site";
import {
  ButtonLink,
  Container,
  Section,
} from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { clips } from "@/lib/videos";
import { readFrameSet } from "@/lib/frames";
import { AmbientVideo } from "@/components/motion/AmbientVideo";
import { Beat } from "@/components/motion/Beat";
import { ScrollFrameAnimation } from "@/components/motion/ScrollFrameAnimation";

/** Section 01 — problem framing. The reason anyone searches for this at all. */
export function Problem() {
  const lines = [
    "Your driveway isn't a garage.",
    "Your landlord doesn't want your transmission on the lawn.",
    "And a shop charges you $180/hr to do what you could do yourself.",
  ];

  return (
    <Section id="problem" index={1} eyebrow="The problem">
      <div className="max-w-4xl space-y-4">
        {lines.map((line, i) => (
          <p
            key={line}
            data-animate="up"
            className={cn(
              "font-display text-2xl leading-tight uppercase sm:text-4xl",
              i === lines.length - 1 ? "text-hazard" : "text-paper",
            )}
          >
            {line}
          </p>
        ))}
      </div>
      <p data-animate="up" className="mt-8 max-w-2xl text-lg text-steel">
        GaragePass is the third option: a real shop, with real lifts and real
        tools, that you book by the hour.
      </p>
    </Section>
  );
}

/**
 * Section 02 — THE LIFT. The centrepiece.
 *
 * A pinned section where scroll raises the car and four chapters of copy
 * arrive in step with what the camera reveals: the bay, then the lift, then
 * the tools under it, then what happens to the fluids. The argument and the
 * picture advance together.
 *
 * Rendered as an AVIF frame sequence rather than a scrubbed video. It used to
 * be an all-intra H.264 clip, which is the classic way to do this, but the
 * numbers were not close: that encode was 1280px wide and 3.32 MB for the
 * desktop variant alone and still looked soft on a full-bleed section, because
 * a 720p source stretched to fill a 1440px stage has nothing left to give.
 * The sequence below is 1600px, sharper, and the desktop and phone sets
 * together weigh less than the three video encodes they replaced.
 *
 * All four chapters are real DOM in the server HTML. Without JavaScript the
 * track collapses to its natural height and they read as a plain stack.
 */
export function Lift() {
  const desktop = readFrameSet("lift-bay");
  const mobile = readFrameSet("lift-bay-mobile");

  const chapters = [
    {
      eyebrow: "Get it in the air",
      title: (
        <>
          Everything you need
          <br />
          <span className="text-hazard">is already here</span>
        </>
      ),
      body: "Oil change, brake job, suspension install, engine swap, transmission swap, full classic restoration. If you can wrench it, you can do it here.",
      /* Boundaries leave a gap between beats; see the note on `Beat`. */
      range: [0, 0, 0.2, 0.24] as [number, number, number, number],
    },
    {
      eyebrow: "The lift",
      title: (
        <>
          Your booking.
          <br />
          <span className="text-hazard">Your lift.</span>
        </>
      ),
      body: "Book your time online and the bay is yours for the slot. Nobody is sharing it, and nobody is going to ask you to drop the car so they can take a turn.",
      range: [0.26, 0.3, 0.46, 0.5] as [number, number, number, number],
    },
    {
      eyebrow: "The tools",
      title: (
        <>
          Stop buying a $400 tool
          <br />
          <span className="text-hazard">for one job</span>
        </>
      ),
      body: "Hand tools through engine hoists, transmission jacks and smoke machines, included with no rental fee. Bring your own if you prefer them.",
      range: [0.52, 0.56, 0.72, 0.76] as [number, number, number, number],
    },
    {
      eyebrow: "The cleanup",
      title: (
        <>
          No trunk full
          <br />
          <span className="text-hazard">of milk jugs</span>
        </>
      ),
      body: "Drain your oil, coolant and transmission fluid straight into our collection containers. We handle disposal and metal recycling from there.",
      range: [0.78, 0.82, 1, 1] as [number, number, number, number],
    },
  ];

  return (
    <section
      id="lift"
      aria-labelledby="lift-heading"
      className="relative isolate border-y border-hairline/50"
    >
      {/*
        The chapters are <h3>s, so without this the outline jumps straight from
        the page <h1> to <h3>. Visually hidden because each chapter already
        carries its own visible heading — this only names the section for
        assistive tech and keeps the levels sequential.
      */}
      <h2 id="lift-heading" className="sr-only">
        What you can do at GaragePass
      </h2>

      <ScrollFrameAnimation
        frames={desktop.urls}
        framesMobile={mobile.urls}
        poster={desktop.poster}
        posterMobile={mobile.poster}
        alt="A sedan raised on a lift at GaragePass with its undercarriage exposed"
        scrollHeightVh={450}
      >
        <div className="seq-copy">
          {chapters.map((c, i) => (
            <Beat key={i} range={c.range} className="max-w-xl">
              <p className="eyebrow mb-3 flex items-center gap-3">
                <span className="tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="h-px w-8 bg-hazard/50" />
                {c.eyebrow}
              </p>
              <h3 className="font-display text-3xl leading-[1.05] font-semibold text-paper uppercase sm:text-5xl">
                {c.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-steel sm:text-lg">
                {c.body}
              </p>
            </Beat>
          ))}
        </div>
      </ScrollFrameAnimation>
    </section>
  );
}

/** Section 03 — how the membership works, in three steps. */
export function HowItWorks() {
  const steps = [
    {
      title: "Pick your pass",
      body: `Tiers run from $${tiers[0].price}/mo for ${tiers[0].hours} hours up to $${tiers[5].price}/mo for ${tiers[5].hours} hours. Cancel anytime.`,
    },
    {
      title: "Book your lift",
      body: "Reserve your time online. Your booking, your lift. Nobody else is using it.",
    },
    {
      title: "Show up and wrench",
      body: "Tools, fluid disposal, advice and the community are all included. Unused hours roll over forever.",
    },
  ];

  return (
    <Section
      id="how-it-works"
      index={3}
      eyebrow="How it works"
      title="Three steps, no contract"
    >
      <ol className="mt-12 grid gap-8 sm:grid-cols-3">
        {steps.map((step, i) => (
          <li
            key={step.title}
            data-animate="up"
            className="border-t border-hazard/40 pt-5"
          >
            <span className="font-display text-4xl font-bold text-hazard tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-display text-lg font-semibold tracking-wide text-paper uppercase">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-steel">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** Section 04 — what every tier includes, regardless of price. */
export function Included() {
  return (
    <Section
      id="included"
      index={4}
      eyebrow="Included with every tier"
      title="No upsells, no tool rental fees"
      className="relative isolate border-y border-hairline/50"
    >
      {/* Tool wall behind the copy, heavily dimmed so contrast stays AA. */}
      <div aria-hidden className="absolute inset-0 -z-20">
        <AmbientVideo clip={clips.tools} />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-void/88" />
      <dl className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {includedBenefits.map((b) => (
          <div key={b.title} data-animate="up">
            <dt className="font-display text-base font-semibold tracking-wide text-hazard uppercase">
              {b.title}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-steel">
              {b.body}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/** Section 05 — pricing. Carries the Product/Offer schema on /membership. */
export function Pricing({ heading = true }: { heading?: boolean }) {
  return (
    <Section
      id="pricing"
      index={heading ? 5 : undefined}
      eyebrow={heading ? "Membership" : undefined}
      title={heading ? "Pick your pass" : undefined}
      lead={
        heading
          ? "Every tier includes the same tools, the same community and the same rollover hours. The only difference is how much lift time you want each month."
          : undefined
      }
    >
      {/*
        When the caller supplies its own page heading (heading={false}), the
        tier cards' <h3>s would otherwise follow an <h1> directly and skip a
        level. A visually-hidden <h2> keeps the outline sequential for screen
        readers without duplicating the visible heading.
      */}
      {!heading && <h2 className="sr-only">Membership tiers</h2>}

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <article
            key={tier.slug}
            data-animate="up"
            className={cn(
              "relative flex flex-col rounded-sm border bg-surface/50 p-6 transition-colors",
              tier.popular
                ? "border-hazard shadow-[0_0_0_1px_var(--color-hazard)]"
                : "border-hairline hover:border-steel-dim",
            )}
          >
            {tier.popular && (
              <span className="absolute -top-2.5 left-6 bg-hazard px-2 py-0.5 font-display text-[0.65rem] font-bold tracking-[0.16em] text-void uppercase">
                Most popular
              </span>
            )}

            <h3 className="font-display text-lg font-semibold tracking-[0.12em] text-paper uppercase">
              {tier.name}
            </h3>

            <p className="mt-4 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-bold text-paper tabular-nums">
                ${tier.price}
              </span>
              <span className="text-sm text-steel-dim">/mo</span>
            </p>

            <p className="mt-3 text-sm text-steel">
              <span className="text-paper">{tier.hours} hours</span> of lift
              time
            </p>
            <p className="mt-1 text-sm text-hazard tabular-nums">
              ${tier.rate}/hour effective
            </p>

            <ButtonLink
              href={site.breely.join}
              conversion={`pricing-${tier.slug}`}
              variant={tier.popular ? "primary" : "secondary"}
              className="mt-6 w-full"
            >
              Choose {tier.name}
            </ButtonLink>
          </article>
        ))}
      </div>

      <p data-animate="up" className="mt-6 text-sm text-steel-dim">
        A ${PROCESSING_FEE}/mo processing fee applies at checkout. Hours never
        expire and roll over with no limit. Cancel anytime, with no long-term
        contracts.
      </p>

      <div
        data-animate="up"
        className="mt-12 rounded-sm border border-hairline bg-surface/40 p-6"
      >
        <h3 className="font-display text-sm font-semibold tracking-[0.16em] text-hazard uppercase">
          Optional monthly add-ons
        </h3>
        <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2.5 text-sm text-steel">
          {addOns.map((a) => (
            <li key={a.name}>
              {a.name}{" "}
              <span className="text-paper tabular-nums">
                ${a.price}/{a.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/**
 * Section 06 — the community, in motion, plus real photographs of the shop.
 *
 * The stills are genuine photographs; the clip is generated. They sit together
 * deliberately — the photographs are what make the space credible.
 */
export function Gallery() {
  const shots = [
    photos.liftBays,
    photos.memberBodyPanel,
    photos.classicCarStorage,
    photos.projectCarStorage,
  ];

  return (
    <>
      <section
        aria-labelledby="community-heading"
        className="relative isolate flex min-h-[70svh] items-end overflow-hidden border-y border-hairline/50"
      >
        <div aria-hidden className="absolute inset-0 -z-20">
          <AmbientVideo clip={clips.community} />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-t from-void via-void/70 to-void/20"
        />

        <Container className="py-16 sm:py-24">
          <p data-animate="up" className="eyebrow mb-4 flex items-center gap-3">
            <span className="tabular-nums">06</span>
            <span aria-hidden className="h-px w-8 bg-hazard/50" />
            The community
          </p>
          <h2
            id="community-heading"
            data-animate="up"
            className="max-w-2xl text-3xl leading-[1.05] font-semibold uppercase sm:text-5xl"
          >
            You are not doing this alone
          </h2>
          <p data-animate="up" className="mt-5 max-w-xl text-lg text-steel">
            Free monthly events, a members&apos; Discord, and a decent chance
            the person in the next bay has already done the job you are about
            to attempt.
          </p>
        </Container>
      </section>

      <Section
        id="shop"
        index={7}
        eyebrow="The shop"
        title="This is the actual place"
        lead="Real photographs, not renders. Four two-post lifts, a full tool inventory, and covered project storage."
      >
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shots.map((shot) => (
            <figure
              key={shot.src}
              data-animate="scale"
              className="relative aspect-[4/5] overflow-hidden rounded-sm border border-hairline/60"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </Section>
    </>
  );
}

/** Section 08 — location. Hosts the AutoRepair schema on the homepage. */
export function Location() {
  const mapQuery = encodeURIComponent(formattedAddress);

  return (
    <Section
      id="location"
      index={8}
      eyebrow="Our location"
      title="950 77th Ave, Oakland"
      lead="Right off the 880. Our first shop of hopefully many."
    >
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div data-animate="up">
          <h3 className="font-display text-sm font-semibold tracking-[0.16em] text-hazard uppercase">
            Free tours
          </h3>
          <p className="mt-3 text-steel">
            Swing by, meet the team, check out the lifts and tools, and get
            your questions answered. No pressure, no commitment.
          </p>

          <dl className="mt-6 space-y-2 text-sm">
            {site.tourTimes.map((t) => (
              <div key={t.days} className="flex gap-3">
                <dt className="w-44 shrink-0 text-steel-dim">{t.days}</dt>
                <dd className="text-paper">{t.time}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/tour" variant="secondary">
              Book a tour
            </ButtonLink>
            <ButtonLink
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              variant="ghost"
            >
              Get directions →
            </ButtonLink>
          </div>

        </div>

        <div
          data-animate="up"
          className="relative min-h-72 overflow-hidden rounded-sm border border-hairline/60"
        >
          <Image
            src={photos.exterior.src}
            alt={photos.exterior.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </Section>
  );
}

/**
 * Section 09 — FAQ.
 *
 * Native `<details>` so it works without JavaScript and stays accessible.
 * The same copy is emitted as `FAQPage` JSON-LD by the page that renders it.
 */
export function Faq() {
  return (
    <Section
      id="faq"
      index={9}
      eyebrow="FAQ"
      title="Questions, answered"
      className="border-y border-hairline/50 bg-surface/30"
    >
      <div className="mt-10 max-w-3xl divide-y divide-hairline/60 border-y border-hairline/60">
        {faqs.map((f) => (
          <details key={f.q} data-animate="up" className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-base font-medium tracking-wide text-paper uppercase [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden
                className="mt-0.5 shrink-0 text-hazard transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-steel">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/** Section 09 — closing CTA into Breely. */
export function FinalCta() {
  return (
    <section
      id="join"
      aria-labelledby="join-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div aria-hidden className="absolute inset-0 -z-20">
        <AmbientVideo clip={clips.outro} />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-void/82" />

      <Container className="text-center">
        <h2
          id="join-heading"
          data-animate="up"
          className="mx-auto max-w-3xl text-4xl leading-[1.05] font-bold uppercase sm:text-6xl"
        >
          Stop working on your car
          <br />
          <span className="text-hazard">in a parking lot</span>
        </h2>

        <p data-animate="up" className="mx-auto mt-6 max-w-xl text-lg text-steel">
          Memberships start at ${tiers[0].price}/mo. Come see the shop first:
          tours are free and there&apos;s no pressure.
        </p>

        <div data-animate="up" className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href={site.breely.join} conversion="footer-join">
            Become a member
          </ButtonLink>
          <ButtonLink href="/tour" variant="secondary">
            Book a free tour
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

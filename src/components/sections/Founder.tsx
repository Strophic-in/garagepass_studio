import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { site } from "@/lib/site";
import { Container, ButtonLink } from "@/components/ui/primitives";

/**
 * Who runs the shop.
 *
 * This is an SEO section as much as a human one. A named, photographed owner
 * with a role and a location is the strongest experience-and-trust signal a
 * local business page can carry, and it feeds the `Person` node that
 * `founderSchema()` attaches to the Organization. "Founded by a real person you
 * can meet on a tour" is also the honest differentiator against the chains.
 *
 * The portrait is scroll-revealed rather than statically placed: the frame
 * scales in as it enters, and the photograph inside drifts against the scroll
 * behind a fixed mask. Both come from `[data-animate]` and `[data-parallax]`,
 * which `MotionProvider` already wires globally — no new JavaScript ships for
 * this section, and with the motion layer absent it is simply a photograph.
 *
 * A Server Component, so the copy is in the initial HTML. It also checks for
 * the portrait on disk at build time: until a real photograph is supplied the
 * section renders as copy alone rather than shipping a broken image or, worse,
 * passing off a stock shot of the shop as a picture of the founder.
 */
export function Founder() {
  const hasPortrait = founderPortraitExists();

  return (
    <section
      id="founder"
      aria-labelledby="founder-heading"
      className="py-20 sm:py-28"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          {hasPortrait && (
            <figure
              data-animate="scale"
              className="relative order-1 aspect-[4/5] overflow-hidden rounded-sm border border-hairline/60"
            >
              {/*
                The photograph is taller than its frame so the parallax has
                somewhere to travel without ever exposing an edge — the same
                headroom trick AmbientVideo uses.
              */}
              <div
                data-parallax="8"
                className="absolute inset-x-0 -inset-y-[12%] will-change-transform"
              >
                <Image
                  src={FOUNDER_PORTRAIT.src}
                  alt={FOUNDER_PORTRAIT.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>

              {/* Anchors the caption and keeps the name legible over any crop. */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-void via-void/70 to-transparent"
              />
              <figcaption className="absolute right-5 bottom-5 left-5">
                <p className="eyebrow mb-1">Founder</p>
                <p className="font-display text-xl font-semibold text-paper uppercase">
                  {site.founder}
                </p>
              </figcaption>
            </figure>
          )}

          <div className={hasPortrait ? "order-2" : ""}>
            <p data-animate="up" className="eyebrow mb-4">
              Who runs the shop
            </p>

            <h2
              id="founder-heading"
              data-animate="up"
              className="max-w-2xl text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] font-bold uppercase"
            >
              Built by someone who
              <br />
              <span className="text-hazard">needed it to exist</span>
            </h2>

            <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-steel">
              <p data-animate="up">
                {site.founder} started {site.name} in {site.address.city} for
                the reason most people join it: knowing how to do the work, and
                having nowhere to do it. A driveway you are not allowed to use,
                a landlord who objects, and a shop quoting $150 an hour for a
                job you could do yourself in an afternoon.
              </p>
              <p data-animate="up">
                So the shop is built the way a mechanic would want it rather
                than the way a rental business would: hours that roll over
                instead of expiring, tools included instead of itemised, and no
                contract to cancel. He is usually on the floor, and the tours
                are run by him rather than by a salesperson.
              </p>
            </div>

            <div data-animate="up" className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/tour" conversion="founder-tour">
                Book a tour with {site.founder.split(" ")[0]}
              </ButtonLink>
              <ButtonLink href="/our-story" variant="secondary">
                Read the full story
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Whether the portrait is actually on disk, checked at build time.
 *
 * Exported so the page can decide whether to put an `image` on the Person
 * node: schema pointing at a file that 404s is worse than schema without a
 * picture, and Google does fetch it.
 */
export function founderPortraitExists() {
  return existsSync(join(process.cwd(), "public", FOUNDER_PORTRAIT.src));
}

/**
 * The portrait.
 *
 * Kept next to the section rather than in the shared `photos` registry because
 * it is the one image on the site that is a person rather than the premises,
 * and because the section checks for it on disk: dropping a file at this exact
 * path is all that is needed to turn the image and the schema on.
 */
export const FOUNDER_PORTRAIT = {
  src: "/images/garagepass-founder-abraham-barkhordar.webp",
  alt: `${site.founder}, founder of ${site.name}, in the shop at ${site.address.street} in ${site.address.city}, California`,
} as const;

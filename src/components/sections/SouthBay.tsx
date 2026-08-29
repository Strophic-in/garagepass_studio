import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { site } from "@/lib/site";
import { ButtonLink, Container, HazardRule } from "@/components/ui/primitives";

/**
 * Section 09 — the second shop.
 *
 * San Jose used to be one grey footnote at the bottom of the Oakland location
 * block, which undersold it badly: the waitlist is the only conversion the
 * South Bay half of the audience can make, and a `/san-jose` landing page is
 * already carrying real search intent for a shop that does not exist yet.
 *
 * The search map is the anchor, but it cannot be the whole thing. Every word
 * on that graphic — the cities, "coming soon", the feature list — is pixels,
 * invisible to a crawler and to a screen reader. So the heading, the lead, the
 * area list and the call to action are all real text, and the image carries the
 * detail that is genuinely visual: roughly where in the South Bay the shop
 * might land.
 *
 * The alt text names the cities deliberately. This section is the strongest
 * signal the site gives for South Bay intent, and those names are the query.
 */
export function SouthBay() {
  const hasMap = southBayMapExists();

  return (
    <>
      <HazardRule />
      <section
        id="south-bay"
        aria-labelledby="south-bay-heading"
        className="bg-surface/40 py-20 sm:py-28"
      >
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-14">
            <div>
              <p data-animate="up" className="eyebrow mb-4">
                The second shop
              </p>

              <h2
                id="south-bay-heading"
                data-animate="up"
                className="text-[clamp(2rem,5vw,3.5rem)] leading-[1.02] font-bold uppercase"
              >
                South Bay,
                <br />
                <span className="text-hazard">coming soon</span>
              </h2>

              <p
                data-animate="up"
                className="mt-6 max-w-lg text-lg leading-relaxed text-steel"
              >
                A second GaragePass is opening in San Jose in{" "}
                {site.sanJose.openingLong} — same lifts, same tools, same
                hours-never-expire membership, built for the South Bay instead
                of a drive up the 880.
              </p>

              <p
                data-animate="up"
                className="mt-4 max-w-lg leading-relaxed text-steel-dim"
              >
                We are still choosing the site. It will serve{" "}
                {site.sanJose.areaServed.slice(0, -1).join(", ")} and{" "}
                {site.sanJose.areaServed.slice(-1)}.
              </p>

              <div data-animate="up" className="mt-8 flex flex-wrap gap-3">
                <ButtonLink
                  href="/san-jose/waitlist"
                  conversion="southbay-waitlist"
                >
                  Join the waitlist
                </ButtonLink>
                <ButtonLink href="/san-jose" variant="secondary">
                  About the San Jose shop
                </ButtonLink>
              </div>

              <p data-animate="up" className="mt-5 text-sm text-steel-dim">
                Founding members get first pick of booking slots and the
                opening date before it is public.
              </p>
            </div>

            {hasMap ? (
              <figure
                data-animate="scale"
                className="overflow-hidden rounded-sm border border-hairline/60"
              >
                <Image
                  src={SOUTH_BAY_MAP.src}
                  alt={SOUTH_BAY_MAP.alt}
                  width={1536}
                  height={1024}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="h-auto w-full"
                />
              </figure>
            ) : (
              /*
                Without the map the section still has to hold its side of the
                grid, so the area list becomes the visual instead of leaving a
                hole. It is also the more crawlable half of the two.
              */
              <div
                data-animate="up"
                className="rounded-sm border border-hairline/60 bg-void/40 p-8"
              >
                <p className="eyebrow mb-5">Search area</p>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {site.sanJose.areaServed.map((city) => (
                    <li
                      key={city}
                      className="flex items-baseline gap-3 border-b border-hairline/40 pb-3 text-paper"
                    >
                      <span aria-hidden className="text-hazard">
                        ·
                      </span>
                      {city}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-steel-dim">
                  Somewhere in here, with the site confirmed closer to opening.
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}

/**
 * Whether the search map is on disk, checked at build time.
 *
 * Same contract as the founder portrait: drop the file at this path and the
 * image appears, with no code change and no risk of shipping a broken one.
 */
export function southBayMapExists() {
  return existsSync(join(process.cwd(), "public", SOUTH_BAY_MAP.src));
}

export const SOUTH_BAY_MAP = {
  src: "/images/garagepass-south-bay-search-area-map.webp",
  alt: "Map of the South Bay showing candidate GaragePass locations across San Jose, Santa Clara, Milpitas, Mountain View, Campbell, Saratoga, Los Gatos and Alum Rock",
} as const;

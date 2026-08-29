import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink, Container, Section } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph } from "@/components/seo/schema";
import { site, tiers } from "@/lib/site";

export const metadata: Metadata = {
  title: "San Jose Waitlist: Founding Member Pricing",
  description:
    "Join the waitlist for GaragePass San Jose, opening Q1 2027. Founding-member pricing, the opening date before it is public, and first pick of booking slots.",
  alternates: { canonical: "/san-jose/waitlist" },
};

/**
 * The conversion goal for every San Jose page.
 *
 * There is nothing to book yet, so these pages capture an email rather than
 * pushing to Breely. That list is also the launch asset — founding members and
 * the first reviews, both of which matter disproportionately in the opening
 * thirty days for map-pack entry.
 *
 * TODO(build): wire the form to a real handler. Until then it points at the
 * Instagram DM route rather than silently swallowing submissions.
 */
export default function SanJoseWaitlistPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "San Jose", path: "/san-jose" },
            { name: "Waitlist", path: "/san-jose/waitlist" },
          ]),
        )}
      />
      <Header />

      <main id="main">
        <Container className="py-16 sm:py-20">
          <p className="eyebrow mb-4">
            San Jose · Opening {site.sanJose.opening}
          </p>
          <h1 className="max-w-3xl text-[clamp(2rem,5.5vw,4rem)] leading-[1.02] font-bold uppercase">
            Founding member
            <br />
            <span className="text-hazard">waitlist</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
            Costs nothing, commits you to nothing. You get the opening date
            before it is public, founding-member pricing that will not be
            offered afterwards, and first pick of booking slots in the opening
            weeks.
          </p>
        </Container>

        <Section id="waitlist-form" eyebrow="Reserve your place">
          <div className="mt-6 grid gap-12 lg:grid-cols-2">
            <div className="rounded-sm border border-hairline bg-surface/50 p-6">
              <p className="text-steel">
                The waitlist form is being wired up. In the meantime, message
                us on Instagram or TikTok with &ldquo;San Jose&rdquo; and we
                will add you to the list directly.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink
                  href={site.social.instagram}
                  conversion="sj-waitlist-instagram"
                >
                  Message on Instagram
                </ButtonLink>
                <ButtonLink
                  href={site.social.tiktok}
                  variant="secondary"
                  conversion="sj-waitlist-tiktok"
                >
                  Message on TikTok
                </ButtonLink>
              </div>
            </div>

            <div>
              <h2 className="font-display text-sm font-semibold tracking-[0.16em] text-hazard uppercase">
                What you are joining
              </h2>
              <ul className="mt-5 space-y-4 text-steel">
                <li>
                  <span className="text-paper">Same model as Oakland.</span>{" "}
                  Book a two-post lift by the hour, use every tool in the
                  building, drain your fluids into our containers on the way
                  out.
                </li>
                <li>
                  <span className="text-paper">Same pricing structure.</span>{" "}
                  Tiers from ${tiers[0].price}/mo for {tiers[0].hours} hours up
                  to ${tiers[5].price}/mo for {tiers[5].hours} hours.
                </li>
                <li>
                  <span className="text-paper">Hours never expire.</span> They
                  roll over indefinitely, with no cap and no contract.
                </li>
                <li>
                  <span className="text-paper">Serving the South Bay.</span>{" "}
                  {site.sanJose.areaServed.join(", ")}.
                </li>
              </ul>

              <p className="mt-8 border-l-2 border-hazard/60 pl-4 text-sm text-steel-dim">
                Not willing to wait? The Oakland shop at {site.address.street}{" "}
                is open today, and a number of South Bay members already make
                the trip for bigger jobs.{" "}
                <Link
                  href="/oakland"
                  className="text-hazard underline underline-offset-2 decoration-hazard/50 hover:decoration-hazard"
                >
                  See the Oakland shop
                </Link>
                .
              </p>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}

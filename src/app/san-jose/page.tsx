import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink, Container, Section } from "@/components/ui/primitives";
import { Included, Pricing } from "@/components/sections/home";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph, serviceSchema } from "@/components/seo/schema";
import { site, photos, tiers } from "@/lib/site";
import { sanJosePages } from "@/lib/landing-content";

export const metadata: Metadata = {
  title: "DIY Auto Shop & Car Lift Rental in San Jose, CA",
  description:
    "A community DIY auto shop opening in San Jose in Q1 2027. Rent a car lift by the hour with every tool included. Join the waitlist for founding-member pricing.",
  alternates: { canonical: "/san-jose" },
};

/**
 * Ships before the location opens.
 *
 * Organic rankings take three to six months to mature, so this page needs to
 * exist and carry real substance now — not a placeholder. Note there is
 * deliberately no `AutoRepair` schema here: emitting LocalBusiness markup for
 * an address that does not yet exist would be a fabricated listing. It gains
 * that node the day the lease is signed.
 */
export default function SanJoseHubPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceSchema({
            name: "DIY auto shop and car lift rental",
            description:
              "Community DIY auto shop and hourly car lift rental opening in San Jose, California.",
            path: "/san-jose",
            areaServed: site.sanJose.areaServed,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "San Jose", path: "/san-jose" },
          ]),
        )}
      />
      <Header />

      <main id="main">
        {/* Honest status banner — the location is not open yet. */}
        <div className="border-b border-hazard/40 bg-hazard/10">
          <Container className="py-3">
            <p className="text-center font-display text-xs tracking-[0.14em] text-hazard uppercase">
              Opening {site.sanJose.openingLong} · The Oakland shop is open
              today
            </p>
          </Container>
        </div>

        <Container className="py-16 sm:py-20">
          <p className="eyebrow mb-4">San Jose, California</p>
          <h1 className="max-w-4xl text-[clamp(2rem,5.5vw,4rem)] leading-[1.02] font-bold uppercase">
            A DIY auto shop
            <br />
            <span className="text-hazard">for the South Bay</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
            Book a lift by the hour, use every tool in the building, and stop
            paying shop rates for work you can do yourself. We are bringing the
            GaragePass model to San Jose in {site.sanJose.opening}.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/san-jose/waitlist">
              Join the waitlist
            </ButtonLink>
            <ButtonLink href="/oakland" variant="secondary">
              Visit the Oakland shop
            </ButtonLink>
          </div>
        </Container>

        <Container>
          <figure className="relative aspect-[16/9] w-full overflow-hidden rounded-sm border border-hairline/60">
            <Image
              src={photos.liftBays.src}
              alt={photos.liftBays.alt}
              fill
              priority
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
            />
            {/* Labelled honestly: this is the Oakland shop, not San Jose. */}
            <figcaption className="absolute right-0 bottom-0 bg-void/85 px-3 py-1.5 text-xs text-steel-dim">
              Pictured: our Oakland shop. San Jose will match this spec.
            </figcaption>
          </figure>
        </Container>

        <Section
          id="why"
          eyebrow="Why San Jose"
          title="The South Bay has the same problem, worse"
        >
          <div className="mt-4 max-w-3xl space-y-4 text-steel">
            <p>
              Silicon Valley has an unusual concentration of people who are
              perfectly capable of doing their own vehicle work and structurally
              prevented from doing it. Dense housing, strict HOAs, and square
              footage so expensive that a garage is either unavailable or far
              too valuable to hand over to a project car.
            </p>
            <p>
              The result is a lot of people paying $150–$200 an hour for labour
              they could do themselves, or quietly doing it in an apartment
              complex parking space and hoping nobody files a complaint.
            </p>
            <p>
              We will serve {site.sanJose.areaServed.join(", ")} and the
              surrounding South Bay.
            </p>
          </div>
        </Section>

        <Section
          id="services"
          eyebrow="What is coming"
          title="Same model, new address"
          className="border-y border-hairline/50 bg-surface/30"
        >
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {sanJosePages.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/san-jose/${page.slug}`}
                  className="flex h-full flex-col rounded-sm border border-hairline bg-surface/50 p-5 transition-colors hover:border-hazard"
                >
                  <span className="font-display text-base font-semibold tracking-wide text-paper uppercase">
                    {page.serviceName}
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-steel-dim">
                    {page.lead}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Included />

        <Section
          id="pricing-note"
          eyebrow="Pricing"
          title="What it will cost"
          lead={`San Jose will run the same tier structure as Oakland, starting at $${tiers[0].price}/mo. Waitlist members get founding pricing that will not be offered publicly.`}
        />

        <Pricing heading={false} />

        <Section id="waitlist-cta" className="text-center">
          <h2 className="mx-auto max-w-2xl text-3xl leading-tight font-bold uppercase sm:text-4xl">
            Get the opening date first
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-steel">
            The waitlist costs nothing and commits you to nothing. It gets you
            founding-member pricing and first pick of booking slots.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/san-jose/waitlist">
              Join the San Jose waitlist
            </ButtonLink>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}

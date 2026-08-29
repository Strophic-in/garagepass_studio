import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container, Section } from "@/components/ui/primitives";
import { FinalCta } from "@/components/sections/home";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  graph,
  organizationSchema,
} from "@/components/seo/schema";
import { site, photos } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story: Oakland's Community DIY Auto Shop",
  description:
    "Why GaragePass exists, who runs it, and what a community DIY auto shop actually means. Founded by Abraham Barkhordar in Oakland, California.",
  alternates: { canonical: "/our-story" },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={graph(
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Our Story", path: "/our-story" },
          ]),
        )}
      />
      <Header />

      <main id="main">
        <Container className="py-16 sm:py-20">
          <p className="eyebrow mb-4">About</p>
          <h1 className="max-w-3xl text-[clamp(2rem,5.5vw,4rem)] leading-[1.02] font-bold uppercase">
            A gym for your car
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
            GaragePass is a membership auto shop in Oakland. You pay monthly,
            you book a lift by the hour, and everything else is already there:
            tools, fluid disposal, advice, community.
          </p>
        </Container>

        <Container>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm border border-hairline/60">
            <Image
              src={photos.memberBodyPanel.src}
              alt={photos.memberBodyPanel.alt}
              fill
              priority
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover object-top"
            />
          </div>
        </Container>

        <Section id="story" eyebrow="Why this exists">
          <div className="max-w-3xl space-y-12">
            <article>
              <h2 className="text-2xl font-semibold uppercase sm:text-3xl">
                The gap nobody was filling
              </h2>
              <p className="mt-4 leading-relaxed text-steel">
                There are a lot of people in the Bay Area who know how to work
                on their own cars and have nowhere to do it. Apartment parking
                prohibits it. Landlords object. Street work means kneeling on
                asphalt in fading light with a jack you do not fully trust.
              </p>
              <p className="mt-4 leading-relaxed text-steel">
                The default alternative is paying a shop $150–$200 an hour for
                labour you are entirely capable of performing. That is not a
                skills problem. It is a space and equipment problem, and it is a
                solvable one.
              </p>
            </article>

            <article>
              <h2 className="text-2xl font-semibold uppercase sm:text-3xl">
                What community actually means here
              </h2>
              <p className="mt-4 leading-relaxed text-steel">
                The word gets used loosely, so here is the specific version:
                free monthly events, a members&apos; Discord that is genuinely
                active, a members&apos; lounge in progress, and, most usefully, a
                decent chance that whoever is in the next bay has
                already done the job you are attempting.
              </p>
              <p className="mt-4 leading-relaxed text-steel">
                We run events aimed at people who have been made to feel
                unwelcome in traditional automotive spaces, including
                &ldquo;Ladies Under the Hood&rdquo;. Beginners are not merely
                tolerated here; every new member gets lift safety training
                before their first booking.
              </p>
            </article>

            <article>
              <h2 className="text-2xl font-semibold uppercase sm:text-3xl">
                Who runs it
              </h2>
              <p className="mt-4 leading-relaxed text-steel">
                GaragePass was founded by {site.founder} and operates as{" "}
                {site.legalName} from {site.address.street} in{" "}
                {site.address.city}, right off the 880. It is the first shop of
                hopefully many. A second location is planned for San Jose in{" "}
                {site.sanJose.openingLong}.
              </p>
            </article>

            <article>
              <h2 className="text-2xl font-semibold uppercase sm:text-3xl">
                How we price it
              </h2>
              <p className="mt-4 leading-relaxed text-steel">
                Hours never expire. They roll over indefinitely with no cap,
                because charging people for time they did not use is a bad way
                to run something that calls itself a community. There are no
                long-term contracts and you can cancel at any time.
              </p>
            </article>
          </div>
        </Section>

        <FinalCta />
      </main>

      <Footer />
    </>
  );
}

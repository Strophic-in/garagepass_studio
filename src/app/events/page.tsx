import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink, Container, Section } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph } from "@/components/seo/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events & Community at the Oakland Shop",
  description:
    "Free monthly member events at GaragePass Oakland, including Ladies Under the Hood workshops, plus the members' Discord. Included with every membership tier.",
  alternates: { canonical: "/events" },
};

/**
 * Describes the events programme rather than listing dated events.
 *
 * We deliberately do not publish specific dates here until the client supplies
 * them — inventing dated events would be fabricating records, and `Event`
 * schema on a listing that does not exist is a fast way to lose rich-result
 * eligibility. Once dates arrive this page gains an `Event` graph per entry.
 */
export default function EventsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Events", path: "/events" },
          ]),
        )}
      />
      <Header />

      <main id="main">
        <Container className="py-16 sm:py-20">
          <p className="eyebrow mb-4">Community</p>
          <h1 className="max-w-3xl text-[clamp(2rem,5.5vw,4rem)] leading-[1.02] font-bold uppercase">
            Events at the shop
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
            Free monthly events, included with every membership tier. The
            calendar moves around, so Instagram is the fastest place to catch
            the next one.
          </p>
        </Container>

        <Section id="programme" eyebrow="What we run">
          <div className="grid gap-10 sm:grid-cols-2">
            <article>
              <h2 className="font-display text-lg font-semibold tracking-wide text-hazard uppercase">
                Ladies Under the Hood
              </h2>
              <p className="mt-3 leading-relaxed text-steel">
                A workshop built for women who want to learn to work on their
                own cars in a space where nobody is going to talk down to them.
                Traditional automotive spaces have a poor record here; this is
                our attempt at the opposite.
              </p>
            </article>

            <article>
              <h2 className="font-display text-lg font-semibold tracking-wide text-hazard uppercase">
                Monthly member meets
              </h2>
              <p className="mt-3 leading-relaxed text-steel">
                Open shop nights where members show what they are building,
                trade advice, and generally make the place feel like somewhere
                you would want to spend a Saturday.
              </p>
            </article>

            <article>
              <h2 className="font-display text-lg font-semibold tracking-wide text-hazard uppercase">
                Lift safety training
              </h2>
              <p className="mt-3 leading-relaxed text-steel">
                Every new member gets trained on the lifts before their first
                booking. If you have never put a car in the air yourself, this
                is where that stops being intimidating.
              </p>
            </article>

            <article>
              <h2 className="font-display text-lg font-semibold tracking-wide text-hazard uppercase">
                The members&apos; Discord
              </h2>
              <p className="mt-3 leading-relaxed text-steel">
                Where the actual day-to-day help happens. Someone has usually
                already done the job you are about to attempt, and is willing to
                tell you which bolt is going to ruin your afternoon.
              </p>
            </article>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href={site.social.instagram} variant="secondary">
              See upcoming events on Instagram
            </ButtonLink>
            <ButtonLink href={site.breely.join} conversion="events-join">
              Become a member
            </ButtonLink>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}

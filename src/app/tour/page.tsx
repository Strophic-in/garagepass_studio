import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink, Container, Section } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  autoRepairSchema,
  breadcrumbSchema,
  graph,
} from "@/components/seo/schema";
import { site, photos, formattedAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Free Shop Tour of the Oakland Shop",
  description:
    "See the lifts and tools before you join. Free tours of GaragePass at 950 77th Ave, Oakland. Weekdays at 6pm, weekends at 12pm and 4pm. No pressure.",
  alternates: { canonical: "/tour" },
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  formattedAddress,
)}`;

export default function TourPage() {
  return (
    <>
      <JsonLd
        data={graph(
          autoRepairSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tour", path: "/tour" },
          ]),
        )}
      />
      <Header />

      <main id="main">
        <Container className="py-16 sm:py-20">
          <p className="eyebrow mb-4">Come see the shop</p>
          <h1 className="max-w-3xl text-[clamp(2rem,5.5vw,4rem)] leading-[1.02] font-bold uppercase">
            Book a free tour
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
            Swing by, meet the team, check out the lifts and tools, and get your
            questions answered. No pressure, no commitment. Just come hang and
            see if GaragePass is your kind of place.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={site.breely.join} conversion="tour-book">
              Book a tour
            </ButtonLink>
            <ButtonLink href="/membership" variant="secondary">
              See membership tiers
            </ButtonLink>
          </div>
        </Container>

        <Section id="tour-times" eyebrow="Tour times" title="When to come by">
          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div>
              <dl className="divide-y divide-hairline/60 border-y border-hairline/60">
                {site.tourTimes.map((t) => (
                  <div key={t.days} className="flex gap-6 py-4">
                    <dt className="w-48 shrink-0 text-steel-dim">{t.days}</dt>
                    <dd className="font-display tracking-wide text-paper uppercase">
                      {t.time}
                    </dd>
                  </div>
                ))}
              </dl>

              <address className="mt-8 text-base not-italic text-steel">
                <span className="text-paper">{formattedAddress}</span>
                <br />
                Right off the 880.
              </address>

              <ButtonLink href={mapsUrl} variant="ghost" className="mt-4 px-0">
                Get directions →
              </ButtonLink>
            </div>

            <div className="relative min-h-72 overflow-hidden rounded-sm border border-hairline/60">
              <Image
                src={photos.liftBays.src}
                alt={photos.liftBays.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}

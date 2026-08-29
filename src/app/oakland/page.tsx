import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink, Container, Section } from "@/components/ui/primitives";
import { Faq, Pricing } from "@/components/sections/home";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  autoRepairSchema,
  breadcrumbSchema,
  faqSchema,
  graph,
} from "@/components/seo/schema";
import { site, photos, formattedAddress } from "@/lib/site";
import { oaklandPages } from "@/lib/landing-content";

export const metadata: Metadata = {
  title: "Oakland DIY Auto Shop & Lift Rental on 77th Ave",
  description:
    "The Oakland shop at 950 77th Ave. Two-post lifts, a full tool inventory, fluid disposal and project storage. Memberships from $60/mo. Free tours daily.",
  alternates: { canonical: "/oakland" },
};

export default function OaklandHubPage() {
  return (
    <>
      <JsonLd
        data={graph(
          autoRepairSchema(),
          faqSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Oakland", path: "/oakland" },
          ]),
        )}
      />
      <Header />

      <main id="main">
        <Container className="py-16 sm:py-20">
          <p className="eyebrow mb-4">Oakland, California</p>
          <h1 className="max-w-4xl text-[clamp(2rem,5.5vw,4rem)] leading-[1.02] font-bold uppercase">
            The Oakland shop
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
            {formattedAddress}, right off the 880. Two-post lifts, every tool
            included, fluid disposal handled, and covered storage for the
            projects that take longer than a weekend.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={site.breely.join} conversion="oakland-join">
              Join the shop
            </ButtonLink>
            <ButtonLink href="/tour" variant="secondary">
              Book a free tour
            </ButtonLink>
          </div>
        </Container>

        <Container>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm border border-hairline/60">
            <Image
              src={photos.liftBays.src}
              alt={photos.liftBays.alt}
              fill
              priority
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>

        <Section
          id="services"
          eyebrow="What you can do here"
          title="Everything the shop offers"
        >
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {oaklandPages.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/oakland/${page.slug}`}
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

        <Section
          id="area"
          eyebrow="Who we serve"
          title="Across the East Bay"
          className="border-y border-hairline/50 bg-surface/30"
        >
          <p className="mt-4 max-w-2xl text-steel">
            Being right off the 880 puts the shop within a straightforward
            drive of most of the East Bay. Members come from{" "}
            {site.areaServed.join(", ")} and beyond.
          </p>
        </Section>

        <Pricing />
        <Faq />
      </main>

      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HazardRule } from "@/components/ui/primitives";
import { SouthBay } from "@/components/sections/SouthBay";
import {
  Founder,
  FOUNDER_PORTRAIT,
  founderPortraitExists,
} from "@/components/sections/Founder";
import { EntryHero } from "@/components/sections/EntryHero";
import {
  Faq,
  FinalCta,
  Gallery,
  HowItWorks,
  Included,
  Lift,
  Location,
  Pricing,
  Problem,
} from "@/components/sections/home";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  autoRepairSchema,
  faqSchema,
  founderSchema,
  graph,
  organizationSchema,
  websiteSchema,
} from "@/components/seo/schema";

export const metadata: Metadata = {
  // Overrides the template so the head term leads rather than the brand.
  title: "DIY Auto Shop & Car Lift Rental in Oakland, CA | GaragePass",
  description:
    "Rent a car lift by the hour at Oakland's community DIY auto shop. Every tool included, hours never expire, no contracts. Memberships from $60/mo on 77th Ave.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={graph(
          organizationSchema(),
          websiteSchema(),
          autoRepairSchema(),
          founderSchema(
            founderPortraitExists() ? { image: FOUNDER_PORTRAIT.src } : {},
          ),
          faqSchema(),
        )}
      />

      <Header />

      <main id="main">
        <EntryHero />

        {/* Marks the end of the cinematic opening and the start of the page
            proper — without it the first content section reads as part of the
            pinned sequence. */}
        <HazardRule />

        <Problem />
        <Lift />
        <HowItWorks />
        <Included />
        <Pricing />
        <Gallery />
        <Founder />
        <Location />
        <SouthBay />
        <Faq />

        <HazardRule />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}

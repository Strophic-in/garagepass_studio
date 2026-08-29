import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/primitives";
import { Faq, Included, Pricing } from "@/components/sections/home";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  membershipProductSchema,
} from "@/components/seo/schema";
import { bonusHours, tiers } from "@/lib/site";

export const metadata: Metadata = {
  title: "Memberships from $60/mo, Lift Time Included",
  description:
    "Compare all six GaragePass membership tiers, from $60/mo for 2 hours to $1,500/mo for 100 hours. Every tier includes tools, fluid disposal and rollover hours.",
  alternates: { canonical: "/membership" },
};

export default function MembershipPage() {
  return (
    <>
      <JsonLd
        data={graph(
          membershipProductSchema(),
          faqSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Membership", path: "/membership" },
          ]),
        )}
      />
      <Header />

      <main id="main">
        <Container className="py-16 sm:py-20">
          <p className="eyebrow mb-4">Membership</p>
          <h1 className="max-w-3xl text-[clamp(2rem,5.5vw,4rem)] leading-[1.02] font-bold uppercase">
            Pick your pass
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
            Every tier includes the same tools, the same community and the same
            rollover hours. The only difference is how much lift time you want
            each month, and the more you take, the less each hour costs.
          </p>
        </Container>

        <Pricing heading={false} />

        <Container className="pb-16">
          <div className="rounded-sm border border-hairline bg-surface/40 p-6">
            <h2 className="font-display text-sm font-semibold tracking-[0.16em] text-hazard uppercase">
              Bonus hour packs at signup
            </h2>
            <p className="mt-2 text-sm text-steel">
              One-time top-ups you can add when you join. Like all hours, these
              never expire.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2.5 text-sm text-steel">
              {bonusHours.map((b) => (
                <li key={b.hours}>
                  +{b.hours} hours{" "}
                  <span className="text-paper tabular-nums">${b.price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-steel-dim">
              Best effective rate is the {tiers[5].name} tier at $
              {tiers[5].rate}/hour.
            </p>
          </div>
        </Container>

        <Included />
        <Faq />
      </main>

      <Footer />
    </>
  );
}

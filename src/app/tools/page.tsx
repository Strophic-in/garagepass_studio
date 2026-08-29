import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container, HazardRule, Section } from "@/components/ui/primitives";
import { FinalCta } from "@/components/sections/home";
import { LiftSequence } from "@/components/sections/LiftSequence";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph } from "@/components/seo/schema";
import { photos } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop Tools: Lifts, Hoists & Transmission Jacks",
  description:
    "In the shop: two-post lifts, engine hoists, transmission jacks, smoke machines, jack stands and a full hand tool inventory. All included, no rental fees.",
  alternates: { canonical: "/tools" },
};

/**
 * Answers the "do they have X?" query, which is one of the most common
 * pre-signup questions and currently unanswerable from the live site.
 */
const inventory = [
  {
    category: "Lifting",
    items: [
      "Two-post car lifts",
      "Floor jacks",
      "Jack stands",
      "Engine hoists",
      "Transmission jacks",
      "Wheel dollies",
    ],
  },
  {
    category: "Hand tools",
    items: [
      "Metric and SAE socket sets",
      "Torque wrenches",
      "Combination and ratcheting wrenches",
      "Breaker bars",
      "Impact drivers",
      "Pry bars and pullers",
    ],
  },
  {
    category: "Diagnostics",
    items: [
      "Smoke machines",
      "OBD-II scan tools",
      "Multimeters",
      "Compression testers",
      "Timing lights",
    ],
  },
  {
    category: "Fluids & disposal",
    items: [
      "Oil drain containers",
      "Coolant collection",
      "Transmission fluid collection",
      "Metal recycling",
      "Fluid transfer pumps",
    ],
  },
];

export default function ToolsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
          ]),
        )}
      />
      <Header />

      <main id="main">
        <Container className="py-16 sm:py-20">
          <p className="eyebrow mb-4">The inventory</p>
          <h1 className="max-w-3xl text-[clamp(2rem,5.5vw,4rem)] leading-[1.02] font-bold uppercase">
            Stop buying a $400 tool
            <br />
            <span className="text-hazard">for one job</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
            Every tool below is included with every membership tier. There are
            no rental fees and no per-tool charges. Got your own tools you
            trust? Bring them. Got a specialty socket for one weird car? Bring
            that too. And yes, the 10mm sockets are accounted for. Mostly.
          </p>
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

        <Section id="inventory" eyebrow="What's in the shop">
          <div className="mt-8 grid gap-10 sm:grid-cols-2">
            {inventory.map((group) => (
              <div key={group.category}>
                <h2 className="border-b border-hazard/40 pb-2 font-display text-sm font-semibold tracking-[0.16em] text-hazard uppercase">
                  {group.category}
                </h2>
                <ul className="mt-4 space-y-2 text-steel">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden className="text-hazard">
                        ·
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-sm text-steel-dim">
            Inventory grows as the shop does. If there is something specific
            you need for a job, ask before you book. We would rather tell you
            straight than have you turn up and find out.
          </p>
        </Section>

        {/* The list above says the lifts exist; this shows one doing the job. */}
        <HazardRule />
        <LiftSequence />

        <HazardRule />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}

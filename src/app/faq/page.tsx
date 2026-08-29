import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/primitives";
import { Faq, FinalCta } from "@/components/sections/home";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqSchema, graph } from "@/components/seo/schema";

export const metadata: Metadata = {
  title: "FAQ: How the Membership Works",
  description:
    "Answers about GaragePass in Oakland: what a membership includes, whether tools are provided, what work you can do, and whether hours expire. They don't.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={graph(
          faqSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        )}
      />
      <Header />
      <main id="main">
        <Container className="py-16 sm:py-20">
          <p className="eyebrow mb-4">FAQ</p>
          <h1 className="max-w-3xl text-[clamp(2rem,5.5vw,4rem)] leading-[1.02] font-bold uppercase">
            Questions, answered
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-steel">
            Still not sure? Tours are free and there is no pressure. Come look
            at the place and ask in person.
          </p>
        </Container>
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

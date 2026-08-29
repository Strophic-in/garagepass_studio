import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink, Container, Section } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  autoRepairSchema,
  breadcrumbSchema,
  graph,
} from "@/components/seo/schema";
import { site, formattedAddress, MISSING_FROM_CLIENT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact the Oakland Shop",
  description:
    "Get in touch with GaragePass at 950 77th Ave, Oakland CA 94621. Book a free shop tour, ask about membership, or reach us on Instagram and TikTok.",
  alternates: { canonical: "/contact" },
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  formattedAddress,
)}`;

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={graph(
          autoRepairSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        )}
      />
      <Header />

      <main id="main">
        <Container className="py-16 sm:py-20">
          <p className="eyebrow mb-4">Get in touch</p>
          <h1 className="max-w-3xl text-[clamp(2rem,5.5vw,4rem)] leading-[1.02] font-bold uppercase">
            Questions? Reach out.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-steel">
            All questions welcome. If you would rather just look around, book a
            free tour. No commitment.
          </p>
        </Container>

        <Section id="contact-details" eyebrow="Where to find us">
          <div className="mt-8 grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-sm font-semibold tracking-[0.16em] text-hazard uppercase">
                The shop
              </h2>

              <address className="mt-4 space-y-1 text-base not-italic text-steel">
                <span className="block text-paper">{site.name}</span>
                <span className="block">{site.address.street}</span>
                <span className="block">
                  {site.address.city}, {site.address.region}{" "}
                  {site.address.postalCode}
                </span>

                {site.phone ? (
                  <span className="block">
                    <a href={`tel:${site.phone}`} className="hover:text-hazard">
                      {site.phone}
                    </a>
                  </span>
                ) : (
                  MISSING_FROM_CLIENT.phone &&
                  process.env.NODE_ENV !== "production" && (
                    // Loud in development, because without a phone number the
                    // AutoRepair schema is incomplete and local ranking
                    // suffers, so it must not be possible to forget. Never
                    // rendered in a production build though: a visitor seeing
                    // "[ TODO: ... ]" is a worse problem than the one it
                    // flags, and Google would index the text.
                    <span className="block text-ember">
                      [ TODO: publish a phone number — required for local SEO ]
                    </span>
                  )
                )}
              </address>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/tour">Book a free tour</ButtonLink>
                <ButtonLink href={mapsUrl} variant="secondary">
                  Directions
                </ButtonLink>
              </div>
            </div>

            <div>
              <h2 className="font-display text-sm font-semibold tracking-[0.16em] text-hazard uppercase">
                Fastest response
              </h2>
              <p className="mt-4 text-steel">
                Social gets answered quickest. We post shop updates, build
                progress and event announcements there too.
              </p>

              <ul className="mt-5 space-y-2.5 text-base">
                <li>
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-steel hover:text-hazard"
                  >
                    Instagram: @garagepass.abe
                  </a>
                </li>
                <li>
                  <a
                    href={site.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-steel hover:text-hazard"
                  >
                    TikTok: @garagepass.abe
                  </a>
                </li>
                <li>
                  <a
                    href={site.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-steel hover:text-hazard"
                  >
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}

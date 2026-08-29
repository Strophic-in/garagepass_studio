import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/primitives";
import { site, formattedAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Privacy Policy",
  description:
    "Site use terms and privacy policy for GaragePass, a community DIY auto shop in Oakland, California.",
  alternates: { canonical: "/terms-privacy" },
  // Legal boilerplate carries no ranking value and dilutes crawl budget.
  robots: { index: false, follow: true },
};

/**
 * Placeholder standing in for the client's real legal copy.
 *
 * TODO(client): replace with reviewed terms and a privacy policy covering the
 * Breely handoff, analytics, and waitlist email collection. This page is
 * noindexed until then so an unfinished policy is not presented as final.
 */
export default function TermsPrivacyPage() {
  return (
    <>
      <Header />

      <main id="main">
        <Container className="py-16 sm:py-20">
          <h1 className="text-[clamp(1.75rem,4.5vw,3rem)] leading-tight font-bold uppercase">
            Terms &amp; privacy
          </h1>

          <div className="mt-8 max-w-2xl rounded-sm border border-ember/50 bg-ember/10 p-5 text-sm text-steel">
            <p className="font-semibold text-ember">
              Placeholder: not yet reviewed.
            </p>
            <p className="mt-2">
              This page is currently excluded from search indexing. It needs
              real legal copy from the business before launch, covering at
              minimum: membership and booking terms, the handoff to the Breely
              booking platform, analytics and cookies, and how waitlist emails
              are stored and used.
            </p>
          </div>

          <div className="mt-10 max-w-2xl space-y-6 text-steel">
            <section>
              <h2 className="font-display text-lg font-semibold tracking-wide text-paper uppercase">
                Who we are
              </h2>
              <p className="mt-3">
                {site.legalName}, trading as {site.name}, operates a community
                DIY auto shop at {formattedAddress}.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold tracking-wide text-paper uppercase">
                Bookings and payments
              </h2>
              <p className="mt-3">
                Memberships, tier changes, add-ons and lift bookings are handled
                by Breely, a third-party platform. When you click through to
                join or book, you leave this website and their terms and privacy
                policy apply to that transaction.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold tracking-wide text-paper uppercase">
                Contact
              </h2>
              <p className="mt-3">
                Questions about this policy can be sent through{" "}
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-hazard underline underline-offset-2 decoration-hazard/50 hover:decoration-hazard"
                >
                  Instagram
                </a>{" "}
                until a published email address is available.
              </p>
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}

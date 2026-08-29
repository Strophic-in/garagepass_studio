import Image from "next/image";
import Link from "next/link";
import { site, tiers } from "@/lib/site";
import type { LandingPage as LandingPageData } from "@/lib/landing-content";
import { ButtonLink, Container, Section } from "@/components/ui/primitives";

/**
 * Shared shell for the city + service landing pages.
 *
 * The template is shared; the copy never is. Each page supplies its own
 * sections from `landing-content.ts` — near-duplicate city pages are the
 * usual reason multi-location sites get filtered out of results.
 */
export function LandingPageBody({ page }: { page: LandingPageData }) {
  const isSanJose = page.city === "San Jose";
  const cityPath = isSanJose ? "/san-jose" : "/oakland";

  return (
    <main id="main">
      {/* Breadcrumb trail — visible, and mirrored in BreadcrumbList JSON-LD. */}
      <Container className="pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-steel-dim">
            <li>
              <Link href="/" className="hover:text-hazard">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={cityPath} className="hover:text-hazard">
                {page.city}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-steel">{page.serviceName}</li>
          </ol>
        </nav>
      </Container>

      <Container className="py-12 sm:py-16">
        <p className="eyebrow mb-4">
          {page.city}, California
          {isSanJose && ` · Opening ${site.sanJose.opening}`}
        </p>

        <h1 className="max-w-4xl text-[clamp(2rem,5.5vw,4rem)] leading-[1.02] font-bold uppercase">
          {page.h1}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          {page.lead}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {isSanJose ? (
            <>
              <ButtonLink href="/san-jose/waitlist">
                Join the waitlist
              </ButtonLink>
              <ButtonLink href="/oakland" variant="secondary">
                Visit the Oakland shop
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink
                href={site.breely.join}
                conversion={`landing-${page.slug}`}
              >
                Join from ${tiers[0].price}/mo
              </ButtonLink>
              <ButtonLink href="/tour" variant="secondary">
                Book a free tour
              </ButtonLink>
            </>
          )}
        </div>
      </Container>

      <Container>
        <div
          data-animate="scale"
          className="relative aspect-[16/9] w-full overflow-hidden rounded-sm border border-hairline/60"
        >
          <Image
            src={page.image.src}
            alt={page.image.alt}
            fill
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover"
          />
        </div>
      </Container>

      <Section id="detail">
        <div className="max-w-3xl space-y-14">
          {page.sections.map((section) => (
            <article key={section.heading} data-animate="up">
              <h2 className="text-2xl leading-tight font-semibold uppercase sm:text-3xl">
                {section.heading}
              </h2>
              {section.body.map((paragraph, i) => (
                <p
                  key={i}
                  className="mt-4 text-base leading-relaxed text-steel"
                >
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>
      </Section>

      {/* Internal linking — keeps crawl depth shallow and spreads authority. */}
      <Section
        id="related"
        eyebrow="Keep reading"
        className="border-t border-hairline/50 bg-surface/30"
      >
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {page.related.map((link) => (
            <li key={link.href} data-animate="up">
              <Link
                href={link.href}
                className="flex items-center justify-between gap-4 rounded-sm border border-hairline bg-surface/50 px-5 py-4 font-display text-sm tracking-wide text-paper uppercase transition-colors hover:border-hazard hover:text-hazard"
              >
                {link.label}
                <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}

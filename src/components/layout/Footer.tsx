import Link from "next/link";
import { site, formattedAddress, MISSING_FROM_CLIENT } from "@/lib/site";
import { coreRoutes, oaklandRoutes, sanJoseRoutes } from "@/lib/routes";
import { Container, HazardRule } from "@/components/ui/primitives";

/**
 * The footer carries NAP (name / address / phone) on every page, which is a
 * direct local-ranking signal and something the current site lacks entirely —
 * its contact page only says "hit us up on social".
 *
 * It is also the site's internal-linking hub: every landing page is reachable
 * from every other page, so crawl depth stays shallow.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-hairline/60 bg-surface/40">
      <HazardRule />

      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* NAP block — marked up for humans; JSON-LD carries the machine copy. */}
        <div>
          <p className="font-display text-lg font-bold tracking-[0.18em] text-paper uppercase">
            Garage<span className="text-hazard">Pass</span>
          </p>
          <p className="mt-3 text-sm text-steel-dim">{site.tagline}</p>

          <address className="mt-5 space-y-1 text-sm not-italic text-steel">
            <p>{site.address.street}</p>
            <p>
              {site.address.city}, {site.address.region}{" "}
              {site.address.postalCode}
            </p>

            {site.phone ? (
              <p>
                <a href={`tel:${site.phone}`} className="hover:text-hazard">
                  {site.phone}
                </a>
              </p>
            ) : (
              MISSING_FROM_CLIENT.phone &&
              process.env.NODE_ENV !== "production" && (
                // Loud in development, because a missing phone number blocks
                // the AutoRepair schema and local ranking and must not be
                // possible to forget. Never rendered in a production build
                // though: a visitor seeing "[ TODO: ... ]" in the footer of
                // every page is a worse problem than the one it flags, and
                // Google would index the text.
                <p className="text-ember">
                  [ TODO: publish a phone number — required for local SEO ]
                </p>
              )
            )}
          </address>

          <div className="mt-5 flex gap-4 text-sm">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-steel hover:text-hazard"
            >
              Instagram
            </a>
            <a
              href={site.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-steel hover:text-hazard"
            >
              TikTok
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-steel hover:text-hazard"
            >
              Facebook
            </a>
          </div>
        </div>

        <FooterColumn
          title="The Shop"
          links={coreRoutes
            .filter((r) => r.path !== "/")
            .map((r) => ({
              href: r.path,
              label: r.nav ?? labelFromPath(r.path),
            }))}
        />

        <FooterColumn
          title="Oakland"
          links={oaklandRoutes.map((r) => ({
            href: r.path,
            label: labelFromPath(r.path),
          }))}
        />

        <FooterColumn
          title={`San Jose, opening ${site.sanJose.opening}`}
          links={sanJoseRoutes.map((r) => ({
            href: r.path,
            label: labelFromPath(r.path),
          }))}
        />
      </Container>

      <Container className="flex flex-col gap-3 border-t border-hairline/50 py-6 text-xs text-steel-dim sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.legalName} · {site.tagline} · {formattedAddress}
        </p>
        <Link href="/terms-privacy" className="hover:text-hazard">
          Terms &amp; Privacy
        </Link>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <nav aria-label={title}>
      {/*
        Deliberately not a heading element. These are navigation labels, and
        the <nav aria-label> already names the landmark for assistive tech.
        Using <h2> here would compete with real content headings in the
        document outline on every page.
      */}
      <p className="font-display text-xs font-semibold tracking-[0.18em] text-hazard uppercase">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-steel transition-colors hover:text-hazard"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** "/oakland/car-lift-rental" → "Car Lift Rental". */
function labelFromPath(path: string) {
  const slug = path.split("/").filter(Boolean).pop() ?? "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

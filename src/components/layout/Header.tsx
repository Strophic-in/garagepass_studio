import Link from "next/link";
import { site } from "@/lib/site";
import { navRoutes } from "@/lib/routes";
import { ButtonLink, Container } from "@/components/ui/primitives";

/**
 * Server-rendered navigation — no client JS needed for the links themselves.
 *
 * The mobile menu is a pure CSS disclosure (`<details>`), which keeps the
 * header at zero JavaScript cost and means it still works before hydration.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline/60 bg-void/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-[0.18em] text-paper uppercase"
        >
          Garage<span className="text-hazard">Pass</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {navRoutes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="font-display text-xs font-medium tracking-[0.16em] text-steel uppercase transition-colors hover:text-hazard"
            >
              {route.nav}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <ButtonLink
            href={site.breely.join}
            conversion="header-join"
            className="px-5 py-2.5 text-xs"
          >
            Join
          </ButtonLink>
        </div>

        {/* Mobile disclosure — CSS only, functional without hydration. */}
        <details className="relative md:hidden [&[open]_.menu-closed]:hidden [&:not([open])_.menu-open]:hidden">
          <summary className="flex cursor-pointer list-none items-center rounded-sm p-2 text-paper [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Toggle navigation menu</span>
            <span aria-hidden className="menu-closed text-xl leading-none">
              ☰
            </span>
            <span aria-hidden className="menu-open text-xl leading-none">
              ✕
            </span>
          </summary>

          <nav
            aria-label="Primary mobile"
            className="absolute right-0 mt-3 flex w-56 flex-col gap-1 rounded-sm border border-hairline bg-surface p-2 shadow-2xl"
          >
            {navRoutes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className="rounded-sm px-3 py-2.5 font-display text-sm tracking-[0.12em] text-steel uppercase hover:bg-surface-2 hover:text-hazard"
              >
                {route.nav}
              </Link>
            ))}
            <ButtonLink
              href={site.breely.join}
              conversion="mobile-join"
              className="mt-1 w-full"
            >
              Join
            </ButtonLink>
          </nav>
        </details>
      </Container>
    </header>
  );
}

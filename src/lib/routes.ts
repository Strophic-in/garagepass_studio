/**
 * Every indexable route, in one place.
 *
 * The sitemap, the nav and the internal-link audit all read from here, so a
 * page cannot be shipped and then silently left out of the sitemap — which is
 * the failure mode the current site has in its most extreme form (no sitemap
 * exists at all).
 *
 * `priority` and `changeFrequency` are hints only; Google largely ignores
 * them, but Bing still uses them and they cost nothing to set correctly.
 */

export type Route = {
  path: string;
  /** Sitemap priority, 0–1. Reserve 1.0 for the homepage. */
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  /** Shown in the primary nav, in this order. */
  nav?: string;
};

export const coreRoutes: Route[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/membership", priority: 0.9, changeFrequency: "weekly", nav: "Membership" },
  { path: "/tools", priority: 0.7, changeFrequency: "monthly", nav: "Tools" },
  { path: "/tour", priority: 0.8, changeFrequency: "monthly", nav: "Tour" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/our-story", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly", nav: "Contact" },
  { path: "/events", priority: 0.5, changeFrequency: "weekly" },
];

/** Oakland — the live shop. */
export const oaklandRoutes: Route[] = [
  { path: "/oakland", priority: 0.9, changeFrequency: "monthly" },
  { path: "/oakland/car-lift-rental", priority: 0.9, changeFrequency: "monthly" },
  { path: "/oakland/diy-auto-shop", priority: 0.9, changeFrequency: "monthly" },
  { path: "/oakland/engine-swap-bay", priority: 0.8, changeFrequency: "monthly" },
  { path: "/oakland/motorcycle-lift-rental", priority: 0.8, changeFrequency: "monthly" },
  { path: "/oakland/project-car-storage", priority: 0.8, changeFrequency: "monthly" },
];

/**
 * San Jose — co-primary target. These ship before the location opens so the
 * URLs accrue authority across the 3–6 months organic rankings need to mature.
 */
export const sanJoseRoutes: Route[] = [
  { path: "/san-jose", priority: 0.9, changeFrequency: "monthly" },
  { path: "/san-jose/car-lift-rental", priority: 0.8, changeFrequency: "monthly" },
  { path: "/san-jose/diy-auto-shop", priority: 0.8, changeFrequency: "monthly" },
  { path: "/san-jose/engine-swap-bay", priority: 0.7, changeFrequency: "monthly" },
  { path: "/san-jose/waitlist", priority: 0.8, changeFrequency: "monthly" },
];

export const legalRoutes: Route[] = [
  { path: "/terms-privacy", priority: 0.2, changeFrequency: "yearly" },
];

export const allRoutes: Route[] = [
  ...coreRoutes,
  ...oaklandRoutes,
  ...sanJoseRoutes,
  ...legalRoutes,
];

/** Primary navigation, derived so nav and sitemap can never drift apart. */
export const navRoutes = coreRoutes.filter(
  (r): r is Route & { nav: string } => Boolean(r.nav),
);

/**
 * 301s from the legacy WordPress site. Preserves whatever equity the domain
 * has and clears the dead `/website_b5800383/*` staging paths that are
 * currently linked from the live navigation.
 */
export const legacyRedirects: { source: string; destination: string }[] = [
  { source: "/about", destination: "/membership" },
  { source: "/subscribe", destination: "/membership" },
  { source: "/tc-privacy", destination: "/terms-privacy" },
  { source: "/member-portal", destination: "/membership" },

  // Orphaned Bluehost site-builder staging URLs, live in the current nav.
  { source: "/website_b5800383", destination: "/" },
  { source: "/website_b5800383/subscribe", destination: "/membership" },
  { source: "/website_b5800383/tour", destination: "/tour" },
  { source: "/website_b5800383/member-portal", destination: "/membership" },

  // WordPress plumbing that should never have been crawlable.
  { source: "/feed", destination: "/" },
  { source: "/comments/feed", destination: "/" },
];

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
 * 301s from the legacy WordPress site.
 *
 * garagepass.co is a live WordPress install whose Yoast sitemap lists 31 URLs.
 * Every one of them is a page a search engine may already rank, so every one
 * needs somewhere to land — a 404 after the cutover throws away whatever
 * equity that URL had rather than passing it to the page that replaced it.
 *
 * The list below is taken straight from that sitemap, not guessed. Each entry
 * points at the closest match in intent rather than at the homepage, because a
 * redirect to an unrelated page is treated as a soft 404 and passes nothing.
 *
 * Two of the old slugs say "wewrench-diy": the shop was renamed, and those
 * URLs may still carry links from the earlier brand.
 *
 * Regenerate this list before launch if the WordPress site changes:
 *   curl -sL https://garagepass.co/page-sitemap.xml | grep -oE '<loc>[^<]+'
 */
export const legacyRedirects: { source: string; destination: string }[] = [
  // --- pages -------------------------------------------------------------
  { source: "/about", destination: "/our-story" },
  { source: "/services", destination: "/membership" },
  { source: "/rules", destination: "/faq" },
  { source: "/free-trial", destination: "/tour" },
  { source: "/subscribe", destination: "/membership" },
  { source: "/booking", destination: "/membership" },
  { source: "/account-settings", destination: "/membership" },
  { source: "/purchase-add-ons-storage-services", destination: "/membership" },
  { source: "/change-tier-add-hours", destination: "/membership" },
  { source: "/member-portal", destination: "/membership" },
  { source: "/tc-privacy", destination: "/terms-privacy" },
  // The single most valuable legacy URL: exact intent match for the new page.
  { source: "/south-bay-san-jose-preorder", destination: "/san-jose/waitlist" },
  // A leftover theme demo page that should never have been published.
  { source: "/home-tastyvibes", destination: "/" },

  // --- posts -------------------------------------------------------------
  { source: "/hello-world", destination: "/" },
  {
    source: "/top-benefits-of-diy-auto-repair",
    destination: "/oakland/diy-auto-shop",
  },
  {
    source: "/how-to-book-your-workspace-rental",
    destination: "/membership",
  },
  { source: "/understanding-shop-rules-at-wewrench-diy", destination: "/faq" },
  {
    source: "/essential-mechanic-tools-for-diy-repairs",
    destination: "/tools",
  },
  {
    source: "/training-opportunities-at-wewrench-diy",
    destination: "/events",
  },
  {
    source: "/understanding-liability-forms-for-diy-repairs",
    destination: "/faq",
  },

  // --- category archives --------------------------------------------------
  { source: "/category/auto", destination: "/oakland/diy-auto-shop" },
  { source: "/category/booking", destination: "/membership" },
  { source: "/category/liability", destination: "/faq" },
  { source: "/category/rules", destination: "/faq" },
  { source: "/category/tools", destination: "/tools" },
  { source: "/category/training", destination: "/events" },
  { source: "/category/uncategorized", destination: "/" },

  // --- orphaned Bluehost site-builder staging paths, linked from the old nav
  { source: "/website_b5800383", destination: "/" },
  { source: "/website_b5800383/subscribe", destination: "/membership" },
  { source: "/website_b5800383/tour", destination: "/tour" },
  { source: "/website_b5800383/member-portal", destination: "/membership" },

  // --- WordPress plumbing that should never have been crawlable -----------
  { source: "/feed", destination: "/" },
  { source: "/comments/feed", destination: "/" },
  { source: "/wp-login.php", destination: "/" },
  { source: "/xmlrpc.php", destination: "/" },
  { source: "/wp-admin/:path*", destination: "/" },
  { source: "/wp-content/:path*", destination: "/" },
  { source: "/wp-includes/:path*", destination: "/" },
];

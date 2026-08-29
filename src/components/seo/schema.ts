/**
 * JSON-LD builders.
 *
 * The current garagepass.co emits only a generic `WebPage` + `ImageObject`
 * graph — no `LocalBusiness`, no `Offer`, and no `FAQPage` despite having
 * visible FAQ copy. For a business whose customers search "near me", the
 * missing `LocalBusiness` node is the difference between appearing in the
 * map pack and being invisible to it.
 *
 * Every builder returns a plain object; render it through `<JsonLd>`.
 */

import {
  site,
  tiers,
  faqs,
  formattedAddress,
  photos,
  type MembershipTier,
} from "@/lib/site";

const ORG_ID = `${site.url}/#organization`;
const SHOP_ID = `${site.url}/#oakland-shop`;
const WEBSITE_ID = `${site.url}/#website`;

/** Absolute URL helper — schema.org requires absolute, never relative. */
const abs = (path: string) => `${site.url}${path}`;

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: site.address.street,
  addressLocality: site.address.city,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country,
} as const;

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: abs(photos.liftBays.src),
    founder: { "@type": "Person", name: site.founder },
    sameAs: [site.social.instagram, site.social.tiktok, site.social.facebook],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

/**
 * `AutoRepair` is a subtype of `LocalBusiness` and the most specific type
 * Google recognises for this business. It is the highest-value node on the
 * site.
 *
 * `telephone` and `openingHoursSpecification` are omitted while the client
 * has not supplied them — emitting a placeholder would be worse than an
 * absent field, since inconsistent NAP actively harms local ranking.
 */
export function autoRepairSchema() {
  return {
    "@type": "AutoRepair",
    "@id": SHOP_ID,
    name: site.name,
    alternateName: site.tagline,
    description:
      "Membership-based community DIY auto shop in Oakland, California. Rent a car lift by the hour with every tool included, from hand tools to engine hoists and transmission jacks.",
    url: site.url,
    image: [
      abs(photos.liftBays.src),
      abs(photos.truckOnLift.src),
      abs(photos.exterior.src),
    ],
    address: postalAddress,
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.lat,
      longitude: site.address.lng,
    },
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.email ? { email: site.email } : {}),
    priceRange: `$${tiers[0].price}–$${tiers[tiers.length - 1].price}`,
    currenciesAccepted: "USD",
    areaServed: site.areaServed.map((name) => ({
      "@type": "City",
      name,
    })),
    parentOrganization: { "@id": ORG_ID },
    sameAs: [site.social.instagram, site.social.tiktok, site.social.facebook],
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      formattedAddress,
    )}`,
    makesOffer: tiers.map(offerFromTier),
  };
}

/** One `Offer` per membership tier — drives price-range rich results. */
function offerFromTier(tier: MembershipTier) {
  return {
    "@type": "Offer",
    name: `${tier.name} Membership`,
    description: `${tier.hours} hours of lift time per month at $${tier.rate}/hour. Unused hours roll over and never expire.`,
    price: tier.price,
    priceCurrency: "USD",
    url: abs("/membership"),
    availability: "https://schema.org/InStock",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: tier.price,
      priceCurrency: "USD",
      billingIncrement: 1,
      unitCode: "MON", // UN/CEFACT code for month
    },
  };
}

/**
 * `Product` + `AggregateOffer` for the membership page. Distinct from the
 * `makesOffer` list above: this one is the page's primary entity.
 */
export function membershipProductSchema() {
  const prices = tiers.map((t) => t.price);
  return {
    "@type": "Product",
    name: `${site.name} Membership`,
    description:
      "Monthly membership to a community DIY auto shop in Oakland. Includes lift time, full tool access, fluid disposal and community events.",
    brand: { "@id": ORG_ID },
    image: abs(photos.liftBays.src),
    offers: {
      "@type": "AggregateOffer",
      offerCount: tiers.length,
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      priceCurrency: "USD",
      offers: tiers.map(offerFromTier),
    },
  };
}

/**
 * The FAQ copy already exists on the live site as plain prose. Marking it up
 * is free rich-result eligibility that is currently being left unclaimed.
 */
export function faqSchema() {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(
  crumbs: { name: string; path: string }[],
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/** Used on each city/service landing page. */
export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  areaServed: readonly string[];
}) {
  return {
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: abs(opts.path),
    provider: { "@id": SHOP_ID },
    serviceType: "DIY auto shop and car lift rental",
    areaServed: opts.areaServed.map((name) => ({ "@type": "City", name })),
  };
}

/**
 * Wraps nodes into a single `@graph`. One script tag per page beats several
 * disconnected ones, because `@id` references resolve within the graph.
 */
export function graph(...nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

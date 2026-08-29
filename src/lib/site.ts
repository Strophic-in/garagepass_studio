/**
 * Single source of truth for GaragePass business data.
 *
 * Everything that needs NAP (name / address / phone), pricing, hours or
 * outbound Breely links reads from here — JSON-LD schema, the footer, the
 * contact page, the sitemap. Local SEO depends on these values being
 * byte-identical everywhere they appear, so never inline them at a call site.
 *
 * Values verified against garagepass.co on 2026-08-29.
 */

/**
 * Items the business has not supplied yet. These are rendered as visible
 * placeholders rather than silently omitted, so they cannot ship unnoticed.
 * `AutoRepair` schema and local ranking both need a real phone number.
 */
export const MISSING_FROM_CLIENT = {
  phone: true,
  email: true,
  openingHours: true,
} as const;

export const site = {
  name: "GaragePass",
  legalName: "GARAGEPASS LLC",
  tagline: "A Community DIY Auto Shop",
  url: "https://garagepass.co",
  founder: "Abraham Barkhordar",
  founded: "2026",

  /** TODO(client): no phone or email exists on the current site. Required for AutoRepair schema. */
  phone: null as string | null,
  email: null as string | null,

  address: {
    street: "950 77th Ave",
    city: "Oakland",
    region: "CA",
    regionName: "California",
    postalCode: "94621",
    country: "US",
    /** Approximate — TODO(client): confirm exact coordinates before launch. */
    lat: 37.7395,
    lng: -122.1935,
  },

  /** Cities named in `areaServed`. Drives schema and landing-page copy. */
  areaServed: [
    "Oakland",
    "Berkeley",
    "Alameda",
    "San Leandro",
    "Emeryville",
    "San Francisco",
    "Hayward",
    "Richmond",
  ],

  social: {
    instagram: "https://www.instagram.com/garagepass.abe",
    tiktok: "https://www.tiktok.com/@garagepass.abe",
    facebook: "https://www.facebook.com/profile.php?id=61591651572047",
  },

  /**
   * Breely is the transaction layer — signup, tier changes, add-ons and lift
   * booking all happen there. The site never rebuilds booking; it routes into
   * these URLs and tracks the handoff as a conversion.
   */
  breely: {
    join: "https://wewrench.breely.com/form/21561",
    bookLift: "https://wewrench.breely.com/form/18915",
    changeTier: "https://wewrench.breely.com/form/18916",
    addOns: "https://wewrench.breely.com/form/20067",
  },

  /** Free in-person tours. Distinct from shop operating hours, which we don't have. */
  tourTimes: [
    { days: "Weekdays", time: "6:00 PM" },
    { days: "Saturday & Sunday", time: "12:00 PM & 4:00 PM" },
  ],

  /** Second location. Ships as content now to earn its ranking runway. */
  sanJose: {
    opening: "Q1 2027",
    openingLong: "Q4 2026 / Q1 2027",
    /*
      Taken from the search-area polygon on the South Bay map, not guessed.
      The map covers a wider catchment than this list originally claimed —
      Mountain View, Los Gatos and Saratoga all sit inside the boundary and
      were missing.

      It matters more than a copy detail: this array feeds the `areaServed`
      on the San Jose LocalBusiness schema and on every /san-jose/[slug]
      landing page, plus the visible copy on four pages. Each name is a
      "diy auto shop <city>" query the South Bay pages can answer.

      Alum Rock is on the map but is a San Jose district rather than a city,
      so it stays in the map's alt text and out of this list.
    */
    areaServed: [
      "San Jose",
      "Santa Clara",
      "Sunnyvale",
      "Mountain View",
      "Milpitas",
      "Campbell",
      "Cupertino",
      "Los Gatos",
      "Saratoga",
    ],
  },
} as const;

export type MembershipTier = {
  slug: string;
  name: string;
  price: number;
  hours: number;
  /** Effective $/hr — the number that actually sells the higher tiers. */
  rate: number;
  popular?: boolean;
};

/** Six tiers, exactly as published on garagepass.co/about. */
export const tiers: MembershipTier[] = [
  { slug: "bronze", name: "Bronze", price: 60, hours: 2, rate: 30 },
  { slug: "general", name: "General", price: 150, hours: 5, rate: 30, popular: true },
  { slug: "silver", name: "Silver", price: 300, hours: 10, rate: 30 },
  { slug: "gold", name: "Gold", price: 450, hours: 15, rate: 30 },
  { slug: "platinum", name: "Platinum", price: 1000, hours: 50, rate: 20 },
  { slug: "double-platinum", name: "Double Platinum", price: 1500, hours: 100, rate: 15 },
];

/** Optional monthly add-ons, billed alongside the membership. */
export const addOns = [
  { name: "Car storage", price: 300, unit: "mo" },
  { name: "Motorcycle storage", price: 300, unit: "mo" },
  { name: "Small shed", price: 35, unit: "mo" },
  { name: "Locker", price: 16, unit: "mo" },
  { name: "Luxury wash", price: 65, unit: "mo" },
] as const;

/** One-time bonus hour packs available at signup. */
export const bonusHours = [
  { hours: 5, price: 100 },
  { hours: 10, price: 200 },
  { hours: 20, price: 400 },
  { hours: 50, price: 1000 },
] as const;

/** Disclosed at checkout — stated wherever a price appears. */
export const PROCESSING_FEE = 10;

/** Included with every tier, no upsell. */
export const includedBenefits = [
  {
    title: "Lift access",
    body: "Book your lift time online. Your booking, your lift. No waiting on someone else to finish.",
  },
  {
    title: "Every tool included",
    body: "Hand tools through engine hoists, transmission jacks and smoke machines. Stop buying a $400 tool for one job.",
  },
  {
    title: "Fluid disposal & metal recycling",
    body: "Drain oil, coolant and transmission fluid into our collection containers and we handle the rest. No trunk full of milk jugs.",
  },
  {
    title: "Community",
    body: "Free monthly events, the members' Discord, and a members' lounge coming soon.",
  },
  {
    title: "Member perks",
    body: "Discounted towing, detailing and sponsor deals, with more added as we grow.",
  },
  {
    title: "No contracts",
    body: "Cancel anytime. Unused hours never expire, roll over forever, and stack with no limit.",
  },
] as const;

/**
 * FAQ copy adapted from the live site. Rendered as visible content AND as
 * `FAQPage` JSON-LD — the existing site has this copy with no markup, which
 * is free rich-result eligibility being left on the table.
 */
export const faqs = [
  {
    q: "Where are you located?",
    a: `${site.address.street}, ${site.address.city}, ${site.address.region}, right off 880. Our first shop of hopefully many, with San Jose coming ${site.sanJose.openingLong}.`,
  },
  {
    q: "What does a membership include?",
    a: "Lift access booked through our appointment system, full tool access from hand tools to engine hoists and transmission jacks, fluid disposal and metal recycling, free monthly community events plus our members' Discord, and member perks including discounted towing and sponsor deals.",
  },
  {
    q: "Do you provide tools, or do I bring my own?",
    a: "We provide pretty much everything you'll need: lifts, jacks, stands, and a solid selection of hand tools and shop equipment. Got your own tools you trust? Bring them. Specialty tools for your specific job, bring those too. And yes, the 10mm sockets are accounted for. Mostly.",
  },
  {
    q: "What kinds of work can I do at GaragePass?",
    a: "Anything. If you can wrench it, you can do it here: oil changes, brake jobs, suspension installs, engine swaps, transmission swaps, and full classic car restorations. Motorcycles too.",
  },
  {
    q: "Do my hours expire?",
    a: "Never. Unused hours roll over forever and stack with no limit on how many you can save up. There are no long-term contracts and you can cancel anytime.",
  },
  {
    q: "How much does it cost?",
    a: `Memberships start at $${tiers[0].price}/mo for ${tiers[0].hours} hours and go up to $${tiers[5].price}/mo for ${tiers[5].hours} hours, which works out to $${tiers[5].rate}/hour. A $${PROCESSING_FEE}/mo processing fee applies at checkout.`,
  },
  {
    q: "Can I see the shop before I join?",
    a: "Yes, tours are free and there's no pressure. Swing by, meet the team, check out the lifts and tools, and get your questions answered.",
  },
  {
    q: "Can I store my project car there?",
    a: `Yes. Long-term parking is available for deep restoration work or engine-out projects at $300/mo, and on-site storage lockers and sheds start at $${addOns[3].price}/mo.`,
  },
] as const;

/** Real photographs of the shop. Used for gallery, sections and Google Business Profile. */
export const photos = {
  liftBays: {
    src: "/images/garagepass-oakland-diy-auto-shop-lift-bays.webp",
    width: 1536,
    height: 1536,
    alt: "Four two-post car lifts with black posts and yellow arms in the GaragePass DIY auto shop in Oakland, California",
  },
  truckOnLift: {
    src: "/images/garagepass-oakland-truck-on-two-post-lift.webp",
    width: 1536,
    height: 2048,
    alt: "A pickup truck raised on a two-post lift at GaragePass, the community DIY auto shop in Oakland",
  },
  exterior: {
    src: "/images/garagepass-oakland-exterior-77th-avenue.webp",
    width: 1536,
    height: 1024,
    alt: "Exterior of GaragePass at 950 77th Avenue in Oakland, showing the open roll-up shop door and member parking",
  },
  projectCarStorage: {
    src: "/images/garagepass-oakland-project-car-storage.webp",
    width: 1536,
    height: 1024,
    alt: "Covered project car storage at GaragePass Oakland with member vehicles parked under the carport",
  },
  classicCarStorage: {
    src: "/images/garagepass-oakland-classic-car-storage.webp",
    width: 1536,
    height: 2048,
    alt: "A green classic British roadster under a car cover in covered storage at GaragePass Oakland",
  },
  memberBodyPanel: {
    src: "/images/garagepass-member-fitting-3d-printed-body-panel.webp",
    width: 1365,
    height: 2048,
    alt: "A GaragePass member fitting a 3D-printed body panel to his project car at the Oakland shop",
  },
} as const;

/** Formatted "950 77th Ave, Oakland, CA 94621" — used in copy and schema. */
export const formattedAddress = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

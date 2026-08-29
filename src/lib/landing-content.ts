/**
 * Content for the city + service landing pages.
 *
 * Each page carries genuinely distinct copy. Duplicating one page and swapping
 * the city name is the standard way multi-location sites get filtered out of
 * results, so Oakland and San Jose pages argue different things: Oakland sells
 * a shop you can visit today, San Jose sells a waitlist for a shop opening in
 * Q1 2027 and speaks to South Bay conditions.
 */

import { site, photos, tiers } from "@/lib/site";

export type LandingSection = { heading: string; body: string[] };

export type LandingPage = {
  slug: string;
  city: "Oakland" | "San Jose";
  title: string;
  description: string;
  h1: string;
  lead: string;
  /** Schema `Service.name`. */
  serviceName: string;
  sections: LandingSection[];
  image: (typeof photos)[keyof typeof photos];
  /** Internal links out — every landing page feeds two others. */
  related: { href: string; label: string }[];
};

const OAKLAND_AREA = site.areaServed;
const SJ_AREA = site.sanJose.areaServed;

export const oaklandPages: LandingPage[] = [
  {
    slug: "car-lift-rental",
    city: "Oakland",
    title: "Car Lift Rental in Oakland, CA from $15/hr",
    description:
      "Rent a two-post car lift by the hour in Oakland. Tools, jacks and fluid disposal included. From $30/hr, dropping to $15/hr on higher tiers. Book online.",
    h1: "Car lift rental in Oakland, California",
    lead: "Book a two-post lift by the hour at our shop on 77th Ave. Every tool is included, your hours roll over forever, and there is no contract.",
    serviceName: "Car lift rental",
    image: photos.truckOnLift,
    sections: [
      {
        heading: "What an hour on the lift actually gets you",
        body: [
          "When you book lift time at GaragePass, the bay is yours for the slot. Nobody is sharing it, and nobody is going to ask you to drop the car so they can get their turn. You get a two-post lift, jack stands, and access to the full tool inventory: hand tools through engine hoists, transmission jacks and smoke machines.",
          "That matters more than the hourly figure. Renting a lift somewhere that makes you queue for a torque wrench is not the same product. The tools being included is the reason a brake job here costs an hour instead of an afternoon.",
        ],
      },
      {
        heading: "What it costs",
        body: [
          `Lift time is priced through membership rather than a walk-in day rate. The entry tier is $${tiers[0].price}/mo for ${tiers[0].hours} hours, which works out to $${tiers[0].rate}/hour. If you use the shop heavily, the rate drops. The ${tiers[5].name} tier is $${tiers[5].price}/mo for ${tiers[5].hours} hours, or $${tiers[5].rate}/hour.`,
          "Unused hours never expire. They roll over month to month with no cap, so a slow winter is not wasted money. It is hours banked for the spring project.",
        ],
      },
      {
        heading: "Jobs people book lift time for",
        body: [
          "Oil changes and fluid services, brake pads and rotors, suspension and coilover installs, clutch jobs, exhaust work, wheel bearings, and full engine and transmission swaps. Anything you would do on jack stands is faster and safer at chest height.",
          "Fluid disposal is included. Drain your oil, coolant or transmission fluid straight into our collection containers and we handle the rest. No trunk full of milk jugs looking for somewhere that will take them.",
        ],
      },
      {
        heading: "Getting here",
        body: [
          `We are at ${site.address.street} in ${site.address.city}, right off the 880, which puts us within easy reach of ${OAKLAND_AREA.slice(0, 5).join(", ")} and the rest of the East Bay.`,
          "If you want to see the lifts before committing to anything, tours are free and run daily. There is no pressure and no sales pitch. Come look at the space and decide.",
        ],
      },
    ],
    related: [
      { href: "/oakland/diy-auto-shop", label: "DIY auto shop in Oakland" },
      { href: "/oakland/engine-swap-bay", label: "Engine swap bay rental" },
    ],
  },
  {
    slug: "diy-auto-shop",
    city: "Oakland",
    title: "DIY Auto Shop in Oakland: Rent a Bay",
    description:
      "Oakland's community DIY auto shop. Rent a bay with a lift and every tool included, from $60/mo. No garage needed, no contract, hours never expire.",
    h1: "A DIY auto shop in Oakland you can actually use",
    lead: "If you know how to do the work but have nowhere to do it, this is the missing piece: a real shop with real lifts, booked by the hour.",
    serviceName: "DIY auto shop access",
    image: photos.liftBays,
    sections: [
      {
        heading: "The problem this solves",
        body: [
          "Most people who want to work on their own car in Oakland do not have a garage. Apartment parking bans it, landlords object, and street work in the East Bay means kneeling on asphalt with a jack you do not fully trust while the light goes.",
          "The alternative has historically been paying a shop $150–$200 an hour for labour you are perfectly capable of doing. That is not a knowledge gap. It is a space and equipment gap, and it is the entire reason GaragePass exists.",
        ],
      },
      {
        heading: "How a membership works",
        body: [
          `Pick a tier, book your lift time online, and show up. Tiers start at $${tiers[0].price}/mo for ${tiers[0].hours} hours and go up to $${tiers[5].price}/mo for ${tiers[5].hours} hours. There is a $10/mo processing fee at checkout and no long-term contract. Cancel whenever.`,
          "Your booking is your lift. You are not waiting on someone else to finish, and you are not being rushed off because the shop needs the bay back.",
        ],
      },
      {
        heading: "Who actually uses the shop",
        body: [
          "The membership skews toward people with a project: a track car that needs corner-weighting, a classic mid-restoration, a daily that needs brakes before registration. But a large share of bookings are ordinary maintenance by people who simply do not want to pay shop rates for an oil change.",
          "Beginners are welcome and common. Every new member gets lift safety training before their first booking, and there is almost always someone in the next bay who has done the job you are attempting. Monthly community events and a members' Discord exist for exactly that reason.",
        ],
      },
      {
        heading: "What is included",
        body: [
          "Lift access, the full tool inventory, fluid disposal and metal recycling, free monthly events, the members' Discord, and member perks including discounted towing and sponsor deals. Optional add-ons cover long-term project parking, storage lockers and sheds, and monthly detailing through a local partner.",
        ],
      },
    ],
    related: [
      { href: "/oakland/car-lift-rental", label: "Car lift rental in Oakland" },
      { href: "/oakland/project-car-storage", label: "Project car storage" },
    ],
  },
  {
    slug: "engine-swap-bay",
    city: "Oakland",
    title: "Engine Swap Bay Rental in Oakland",
    description:
      "Rent a bay for an engine or transmission swap in Oakland. Two-post lift, engine hoist and transmission jack included, plus parking for engine-out builds.",
    h1: "Engine swap bay rental in Oakland",
    lead: "A lift, an engine hoist and a transmission jack in the same place, plus somewhere to leave the car while the motor is out.",
    serviceName: "Engine swap bay rental",
    image: photos.truckOnLift,
    sections: [
      {
        heading: "Why swaps need more than a lift",
        body: [
          "An engine swap is the job that most exposes the limits of a home setup. You need the car in the air, you need a hoist to pull the motor, you need a transmission jack to get the gearbox out safely, and you need somewhere the car can sit for weeks while parts arrive.",
          "Buying that equipment for one build makes no sense. An engine hoist and a transmission jack together cost more than most people's parts budget, and then you own two large tools you will use once and have nowhere to store.",
        ],
      },
      {
        heading: "What we provide",
        body: [
          "Two-post lifts, engine hoists, transmission jacks, jack stands, and the full hand tool inventory. Fluid disposal is included, which matters more on a swap than any other job. You will be draining oil, coolant and gearbox fluid in the same session.",
          "For engine-out builds, long-term parking is available at $300/mo so the car does not have to leave the property between sessions. Storage lockers and sheds start at $16/mo for the parts pile that inevitably accumulates.",
        ],
      },
      {
        heading: "Planning your booking",
        body: [
          "Swaps run long, so higher tiers make sense here. The Platinum tier is $1,000/mo for 50 hours ($20/hour) and Double Platinum is $1,500/mo for 100 hours ($15/hour), meaningfully cheaper per hour than the entry tiers if you are working through a build.",
          "Because hours roll over and never expire, a common pattern is banking hours on a lower tier through the planning and parts-gathering phase, then using them in a concentrated block once everything has arrived.",
        ],
      },
    ],
    related: [
      { href: "/oakland/car-lift-rental", label: "Car lift rental in Oakland" },
      { href: "/oakland/project-car-storage", label: "Project car storage in Oakland" },
    ],
  },
  {
    slug: "motorcycle-lift-rental",
    city: "Oakland",
    title: "Motorcycle Lift Rental in Oakland, CA",
    description:
      "Work on your motorcycle at a proper shop in Oakland. Lift access, full tool inventory and fluid disposal included. Memberships from $60/mo, no contract.",
    h1: "Motorcycle work space in Oakland",
    lead: "Bikes are welcome. Same lifts, same tools, same fluid disposal, same hourly booking.",
    serviceName: "Motorcycle lift and work bay rental",
    image: photos.liftBays,
    sections: [
      {
        heading: "Motorcycles at GaragePass",
        body: [
          "Motorcycle work has the same core problem as car work, only with less sympathy from landlords. A bike in a living room is a common Bay Area compromise, and it is a bad one. Chain and sprocket work, valve adjustments, fork seals, carb and throttle body cleaning and full engine work all go faster with proper space, light and a bench height that is not the floor.",
          "Fluid disposal covers bikes exactly as it does cars. Drain oil and coolant into our containers and leave it with us.",
        ],
      },
      {
        heading: "Storage for bikes",
        body: [
          "Motorcycle storage is available at $300/mo for riders who do not have secure parking, which in much of Oakland is the deciding factor rather than the work space itself. Lockers from $16/mo cover gear, spares and tools you would rather not transport each visit.",
        ],
      },
      {
        heading: "Pricing",
        body: [
          `The same tiers apply, from $${tiers[0].price}/mo for ${tiers[0].hours} hours up to $${tiers[5].price}/mo for ${tiers[5].hours} hours, with hours rolling over indefinitely. Most bike jobs are shorter than the equivalent car job, so the lower tiers go further than you would expect.`,
        ],
      },
    ],
    related: [
      { href: "/oakland/diy-auto-shop", label: "DIY auto shop in Oakland" },
      { href: "/membership", label: "Compare all membership tiers" },
    ],
  },
  {
    slug: "project-car-storage",
    city: "Oakland",
    title: "Project Car Storage in Oakland at $300/mo",
    description:
      "Covered project car storage in Oakland at $300/mo, with lift access on the same site. Storage lockers and sheds from $16/mo. Ideal for restorations.",
    h1: "Project car storage in Oakland",
    lead: "Somewhere to keep the build between sessions, on the same site as the lifts and tools you need to finish it.",
    serviceName: "Project car and motorcycle storage",
    image: photos.classicCarStorage,
    sections: [
      {
        heading: "Storage that is next to the workshop",
        body: [
          "Most storage solves half the problem. A unit across town keeps the car off your street but means towing it somewhere else every time you want to turn a bolt. Storage at GaragePass is on the same site as the lifts, so the car moves from its parking space into a bay and back again.",
          "That is what makes long restorations practical. An engine-out project can sit safely for months and still be worked on any week you have the time.",
        ],
      },
      {
        heading: "What is available",
        body: [
          "Long-term car parking is $300/mo and motorcycle storage is also $300/mo. On-site storage lockers start at $16/mo and small sheds at $35/mo, which covers the parts, spares and specialty tools that accumulate around any serious build.",
          "Add-ons are billed monthly alongside your membership and can be cancelled like anything else here. There is no minimum term.",
        ],
      },
      {
        heading: "Who it suits",
        body: [
          "Classic restorations, engine-out builds, track cars that are not street-registered, second vehicles that will not fit in an apartment space, and anyone whose HOA or landlord has taken an interest in the car under a cover on the driveway.",
          "We have also partnered with a local detailer, so monthly washes and beauty services are available at $65/mo for cars that are being stored rather than driven.",
        ],
      },
    ],
    related: [
      { href: "/oakland/engine-swap-bay", label: "Engine swap bay rental" },
      { href: "/oakland/car-lift-rental", label: "Car lift rental in Oakland" },
    ],
  },
];

export const sanJosePages: LandingPage[] = [
  {
    slug: "car-lift-rental",
    city: "San Jose",
    title: "Car Lift Rental in San Jose, CA",
    description:
      "Car lift rental coming to San Jose in Q1 2027. Book a two-post lift by the hour with every tool included. Join the waitlist for founding-member pricing.",
    h1: "Car lift rental in San Jose, California",
    lead: `We are bringing hourly lift rental to the South Bay in ${site.sanJose.opening}. Join the waitlist and you will get founding-member pricing before we open the doors.`,
    serviceName: "Car lift rental",
    image: photos.truckOnLift,
    sections: [
      {
        heading: "What is coming to San Jose",
        body: [
          `The San Jose shop will run the same model as our Oakland location: book a two-post lift by the hour, use every tool in the building at no extra charge, and drain your fluids into our collection containers on the way out.`,
          "Same pricing structure, same rollover hours, same absence of a contract. The only thing changing is the address.",
        ],
      },
      {
        heading: "Why the South Bay needs this",
        body: [
          `Silicon Valley has an unusual concentration of people who are technically capable of doing their own vehicle work and structurally prevented from doing it. Dense housing, strict HOAs and expensive square footage mean a garage is either unavailable or far too valuable to give over to a project car.`,
          `We will serve ${SJ_AREA.join(", ")} and the surrounding South Bay.`,
        ],
      },
      {
        heading: "How the waitlist works",
        body: [
          "Joining the waitlist costs nothing and commits you to nothing. It gets you the opening date before it is public, founding-member pricing, and first pick of booking slots in the opening weeks.",
          "In the meantime, the Oakland shop is open and running today if you are willing to make the drive up the 880.",
        ],
      },
    ],
    related: [
      { href: "/san-jose/waitlist", label: "Join the San Jose waitlist" },
      { href: "/san-jose/diy-auto-shop", label: "DIY auto shop in San Jose" },
    ],
  },
  {
    slug: "diy-auto-shop",
    city: "San Jose",
    title: "DIY Auto Shop in San Jose, Opening Q1 2027",
    description:
      "A community DIY auto shop opening in San Jose in Q1 2027. Rent a bay with a lift and every tool included. Join the waitlist for founding-member pricing.",
    h1: "A DIY auto shop for San Jose",
    lead: "Somewhere in the South Bay to do your own work properly, with a lift, a full tool inventory and no landlord asking questions.",
    serviceName: "DIY auto shop access",
    image: photos.liftBays,
    sections: [
      {
        heading: "The South Bay problem",
        body: [
          "If you rent in San Jose, Santa Clara or Sunnyvale, working on your own car is close to impossible. Apartment complexes prohibit it outright, HOAs enforce it aggressively, and the few streets where nobody objects are not places you want to be under a car on jack stands.",
          "If you own, a garage in this market is some of the most expensive square footage in the country, and it is usually already full.",
        ],
      },
      {
        heading: "What a membership will include",
        body: [
          `Everything the Oakland shop includes: lift time booked online, the full tool inventory from hand tools to engine hoists and transmission jacks, fluid disposal and metal recycling, monthly community events and the members' Discord.`,
          `Tiers will start at $${tiers[0].price}/mo for ${tiers[0].hours} hours. Hours roll over and never expire, and there is no long-term contract.`,
        ],
      },
      {
        heading: "Opening timeline",
        body: [
          `We are targeting ${site.sanJose.openingLong} for the San Jose location. The waitlist is the fastest way to hear the confirmed date, and waitlist members get founding pricing that will not be offered publicly.`,
          "Until then, our Oakland shop at 950 77th Ave is open, and a number of South Bay members already make the trip for bigger jobs.",
        ],
      },
    ],
    related: [
      { href: "/san-jose/waitlist", label: "Join the San Jose waitlist" },
      { href: "/san-jose/car-lift-rental", label: "Car lift rental in San Jose" },
    ],
  },
  {
    slug: "engine-swap-bay",
    city: "San Jose",
    title: "Engine Swap Bay Rental in San Jose, CA",
    description:
      "Engine swap bays with hoist, transmission jack and long-term parking, coming to San Jose in Q1 2027. Join the waitlist for founding-member pricing.",
    h1: "Engine swap bays coming to San Jose",
    lead: "A lift, an engine hoist, a transmission jack and somewhere to leave the car, all on one site in the South Bay.",
    serviceName: "Engine swap bay rental",
    image: photos.truckOnLift,
    sections: [
      {
        heading: "Built for long jobs",
        body: [
          "An engine or transmission swap is measured in weekends, not hours. The South Bay shop is being planned with that in mind: bays that can hold a car through a multi-week build, hoists and transmission jacks on site, and long-term parking so the project does not have to be trailered home half-finished.",
        ],
      },
      {
        heading: "Equipment planned for the San Jose shop",
        body: [
          "Two-post lifts, engine hoists, transmission jacks, jack stands and the full hand tool inventory, matching the Oakland spec. Fluid disposal and metal recycling included, which on a swap is not a minor convenience. It is the difference between finishing and having a boot full of used coolant.",
        ],
      },
      {
        heading: "Reserve your place",
        body: [
          `Opening is targeted for ${site.sanJose.opening}. If you are planning a build around that timeline, join the waitlist. Founding members get first pick of booking slots, which matters most for exactly this kind of long-running job.`,
        ],
      },
    ],
    related: [
      { href: "/san-jose/waitlist", label: "Join the San Jose waitlist" },
      { href: "/oakland/engine-swap-bay", label: "Engine swap bays in Oakland (open now)" },
    ],
  },
];

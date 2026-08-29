import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { site } from "@/lib/site";
import { MotionProvider } from "@/components/motion/MotionProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Condensed industrial display face — headings and stencil section numbers. */
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/**
 * `metadataBase` is set once here so every page can use relative OG image
 * paths and get absolute URLs in the rendered tags.
 *
 * The title template deliberately avoids the bug on the current site, whose
 * homepage renders `<title>- GaragePass</title>` — an empty title on the
 * single highest-weight ranking signal.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `DIY Auto Shop & Car Lift Rental in Oakland, CA | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description:
    "Rent a car lift by the hour at GaragePass, Oakland's community DIY auto shop. All tools included, hours never expire, no contracts. Memberships from $60/mo.",
  applicationName: site.name,
  authors: [{ name: site.founder }],
  creator: site.founder,
  publisher: site.legalName,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    url: site.url,
    title: `DIY Auto Shop & Car Lift Rental in Oakland, CA | ${site.name}`,
    description:
      "Oakland's community DIY auto shop. Book a lift, use every tool, keep your hours forever. Memberships from $60/mo.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: Oakland's Community DIY Auto Shop`,
    description:
      "Rent a car lift by the hour. All tools included. Hours never expire.",
  },
  category: "automotive",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void text-steel">
        {/*
          Adds `.js-motion` and starts Lenis. Everything stays readable before
          it runs and if it never runs — see globals.css.
        */}
        <MotionProvider />
        {children}
      </body>
    </html>
  );
}

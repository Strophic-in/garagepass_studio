import type { NextConfig } from "next";
import { legacyRedirects } from "./src/lib/routes";

const nextConfig: NextConfig = {
  images: {
    // AVIF first — the current site serves a 789 KB unoptimised JPEG as its
    // LCP element, which is the single largest speed regression on the page.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },

  async redirects() {
    return legacyRedirects.map(({ source, destination }) => ({
      source,
      destination,
      permanent: true, // 301 — passes ranking signal, unlike a 302
    }));
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Static media never changes without a filename change, so let the CDN
        // and the browser hold it for a year. Without this the ~9 MB of video
        // re-downloads on every visit — Next.js only sets long cache headers on
        // its own /_next/static output, not on files served from /public.
        source: "/:dir(images|videos)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

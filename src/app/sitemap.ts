import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { allRoutes } from "@/lib/routes";

/**
 * Generated from the single route registry in `@/lib/routes`, so a new page
 * cannot be added to the nav and then forgotten here.
 *
 * The current garagepass.co has no sitemap at any path and declares none in
 * robots.txt, which leaves discovery entirely to internal-link crawling.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return allRoutes.map((route) => ({
    url: `${site.url}${route.path === "/" ? "" : route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LandingPageBody } from "@/components/sections/LandingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graph, serviceSchema } from "@/components/seo/schema";
import { sanJosePages } from "@/lib/landing-content";
import { site } from "@/lib/site";

/** Statically prerender every San Jose landing page at build time. */
export function generateStaticParams() {
  return sanJosePages.map((p) => ({ slug: p.slug }));
}

/** Anything not in the content registry 404s rather than rendering empty. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/san-jose/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = sanJosePages.find((p) => p.slug === slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/san-jose/${page.slug}` },
    /*
      The image is named explicitly, and it is a JPEG.

      These pages used to point og:image at their own WebP hero, which
      LinkedIn and Facebook do not reliably render — the preview came out
      blank on exactly the surfaces the image exists for. Dropping the field
      does not help either: defining `openGraph` at all in a page replaces the
      parent's object wholesale rather than merging into it, so the image from
      `app/opengraph-image.jpg` never reaches these routes.
    */
    openGraph: {
      title: page.title,
      description: page.description,
      url: `/san-jose/${page.slug}`,
      images: ["/og-default.jpg"],
    },
  };
}

export default async function SanJoseLandingPage({
  params,
}: PageProps<"/san-jose/[slug]">) {
  const { slug } = await params;
  const page = sanJosePages.find((p) => p.slug === slug);
  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={graph(
          serviceSchema({
            name: page.serviceName,
            description: page.description,
            path: `/san-jose/${page.slug}`,
            areaServed: site.sanJose.areaServed,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "San Jose", path: "/san-jose" },
            { name: page.serviceName, path: `/san-jose/${page.slug}` },
          ]),
        )}
      />
      <Header />
      <LandingPageBody page={page} />
      <Footer />
    </>
  );
}

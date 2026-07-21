import type { Metadata } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site";

type BuildMetadataInput = {
  description?: string;
  imagePath?: string;
  path?: string;
  title: string;
};

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  imagePath = "/opengraph-image",
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const image = absoluteUrl(imagePath);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.defaultLocale,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} | ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

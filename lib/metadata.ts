import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/types";
import { isLocalizedPublicPath, localizedPath } from "@/lib/i18n/routing";

import { absoluteUrl, siteConfig } from "@/lib/site";

type BuildMetadataInput = {
  description?: string;
  imagePath?: string;
  path?: string;
  title: string;
  locale?: Locale;
};

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  imagePath = "/opengraph-image",
  locale = "ro",
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(localizedPath(path, locale));
  const image = absoluteUrl(imagePath);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...(isLocalizedPublicPath(path) ? { languages: {
        ro: absoluteUrl(localizedPath(path, "ro")),
        en: absoluteUrl(localizedPath(path, "en")),
        "x-default": absoluteUrl(localizedPath(path, "ro")),
      } } : {}),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: { ro: "ro_RO", en: "en_GB", uk: "uk_UA" }[locale],
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

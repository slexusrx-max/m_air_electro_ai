import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#edf5e9",
    theme_color: "#edf5e9",
    categories: ["business", "productivity", "utilities"],
    icons: [
      {
        src: "/manifest-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/maskable-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}

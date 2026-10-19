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
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}

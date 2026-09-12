import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { calculatorItems } from "@/lib/site-navigation";
import { catalog, marketplaceCategories } from "@/lib/affiliate/catalog";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...new Set([
      "/",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
      "/affiliate-disclosure",
      "/marketplace",
      "/marketplace/find-my-solution",
      "/backup-calculator",
      "/calculators",
      "/knowledge-base",
      ...calculatorItems.map((x) => x.href),
      ...marketplaceCategories.map((x) => "/marketplace/category/" + x.slug),
      ...catalog.map((x) => "/marketplace/products/" + x.slug),
    ]),
  ].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}

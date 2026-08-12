import type { MetadataRoute } from "next";

import { expertProfiles } from "@/lib/experts";
import { knowledgeArticles } from "@/lib/knowledge-base";
import { absoluteUrl } from "@/lib/site";
import { calculatorItems, footerNavGroups, siteNavItems } from "@/lib/site-navigation";
import { catalog, marketplaceCategories } from "@/lib/affiliate/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/about",
    "/assistant",
    "/contact",
    "/diagnostics",
    "/documents",
    "/experts",
    "/knowledge-base",
    "/marketplace",
    "/marketplace/find-my-solution",
    "/privacy",
    "/sign-in",
    "/terms",
    ...siteNavItems.map((item) => item.href),
    ...calculatorItems.map((item) => item.href),
    ...footerNavGroups.flatMap((group) => group.items.map((item) => item.href)),
    ...expertProfiles.map((profile) => `/experts/${profile.slug}`),
    ...knowledgeArticles.map((article) => `/knowledge-base/${article.slug}`),
    ...marketplaceCategories.map((category) => `/marketplace/category/${category.slug}`),
    ...catalog.map((product) => `/marketplace/products/${product.slug}`),
  ];

  return [...new Set(staticRoutes)].map((route) => ({
    url: absoluteUrl(route),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/calculators/") ? 0.9 : 0.7,
  }));
}

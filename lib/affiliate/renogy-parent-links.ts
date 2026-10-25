import { renogyFeedProducts } from "../../data/renogy-extra-feed-products";

// Existing issued ad; provenance: docs/renogy-catalog-release-2026-10-20.md.
// Parent destinations deliberately carry no selected SKU or variant.
export const renogyParentLinks: Record<string, string> = Object.fromEntries(
  renogyFeedProducts.map(({ url }) => {
    const destination = new URL(url);
    if (destination.origin !== "https://eu.renogy.com" || destination.search || destination.hash ||
      destination.username || destination.password || !/^\/products\/[a-z0-9-]+$/.test(destination.pathname)) {
      throw new Error("Unsupported Renogy parent destination");
    }
    const link = new URL("https://renogy.sjv.io/c/7767803/3394229/14864");
    link.searchParams.set("u", url);
    return [url, link.href];
  }),
);

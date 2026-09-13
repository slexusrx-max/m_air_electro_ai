import "server-only";
import { catalog } from "@/lib/affiliate/catalog";
import { resolveSupplierLink } from "@/lib/affiliate/tracking";
import type { AffiliateProvider } from "@/lib/affiliate/types";
export const renogyEu: AffiliateProvider = {
  id: "renogy",
  region: "EU",
  baseUrl: "https://eu.renogy.com/",
  trackingEnvironmentVariable: "RENOGY_IMPACT_LINKS_JSON",
  buildAffiliateUrl: (productUrl) => renogyLink(productUrl).href,
  disclosure:
    "Ordinary supplier links until an approved relationship is activated.",
};
export function renogyLink(productUrl: string) {
  let mappings: Record<string, string> = {};
  try {
    mappings = JSON.parse(process.env.RENOGY_IMPACT_LINKS_JSON ?? "{}");
  } catch {
    /* Fail closed to ordinary supplier URL. */
  }
  return resolveSupplierLink(
    productUrl,
    typeof mappings?.[productUrl] === "string"
      ? mappings[productUrl]
      : undefined,
    process.env.RENOGY_AFFILIATE_APPROVED === "true" &&
      process.env.AFFILIATE_TRACKING_ENABLED === "true",
  );
}

export function affiliateTrackingActive() {
  return catalog.some(
    (product) =>
      product.provider === "renogy" && renogyLink(product.productUrl).tracked,
  );
}

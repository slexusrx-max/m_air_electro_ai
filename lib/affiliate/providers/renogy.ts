import "server-only";
import { catalog } from "@/lib/affiliate/catalog";
import { configuredSupplierLink, parseApprovedLinks, type AffiliateConfiguration } from "@/lib/affiliate/configuration";
import type { AffiliateProvider } from "@/lib/affiliate/types";
import { assertSupplierUrl } from "../suppliers";
import { renogyProgram, verifiedImpactLinks } from "../renogy-policy";
export const renogyEu: AffiliateProvider = {
  id: "renogy",
  region: "EU",
  baseUrl: "https://eu.renogy.com/",
  trackingEnvironmentVariable: "RENOGY_IMPACT_LINKS_JSON",
  buildAffiliateUrl: (productUrl) => renogyLink(productUrl).href,
  disclosure:
    "Independent Renogy affiliate partner. Unmarked supplier links remain ordinary; marked links may earn commission only after verified Impact activation.",
};
export function renogyConfiguration(): AffiliateConfiguration {
  return {
    provider: "renogy", network: "impact",
    programId: renogyProgram.programId,
    approved: renogyProgram.approved,
    trackingEnabled: process.env.AFFILIATE_TRACKING_ENABLED === "true"
      && process.env.RENOGY_AFFILIATE_APPROVED === "true"
      && process.env.RENOGY_IMPACT_EU_VERIFIED === "true"
      && (!process.env.RENOGY_IMPACT_PROGRAM_ID || process.env.RENOGY_IMPACT_PROGRAM_ID === renogyProgram.programId),
    affiliateDisclosureRequired: true,
    links: verifiedImpactLinks(parseApprovedLinks(process.env.RENOGY_IMPACT_LINKS_JSON), process.env.RENOGY_IMPACT_VERIFIED_ORIGINS_JSON),
  };
}
export function renogyLink(productUrl: string) {
  assertSupplierUrl("renogy", productUrl);
  return configuredSupplierLink(renogyConfiguration(), productUrl);
}

export function affiliateTrackingActive() {
  return catalog.some(
    (product) =>
      product.provider === "renogy" && renogyLink(product.productUrl).tracked,
  );
}

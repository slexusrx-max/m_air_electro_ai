import { configuredSupplierLink } from "../configuration";
import { assertSupplierUrl, type SupplierId } from "../suppliers";

export type PendingSupplierId = Exclude<SupplierId, "renogy" | "waterdrop-eu">;

/** No approval or network-issued links exist yet. Global Renogy flags cannot activate these. */
export function pendingSupplierLink(provider: PendingSupplierId, productUrl: string) {
  assertSupplierUrl(provider, productUrl);
  return configuredSupplierLink({
    provider, network: "unconfirmed", programId: null, approved: false,
    trackingEnabled: false, affiliateDisclosureRequired: true, links: {},
  }, productUrl);
}

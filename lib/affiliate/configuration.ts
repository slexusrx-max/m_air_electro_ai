import { resolveSupplierLink } from "./tracking";

export type AffiliateConfiguration = {
  provider: string;
  network: string;
  programId: string | null;
  approved: boolean;
  trackingEnabled: boolean;
  affiliateDisclosureRequired: boolean;
  links: Record<string, string>;
};

/** Exact network-issued links only; no guessed tracking-base URL or identifiers. */
export function parseApprovedLinks(value: string | undefined): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(value ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
  } catch { return {}; }
}

export function configuredSupplierLink(config: AffiliateConfiguration, ordinarySupplierUrl: string) {
  const candidate = Object.hasOwn(config.links, ordinarySupplierUrl) ? config.links[ordinarySupplierUrl] : undefined;
  const resolved = resolveSupplierLink(ordinarySupplierUrl, candidate,
    config.approved && config.trackingEnabled && config.affiliateDisclosureRequired);
  return {
    ...resolved,
    ordinarySupplierUrl,
    affiliateUrl: resolved.tracked ? resolved.href : null,
    provider: config.provider,
    network: config.network,
    programId: config.programId,
    approvalStatus: config.approved ? "approved" as const : "unconfirmed" as const,
    trackingStatus: resolved.tracked ? "active" as const : "ordinary" as const,
    affiliateDisclosureRequired: resolved.tracked,
  };
}

import type { CatalogProduct } from "./types";
import waterdropReviewedExpansion from "@/data/waterdrop-reviewed-expansion.json";

export const SUPPLIER_PRICE_MAX_AGE_MS = 48 * 60 * 60 * 1000;

export type PriceFeedProvider = "renogy" | "waterdrop-eu";

export type PublicSupplierPrice = {
  amount: number;
  currency: "EUR";
  provider: PriceFeedProvider;
  merchantSku: string;
  retrievedAt: string;
};

export type SupplierPriceSnapshot = {
  provider: PriceFeedProvider;
  catalogId: string;
  retrievedAt: string;
  records: Array<{
    merchantSku: string;
    amount: number;
    currency: string;
  }>;
};

const catalogIds: Record<PriceFeedProvider, string> = {
  renogy: "28907",
  "waterdrop-eu": "18289",
};

const waterdropSkus: Record<string, string> = {
  "waterdrop-g3p800": "44431201206588",
  "waterdrop-g3p600": "45120409829692",
  "waterdrop-x12": "50113185153340",
  ...Object.fromEntries(waterdropReviewedExpansion.map(record => [record.id, record.sku])),
};

// Exact advertiser-feed variants documented in product photo provenance. These
// three canonical product URLs do not carry their selected variant in the query.
const renogySkusWithoutUrlVariant: Record<string, string> = {
  "renogy-panel-200": "46435567796481",
  "renogy-inverter-1000": "46435546628353",
  "mppt-charge-controller": "46435557474561",
};

export function productFeedIdentity(product: CatalogProduct): {
  provider: PriceFeedProvider;
  merchantSku: string;
} | null {
  if (product.provider === "renogy") {
    try {
      const merchantSku = new URL(product.productUrl).searchParams.get("variant") ??
        renogySkusWithoutUrlVariant[product.id];
      return merchantSku && /^\d+$/.test(merchantSku)
        ? { provider: "renogy", merchantSku }
        : null;
    } catch {
      return null;
    }
  }
  if (product.provider === "waterdrop-eu") {
    const merchantSku = waterdropSkus[product.id];
    return merchantSku ? { provider: "waterdrop-eu", merchantSku } : null;
  }
  return null;
}

export function isFreshPriceTimestamp(
  retrievedAt: string,
  now = Date.now(),
): boolean {
  const timestamp = Date.parse(retrievedAt);
  return Number.isFinite(timestamp) && timestamp <= now + 5 * 60 * 1000 &&
    now - timestamp <= SUPPLIER_PRICE_MAX_AGE_MS;
}

export function pricesFromSnapshots(
  products: CatalogProduct[],
  snapshots: SupplierPriceSnapshot[],
  now = Date.now(),
): Record<string, PublicSupplierPrice> {
  const result: Record<string, PublicSupplierPrice> = {};
  for (const snapshot of snapshots) {
    if ((snapshot.provider !== "renogy" && snapshot.provider !== "waterdrop-eu") ||
      !Array.isArray(snapshot.records) ||
      snapshot.catalogId !== catalogIds[snapshot.provider] ||
      !isFreshPriceTimestamp(snapshot.retrievedAt, now)) continue;

    const recordsBySku = new Map<string, SupplierPriceSnapshot["records"]>();
    for (const record of snapshot.records) {
      if (!record || typeof record.merchantSku !== "string") continue;
      const records = recordsBySku.get(record.merchantSku) ?? [];
      records.push(record);
      recordsBySku.set(record.merchantSku, records);
    }

    for (const product of products) {
      const identity = productFeedIdentity(product);
      if (!identity || identity.provider !== snapshot.provider) continue;
      const matches = recordsBySku.get(identity.merchantSku);
      if (matches?.length !== 1) continue;
      const match = matches[0];
      if (match.currency !== "EUR" || !Number.isFinite(match.amount) || match.amount <= 0) continue;
      result[product.id] = {
        amount: Math.round(match.amount * 100) / 100,
        currency: "EUR",
        provider: identity.provider,
        merchantSku: identity.merchantSku,
        retrievedAt: snapshot.retrievedAt,
      };
    }
  }
  return result;
}

export function pricesBySkuFromSnapshots(
  snapshots: SupplierPriceSnapshot[],
  provider: PriceFeedProvider,
  now = Date.now(),
): Record<string, PublicSupplierPrice> {
  const result: Record<string, PublicSupplierPrice> = {};
  for (const snapshot of snapshots) {
    if (snapshot.provider !== provider || snapshot.catalogId !== catalogIds[provider] ||
      !Array.isArray(snapshot.records) || !isFreshPriceTimestamp(snapshot.retrievedAt, now)) continue;
    const counts = new Map<string, number>();
    for (const record of snapshot.records) counts.set(record.merchantSku, (counts.get(record.merchantSku) ?? 0) + 1);
    for (const record of snapshot.records) {
      if (counts.get(record.merchantSku) !== 1 || record.currency !== "EUR" ||
        !/^\d+$/.test(record.merchantSku) || !Number.isFinite(record.amount) || record.amount <= 0) continue;
      result[record.merchantSku] = {
        amount: Math.round(record.amount * 100) / 100,
        currency: "EUR",
        provider,
        merchantSku: record.merchantSku,
        retrievedAt: snapshot.retrievedAt,
      };
    }
  }
  return result;
}


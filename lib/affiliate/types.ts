export type MarketplaceRegion = "RO" | "EU" | "US" | "UK";
export type ProductCategory =
  | "solar-panels"
  | "lithium-batteries"
  | "inverters"
  | "backup-power"
  | "solar-kits"
  | "charge-controllers"
  | "battery-chargers"
  | "electrical-accessories"
  | "industrial-electrical"
  | "marine-electrical";
export type ProviderId = "renogy" | "amazon" | "ebay" | "other";
export type CatalogProduct = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: ProductCategory;
  description: string;
  kind: "product" | "class";
  provider: ProviderId;
  productUrl: string;
  technicalSpecs: Record<string, string>;
  featured: boolean;
  lastUpdated: string;
  recommendedFor: string[];
  compatibilityNotes: string;
  whyRecommended: string;
  advantages: string;
  merchantRegion: MarketplaceRegion;
  en?: Partial<Omit<CatalogProduct, "en">>;
};
export interface AffiliateProvider {
  id: ProviderId;
  region: MarketplaceRegion;
  baseUrl: string;
  trackingEnvironmentVariable?: string;
  buildAffiliateUrl(productUrl: string): string;
  disclosure: string;
}

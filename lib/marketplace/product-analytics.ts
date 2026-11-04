import type { CatalogProduct } from "@/lib/affiliate/types";
import { productFeedIdentity } from "@/lib/affiliate/pricing";

/** Public editorial identity only; a feed SKU is not a manufacturer part number. */
export function productAnalyticsContext(product: CatalogProduct) {
  const identity = product.kind === "product" ? productFeedIdentity(product) : null;
  return {
    kind: product.kind,
    supplier: product.provider,
    category: product.category,
    ...(product.kind === "product" ? { brand: product.brand } : {}),
    ...(identity ? { sku: identity.merchantSku } : {}),
  };
}

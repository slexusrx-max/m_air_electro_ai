import "server-only";
import { amazon } from "./amazon";
import { ebay } from "./ebay";
import { renogyEu, renogyLink } from "./renogy";
import { resolveSupplierLink } from "../tracking";
import type { CatalogProduct } from "../types";
export { amazon, ebay, renogyEu };
export function supplierLink(
  product: Pick<CatalogProduct, "provider" | "productUrl">,
) {
  if (product.provider === "renogy") return renogyLink(product.productUrl);
  const provider =
    product.provider === "amazon"
      ? amazon
      : product.provider === "ebay"
        ? ebay
        : null;
  const url = provider?.buildAffiliateUrl(product.productUrl);
  return resolveSupplierLink(
    product.productUrl,
    url,
    url !== product.productUrl,
  );
}

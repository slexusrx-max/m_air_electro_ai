import "server-only";
import { amazon } from "./amazon";
import { ebay } from "./ebay";
import { renogyEu, renogyLink } from "./renogy";
import { waterdropEu, waterdropLink } from "./waterdrop";
import { resolveSupplierLink } from "../tracking";
import type { CatalogProduct } from "../types";
import { pendingSupplierLink } from "./pending";
import { isSupplierId } from "../suppliers";
export { amazon, ebay, renogyEu, waterdropEu };
export function supplierLink(
  product: Pick<CatalogProduct, "provider" | "productUrl">,
) {
  if (product.provider === "renogy") return renogyLink(product.productUrl);
  if (product.provider === "waterdrop-eu") return waterdropLink(product.productUrl);
  if (isSupplierId(product.provider)) return pendingSupplierLink(product.provider, product.productUrl);
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

import type { Equipment } from "./catalog-data";
import { comparisonGroup } from "./comparison";
import { isCatalogListing } from "./product-presentation";

// Same-role suggestions are alternatives, not an installation compatibility claim.
export function productAlternatives(product: Equipment, products: Equipment[]) {
  return products.filter(candidate =>
    candidate.kind === "product" && isCatalogListing(candidate) &&
    candidate.id !== product.id && candidate.availability !== "unavailable" &&
    comparisonGroup(candidate) === comparisonGroup(product) &&
    (product.category !== "water" || !product.technicalSpecs.Installation ||
      product.technicalSpecs.Installation === "Check manual" ||
      candidate.technicalSpecs.Installation === product.technicalSpecs.Installation)
  ).slice(0, 3);
}


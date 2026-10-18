import type { CatalogProduct } from "../affiliate/types";
import { categoryPhoto } from "./category-photos";

export function isCatalogListing(product: Pick<CatalogProduct, "id">) {
  return product.id !== "battery-lfp-100";
}

// Category artwork is not evidence of a named model's appearance.
export function categoryImagePath(category: string): string | null {
  return categoryPhoto(category)?.src ?? null;
}

import type { CatalogProduct } from "../affiliate/types";

export function isCatalogListing(product: Pick<CatalogProduct, "id">) {
  return product.id !== "battery-lfp-100";
}

// Category artwork is not evidence of a named model's appearance.
export function categoryImagePath(category: string): string | null {
  if (category === "water") return null;
  if (category.includes("batter")) return "/equipment/lifepo4-battery-studio.png";
  if (category.includes("inverter")) return "/equipment/hybrid-inverter-studio.png";
  if (category.includes("backup")) return "/equipment/portable-power-studio.png";
  if (category.includes("solar")) return "/equipment/solar-panel-studio.png";
  return null;
}

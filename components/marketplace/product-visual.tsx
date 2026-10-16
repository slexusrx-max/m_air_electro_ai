import type { CatalogProduct } from "@/lib/affiliate/types";
import { EquipmentVisual } from "./equipment-visual";

export function ProductVisual({ product, ro }: { product: CatalogProduct; ro: boolean }) {
  if (product.kind === "equipment-class") return <EquipmentVisual category={product.category} />;
  // No exact-variant, licensed model photos are currently recorded in the catalog.
  return <div className="equipment-visual product-photo-pending" data-product-photo={product.id}>
    <span>{ro ? "Fotografie în curs de confirmare" : "Photo pending verification"}</span>
  </div>;
}

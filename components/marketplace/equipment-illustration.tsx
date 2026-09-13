import type { ProductCategory } from "@/lib/affiliate/types";
import { EquipmentVisual } from "./equipment-visual";

/** Compatibility entry point for the shared category artwork. */
export function EquipmentIllustration({ category }: { category: ProductCategory }) {
  return <EquipmentVisual category={category} />;
}

import type { Equipment } from "./catalog-data";
import { parseComparison } from "./query";

export const comparisonLabels: Record<string, [string, string]> = {
  "lithium-batteries": ["Batteries", "Baterii"], "solar-panels": ["Solar panels", "Panouri solare"],
  inverters: ["Inverters", "Invertoare"], chargers: ["Chargers", "Încărcătoare"],
  "backup-power": ["Portable power stations", "Stații portabile"], water: ["Water systems", "Sisteme de apă"],
  "electrical-accessories": ["Electrical accessories", "Accesorii electrice"],
  "charge-controllers": ["Solar charge controllers", "Regulatoare solare"],
  "solar-kits": ["Solar kits", "Kituri solare"], "battery-chargers": ["Battery chargers", "Încărcătoare de baterii"],
  "dc-backup": ["Low-voltage DC backup supplies", "Surse de rezervă DC de joasă tensiune"],
  "expansion-batteries": ["Station expansion batteries", "Baterii de extensie pentru stații"],
};

// Roles explicitly documented in data/pecron-reviewed-expansion.json.
// Comparison groups do not change catalogue categories or infer specifications.
const roleGroups: Record<string, string> = {
  "pecron-d77": "dc-backup", "pecron-d39": "dc-backup",
  "pecron-ep3800-48v": "expansion-batteries",
  "pecron-ep3000-48v": "expansion-batteries",
  "pecron-ep2000s-48v": "expansion-batteries",
};
export function comparisonGroup(product: Pick<Equipment, "id" | "category">) {
  return roleGroups[product.id] ?? product.category;
}

export function comparableSelection(ids: string, products: Equipment[]) {
  const selected = parseComparison(ids, products);
  const invalid = selected.some(p => p.kind !== "product") || new Set(selected.map(comparisonGroup)).size > 1;
  return { selected: invalid ? [] : selected, invalid };
}

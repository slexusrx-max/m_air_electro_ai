import type { Equipment } from "./catalog-data";
import { parseComparison } from "./query";

export const comparisonLabels: Record<string, [string, string]> = {
  "lithium-batteries": ["Batteries", "Baterii"], "solar-panels": ["Solar panels", "Panouri solare"],
  inverters: ["Inverters", "Invertoare"], chargers: ["Chargers", "Încărcătoare"],
  "backup-power": ["Portable power stations", "Stații portabile"], water: ["Water systems", "Sisteme de apă"],
  "electrical-accessories": ["Electrical accessories", "Accesorii electrice"],
  "charge-controllers": ["Solar charge controllers", "Regulatoare solare"],
  "solar-kits": ["Solar kits", "Kituri solare"], "battery-chargers": ["Battery chargers", "Încărcătoare de baterii"],
};

export function comparableSelection(ids: string, products: Equipment[]) {
  const selected = parseComparison(ids, products);
  const invalid = selected.some(p => p.kind !== "product") || new Set(selected.map(p => p.category)).size > 1;
  return { selected: invalid ? [] : selected, invalid };
}

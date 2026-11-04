import type { CatalogProduct } from "@/lib/affiliate/types";

const priorities: Partial<Record<CatalogProduct["category"], string[]>> = {
  "lithium-batteries": ["Nominal voltage", "Capacity", "Stored energy", "Stored energy (V × Ah)", "Continuous discharge", "Maximum discharge", "Chemistry", "Weight"],
  "solar-panels": ["Rated power (STC)", "Rated panel power", "Manufacturer-rated power", "Open-circuit voltage (STC)", "Weight", "Format"],
  inverters: ["Continuous output", "DC input class", "Rated AC output", "Waveform", "Peak output", "Weight"],
  "backup-power": ["Stored energy", "Continuous output", "Rated AC output", "Manufacturer-rated AC output", "Peak output", "Weight"],
  "solar-kits": ["Total panel power", "Stored energy", "Continuous output", "Panel count", "Controller model"],
  "charge-controllers": ["Charge current class", "Maximum PV voltage", "Battery voltage class", "PV power limit", "Solar control"],
  chargers: ["Charge current class", "Battery voltage class", "Sources", "Solar control"],
  "battery-chargers": ["Charge current class", "Battery voltage class", "Sources"],
  water: ["Technology", "Nominal production", "Installation", "Purified water to drain"],
};
const identifiers = new Set(["SKU", "Feed SKU", "Variant ID"]);

/** Prioritize documented decision fields; never derive missing values from model names. */
export function cardSpecifications(product: Pick<CatalogProduct, "category" | "technicalSpecs">) {
  const entries = Object.entries(product.technicalSpecs).filter(([key, value]) => !identifiers.has(key) && value.trim());
  const order = priorities[product.category] ?? [];
  return entries.sort(([a], [b]) => {
    const first = order.indexOf(a);
    const second = order.indexOf(b);
    return (first < 0 ? order.length : first) - (second < 0 ? order.length : second);
  }).slice(0, 3);
}

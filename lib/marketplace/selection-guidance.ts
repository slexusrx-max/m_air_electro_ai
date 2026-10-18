import type { Equipment } from "./catalog-data";
import { estimateSystem, matchingSystemCandidates } from "./recommendation";

// Editorial examples, not customer cases, measured loads or preassembled kits.
export const starterScenarios = [
  { id: "essentials", application: "apartment-backup", load: 75, peak: 100, hours: 4,
    title: { en: "Router, laptop and lights", ro: "Router, laptop și lumină" },
    loads: { en: "Router 18 W + laptop 45 W + lights 12 W", ro: "Router 18 W + laptop 45 W + lumină 12 W" },
    limit: { en: "No heating or motor loads; this is not a UPS guarantee.", ro: "Fără încălzire sau motoare; nu reprezintă o garanție UPS." } },
  { id: "home", application: "home-backup", load: 200, peak: 300, hours: 4,
    title: { en: "A few home essentials", ro: "Câțiva consumatori esențiali acasă" },
    loads: { en: "Laptop 60 W + router 20 W + lights 20 W + TV 100 W", ro: "Laptop 60 W + router 20 W + lumină 20 W + TV 100 W" },
    limit: { en: "Excludes cooking, heating, refrigeration and fixed house wiring.", ro: "Exclude gătitul, încălzirea, frigiderul și instalația fixă a casei." } },
  { id: "camping", application: "rv-caravan", load: 100, peak: 200, hours: 6,
    title: { en: "Camping or RV plug-in devices", ro: "Aparate la priză în camping sau rulotă" },
    loads: { en: "Laptop 60 W + lights 20 W + USB chargers 20 W", ro: "Laptop 60 W + lumină 20 W + încărcătoare USB 20 W" },
    limit: { en: "No fridge, air conditioning or vehicle installation; solar input is not assumed.", ro: "Fără frigider, aer condiționat sau instalația vehiculului; fără aport solar presupus." } },
] as const;

export function scenarioUrl(s: typeof starterScenarios[number]) {
  return `/marketplace/find-my-solution?${new URLSearchParams({ application: s.application, load: String(s.load), peak: String(s.peak), hours: String(s.hours), region: "EU" })}`;
}

/** Compare complete stations with complete stations, ranked by capacity, never commission. */
export function stationCandidates(products: Equipment[], region: string, requirements: NonNullable<ReturnType<typeof estimateSystem>>) {
  return matchingSystemCandidates(products, ["backup-power"], region, requirements)
    .filter(p => p.kind === "product" && p.category === "backup-power")
    .sort((a, b) => Number(a.facets.capacityWh) - Number(b.facets.capacityWh) || Number(a.facets.power) - Number(b.facets.power) || a.id.localeCompare(b.id))
    .slice(0, 4);
}

/** Capacity screening only; no implicit series/parallel wiring or BMS compatibility. */
export function batteryCandidates(products: Equipment[], minimumWh: number, voltage: number) {
  if (!Number.isFinite(minimumWh) || minimumWh <= 0 || !Number.isFinite(voltage) || voltage <= 0) return [];
  return products.filter(p => p.kind === "product" && p.category === "lithium-batteries" &&
    Number(p.facets.capacityWh) >= minimumWh && Number(p.facets.voltage) === voltage)
    .sort((a, b) => Number(a.facets.capacityWh) - Number(b.facets.capacityWh)).slice(0, 4);
}

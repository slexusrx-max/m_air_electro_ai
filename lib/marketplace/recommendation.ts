import { calculatePlan } from "@/lib/marketplace/planning";
import type { Equipment } from "@/lib/marketplace/catalog-data";
/** Preserve the tested planner as the single source of sizing assumptions. */
export function estimateSystem(load: number, peak: number, hours: number) {
  try {
    const p = calculatePlan({
      load,
      peak,
      hours,
      solar: false,
      application: "home",
    });
    return {
      batteryWh: Math.ceil(p.nominalWh / 100) * 100,
      loadWh: p.energyWh,
      inverterW: p.continuousW,
      surgeW: p.surgeW,
    };
  } catch {
    return null;
  }
}

export function matchingSystemCandidates(
  products: Equipment[],
  paths: string[],
  region: string,
  requirements: NonNullable<ReturnType<typeof estimateSystem>>,
) {
  if (region !== "EU") return [];
  return products.filter(product => {
    if (!product.paths.some(path => paths.includes(path))) return false;
    if (product.kind === "equipment-class") return true;
    const enough = (field: string, required: number) =>
      !product.facets[field] || Number(product.facets[field]) >= required;
    return enough("capacityWh", requirements.batteryWh) &&
      (product.category !== "inverters" ||
        (enough("power", requirements.inverterW) && enough("surgePower", requirements.surgeW)));
  });
}

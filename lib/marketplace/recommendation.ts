import { calculatePlan } from "@/lib/marketplace/planning";
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

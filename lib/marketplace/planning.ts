import type { ProductCategory } from "@/lib/affiliate/types";
export type PlanningInput = {
  load: number;
  peak: number;
  hours: number;
  solar: boolean;
  application: string;
};
export type Appliance = {
  id: string;
  name: string;
  watts: number;
  quantity: number;
  hours: number;
  surge: number;
  enabled: boolean;
};
function range(value: number, min: number, max: number) {
  return Number.isFinite(value) && value >= min && value <= max;
}
export function calculatePlan(input: PlanningInput) {
  if (
    !range(input.load, 1, 100000) ||
    !range(input.peak, input.load, 1000000) ||
    !range(input.hours, 0.1, 168)
  )
    throw new Error("invalid-plan");
  const energyWh = input.load * input.hours;
  const nominalWh = energyWh / (0.8 * 0.92);
  const continuousW = Math.ceil((input.load * 1.25) / 100) * 100;
  const surgeW = Math.max(
    continuousW,
    Math.ceil((input.peak * 1.1) / 100) * 100,
  );
  const solarW = input.solar
    ? Math.ceil(energyWh / 0.92 / 3.5 / 0.8 / 100) * 100
    : null;
  const categories: ProductCategory[] = [
    "lithium-batteries",
    "inverters",
    "electrical-accessories",
  ];
  if (input.solar) categories.push("solar-panels", "charge-controllers");
  else categories.push("backup-power");
  if (input.application === "rv" || input.application === "boat")
    categories.push("battery-chargers");
  return { energyWh, nominalWh, continuousW, surgeW, solarW, categories };
}
export function calculateAppliances(
  loads: Appliance[],
  hours: number,
  dod: number,
  efficiency: number,
) {
  if (
    !range(hours, 0.1, 168) ||
    !range(dod, 1, 99) ||
    !range(efficiency, 1, 100)
  )
    throw new Error("invalid-settings");
  const enabled = loads.filter((x) => x.enabled);
  if (!enabled.length) throw new Error("empty-loads");
  if (
    enabled.some(
      (x) =>
        !x.name.trim() ||
        !range(x.watts, 1, 100000) ||
        !range(x.quantity, 1, 100) ||
        !Number.isInteger(x.quantity) ||
        !range(x.hours, 0.1, 168) ||
        !range(x.surge, 1, 10),
    )
  )
    throw new Error("invalid-load");
  const continuousW = enabled.reduce((n, x) => n + x.watts * x.quantity, 0);
  if (continuousW > 100000) throw new Error("invalid-total");
  const peakW = enabled.reduce((n, x) => n + x.watts * x.quantity * x.surge, 0);
  const energyWh = enabled.reduce(
    (n, x) => n + x.watts * x.quantity * Math.min(hours, x.hours),
    0,
  );
  const usableWh = energyWh / (efficiency / 100),
    nominalWh = usableWh / (dod / 100);
  const inverterW = Math.ceil((continuousW * 1.25) / 100) * 100,
    surgeW = Math.max(inverterW, Math.ceil((peakW * 1.1) / 100) * 100);
  return {
    continuousW,
    peakW,
    energyWh,
    usableWh,
    nominalWh,
    inverterW,
    surgeW,
  };
}
export function requiredBatteryKwh(nominalWh: number) {
  return Math.ceil(nominalWh / 10) / 100;
}
export function requirementsUrl(
  nominalWh: number,
  continuousW: number,
  surgeW: number,
  region = "RO",
) {
  const q = new URLSearchParams({
    batteryKwh: requiredBatteryKwh(nominalWh).toFixed(2),
    inverterKw: (continuousW / 1000).toFixed(2),
    surgeKw: (surgeW / 1000).toFixed(2),
    region,
  });
  return "/marketplace?" + q.toString();
}

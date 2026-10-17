// Editorial examples, not measured appliance data or product performance claims.
export type ExampleLoad = { en: string; ro: string; watts: number; hours: number; circuit: "AC" | "DC" };
export const energyExamples: Record<string, ExampleLoad[]> = {
  apartment: [
    { en: "Router + optical terminal", ro: "Router + terminal optic", watts: 18, hours: 4, circuit: "AC" },
    { en: "Laptop", ro: "Laptop", watts: 45, hours: 4, circuit: "AC" },
    { en: "LED lighting", ro: "Iluminat LED", watts: 12, hours: 3, circuit: "AC" },
  ],
  rv: [
    { en: "DC refrigerator, total compressor running time", ro: "Frigider DC, timpul total de funcționare al compresorului", watts: 45, hours: 8, circuit: "DC" },
    { en: "DC lights", ro: "Lumini DC", watts: 12, hours: 5, circuit: "DC" },
    { en: "DC water pump", ro: "Pompă de apă DC", watts: 60, hours: 0.25, circuit: "DC" },
    { en: "Laptop through inverter", ro: "Laptop prin invertor", watts: 60, hours: 3, circuit: "AC" },
  ],
};
export function exampleEnergy(loads: ExampleLoad[], usable = 0.8, efficiency = 0.92) {
  if (!(usable > 0 && usable <= 1 && efficiency > 0 && efficiency <= 1) || loads.some(l => !Number.isFinite(l.watts) || !Number.isFinite(l.hours) || l.watts < 0 || l.hours < 0)) throw new RangeError("Invalid energy inputs");
  const ac = loads.filter(l => l.circuit === "AC").reduce((sum, l) => sum + l.watts * l.hours, 0);
  const dc = loads.filter(l => l.circuit === "DC").reduce((sum, l) => sum + l.watts * l.hours, 0);
  return { ac, dc, loadWh: ac + dc, nominalWh: (dc + ac / efficiency) / usable };
}

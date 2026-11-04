import type { Equipment } from "./catalog-data";
import { comparisonGroup } from "./comparison";
import { specificationLabel, specificationValue } from "./specifications";

type Definition = {
  id: string; label: [string, string]; keys: string[];
  facet?: [string, string]; unit?: RegExp; stc?: boolean;
};
export type ComparisonSpecification = { id: string; label: string; values: (string | null)[] };
const energy: Definition = { id: "energy", label: ["Stored energy", "Energie stocată"], keys: ["Stored energy", "Stored energy (V × Ah)"], facet: ["capacityWh", "Wh"] };
const weight: Definition = { id: "weight", label: ["Weight", "Masă"], keys: ["Weight"] };
const dimensions: Definition = { id: "dimensions", label: ["Dimensions", "Dimensiuni"], keys: ["Dimensions"] };
const chemistry: Definition = { id: "chemistry", label: ["Battery chemistry", "Chimia bateriei"], keys: ["Chemistry"], facet: ["chemistry", ""] };
const capacity: Definition = { id: "capacity", label: ["Battery capacity (Ah)", "Capacitate baterie (Ah)"], keys: ["Capacity"], facet: ["capacityAh", "Ah"] };
const continuous: Definition = { id: "continuous-output", label: ["Continuous AC output", "Putere AC continuă"], keys: ["Continuous output", "Rated AC output", "Manufacturer-rated AC output"], unit: /\bW\b/ };
const surge: Definition = { id: "surge-output", label: ["Peak / surge output", "Putere de vârf / pornire"], keys: ["Peak output", "Surge output"] };
const nominalVoltage: Definition = { id: "nominal-voltage", label: ["Nominal battery voltage", "Tensiune nominală baterie"], keys: ["Nominal voltage"] };
const voltageClass: Definition = { id: "voltage-class", label: ["Battery voltage class", "Clasă de tensiune baterie"], keys: ["Voltage class", "Battery voltage class"], facet: ["voltage", "V"] };
const panelPower: Definition = { id: "panel-power", label: ["Rated panel power", "Putere nominală panou"], keys: ["Rated power (STC)", "Rated panel power", "Manufacturer-rated power"], stc: true };
const cycleLife: Definition = { id: "cycle-life", label: ["Documented cycle life", "Durată de viață în cicluri documentată"], keys: ["Cycle life"] };
const definitions: Record<string, Definition[]> = {
  "lithium-batteries": [nominalVoltage, voltageClass, capacity, energy, chemistry, weight, dimensions, cycleLife],
  "expansion-batteries": [energy, nominalVoltage, chemistry, weight, dimensions, cycleLife],
  "solar-panels": [panelPower, dimensions, weight,
    { id: "cell-technology", label: ["Cell technology", "Tehnologia celulelor"], keys: ["Cell technology"] },
    { id: "efficiency", label: ["Documented panel efficiency", "Eficiență panou documentată"], keys: ["Efficiency", "Panel efficiency"] },
    { id: "voc", label: ["Open-circuit voltage (STC)", "Tensiune în gol (STC)"], keys: ["Open-circuit voltage (STC)"] }],
  "backup-power": [energy, continuous, surge,
    { id: "charging-options", label: ["Documented charging options", "Opțiuni de încărcare documentate"], keys: ["Charging options"] },
    weight, dimensions, chemistry],
  "dc-backup": [energy,
    { id: "dc-output", label: ["Documented DC output", "Ieșire DC documentată"], keys: ["DC output"] }, weight, dimensions],
  inverters: [continuous, surge,
    { id: "dc-input", label: ["DC input class", "Clasă intrare DC"], keys: ["DC input class"], facet: ["voltage", "V"] },
    { id: "waveform", label: ["Waveform", "Formă de undă"], keys: ["Waveform"] }, weight, dimensions],
  water: [
    { id: "technology", label: ["Technology", "Tehnologie"], keys: ["Technology", "Tehnologie / Technology"] },
    { id: "production", label: ["Nominal production", "Producție nominală"], keys: ["Nominal production"] },
    { id: "installation", label: ["Installation", "Instalare"], keys: ["Installation", "Montaj / Installation"] },
    { id: "filter-replacement", label: ["Documented filter replacement interval", "Interval documentat de înlocuire a filtrelor"], keys: ["Filter replacement interval"] },
    { id: "contaminant-reduction", label: ["Documented contaminant reduction", "Reducerea documentată a contaminanților"], keys: ["Documented contaminant reduction"] },
    { id: "water-recovery", label: ["Purified water to drain", "Raport apă purificată/evacuată"], keys: ["Purified water to drain"] }],
};

/** Presentation only: preserve source values and qualifiers, never calculate missing facts. */
export function comparisonSpecifications(products: Equipment[], ro: boolean): ComparisonSpecification[] {
  const group = products[0] ? comparisonGroup(products[0]) : "";
  if (products.some(product => product.kind !== "product" || comparisonGroup(product) !== group)) return [];
  const consumed = products.map(() => new Set<string>());
  const rows = (definitions[group] ?? []).map(definition => ({
    id: definition.id, label: definition.label[ro ? 1 : 0],
    values: products.map((product, index) => {
      const documented = definition.keys.flatMap(key => {
        const value = product.technicalSpecs[key];
        if (!value || (definition.unit && !definition.unit.test(value))) return [];
        consumed[index].add(key);
        return [{ key, value: specificationValue(value, ro) + (definition.stc && key === "Rated power (STC)" ? " (STC)" : "") }];
      });
      const values = [...new Set(documented.map(entry => entry.value))];
      // Preserve disagreeing source entries instead of silently picking one alias.
      if (values.length > 1) return documented.map(entry => `${specificationLabel(entry.key, ro)}: ${entry.value}`).join("; ");
      if (values.length) return values[0];
      const [facet, unit] = definition.facet ?? [];
      return facet && product.facets[facet] ? `${specificationValue(product.facets[facet], ro)}${unit ? ` ${unit}` : ""}` : null;
    }),
  }));
  const remaining = [...new Set(products.flatMap((product, index) => Object.keys(product.technicalSpecs).filter(key => !consumed[index].has(key))))];
  for (const key of remaining) rows.push({
    id: `source-${key}`, label: specificationLabel(key, ro),
    values: products.map((product, index) => !consumed[index].has(key) && product.technicalSpecs[key] ? specificationValue(product.technicalSpecs[key], ro) : null),
  });
  return rows;
}

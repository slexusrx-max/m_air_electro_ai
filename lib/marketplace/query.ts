import type { Equipment } from "./catalog-data";
export type CatalogQuery = Record<string, string | undefined>;
export const facetLabels: Record<string, [string, string]> = {
  voltage: ["Voltage class (V)", "Clasă tensiune (V)"],
  power: ["Power (W)", "Putere (W)"],
  surgePower: ["Surge (W)", "Vârf (W)"],
  capacityAh: ["Capacity (Ah)", "Capacitate (Ah)"],
  capacityWh: ["Stored energy (Wh)", "Energie stocată (Wh)"],
  chemistry: ["Chemistry", "Chimie"],
  bluetooth: ["Bluetooth", "Bluetooth"],
  selfHeating: ["Self-heating", "Autoîncălzire"],
  application: ["Application", "Aplicație"],
  waveform: ["Waveform", "Formă de undă"],
  charger: ["Battery charger", "Încărcător baterie"],
  format: ["Panel format", "Format panou"],
  current: ["Current (A)", "Curent (A)"],
  controllerType: ["Controller type", "Tip regulator"],
};
export function normalizeSearch(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/(\d)[,.](\d)/g, "$1.$2")
    .replace(/[^\p{L}\p{N}.]+/gu, " ")
    .trim();
}
export function cleanQuery(
  query: Record<string, string | string[] | undefined>,
): CatalogQuery {
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => [
      key,
      (Array.isArray(value) ? value[0] : value)?.slice(0, 150),
    ]),
  );
}
export function filterEquipment(products: Equipment[], raw: CatalogQuery) {
  const query = cleanQuery(raw);
  const terms = normalizeSearch(query.q ?? "")
    .split(/\s+/)
    .filter(Boolean);
  return products.filter((p) => {
    const names: Record<string, string> = {
      "lithium-batteries": "batteries acumulator acumulatoare baterii",
      inverters: "invertoare invertor",
      "solar-panels": "panouri solare",
      chargers: "incarcatoare incarcare",
      "backup-power": "rezerva energie",
      "electrical-accessories": "componente cabluri protectie",
    };
    const haystack = normalizeSearch(
      [
        names[p.category] ?? "",
        p.name,
        p.title.ro,
        p.brand,
        p.category,
        p.summary.en,
        p.summary.ro,
        p.bestFor.en,
        p.bestFor.ro,
        ...p.tags,
        ...Object.entries(p.facets).map(
          ([k, v]) =>
            `${v}${k === "power" ? "W" : k === "voltage" ? "V" : k === "capacityAh" ? "Ah" : k === "capacityWh" ? "Wh" : ""}`,
        ),
        ...Object.values(p.technicalSpecs),
      ].join(" "),
    );
    return (
      terms.every((term) => haystack.includes(term)) &&
      Object.keys(facetLabels).every(
        (key) => !query[key] || p.facets[key] === query[key],
      ) &&
      (!query.kind || p.kind === query.kind)
    );
  });
}
export function parseComparison(
  ids: string | undefined,
  products: Equipment[],
) {
  return [...new Set((ids ?? "").split(","))]
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Equipment => Boolean(p))
    .slice(0, 4);
}
export function solarEstimate(
  dailyWh: number,
  sunHours: number,
  yieldFactor: number,
) {
  if (
    ![dailyWh, sunHours, yieldFactor].every(Number.isFinite) ||
    dailyWh <= 0 ||
    sunHours <= 0 ||
    sunHours > 12 ||
    yieldFactor <= 0 ||
    yieldFactor > 1
  )
    return null;
  const watts = Math.ceil(dailyWh / sunHours / yieldFactor);
  return Number.isSafeInteger(watts) && watts > 0 ? watts : null;
}

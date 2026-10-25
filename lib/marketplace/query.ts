import type { Equipment } from "./catalog-data";
import { isCatalogListing } from "./product-presentation";
export type CatalogQuery = Record<string, string | undefined>;
export const facetLabels: Record<string, [string, string]> = {
  technology: ["Water technology", "Tehnologie apa"],
  installation: ["Water installation", "Instalare apa"],
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
export function normalizeFacet(key: string, value: string) {
 const normalized = value.trim().toLowerCase().replace(/[\s_]+/g, "-");
 if (key === "format" && ["portable", "rigid", "flexible"].includes(normalized)) return normalized;
 if (key === "waveform" && normalized === "pure-sine") return normalized;
 return value;
}
export function facetValueLabel(key: string, value: string, ro: boolean) {
 const labels: Record<string, [string,string]> = { portable:["Portable","Portabil"],rigid:["Rigid","Rigid"],flexible:["Flexible","Flexibil"],"pure-sine":["Pure sine","Sinus pur"],countertop:["Countertop","Pe blat"],"under-sink":["Under-sink","Sub chiuveta"] };
 return ["format","waveform","installation"].includes(key) ? labels[value]?.[ro ? 1 : 0] ?? value : value;
}
export function normalizeSearch(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/(\d)[,.](\d)/g, "$1.$2")
    .replace(/[^\p{L}\p{N}.]+/gu, " ")
    .replace(/(\d)\s+(kwh|kw|ah|wh|v|w|a)\b/g, "$1$2")
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
  const results = products.filter((p) => {
    if (!isCatalogListing(p)) return false;
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
        (key) => !query[key] || (p.facets[key] !== undefined && normalizeFacet(key, p.facets[key]) === normalizeFacet(key, query[key]!)),
      ) &&
      (!query.kind || p.kind === query.kind) &&
      (!query.brand || p.brand === query.brand)
    );
  });
  if (query.sort === "name") return results.sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }));
  if (query.sort === "models") return results.sort((a, b) => Number(b.kind === "product") - Number(a.kind === "product"));
  return results;
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

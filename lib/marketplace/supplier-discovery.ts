import feed from "@/data/renogy-feed-variants.json";
import { productFeedIdentity } from "@/lib/affiliate/pricing";
import type { Equipment } from "./catalog-data";
import { cleanQuery, facetLabels, filterEquipment, normalizeSearch, type CatalogQuery } from "./query";

export type SupplierEntry = typeof feed.products[number];

// Classification uses explicit equipment nouns in the official feed name only.
// No capacity, electrical specification, compatibility or use case is inferred.
export function supplierEntryPaths(entry: SupplierEntry): string[] {
  const name = entry.name.toLowerCase();
  if (/worry-free|shippingcharge|price difference|buy more save more|my solar plan|mug|magnet|ring holder|canvas bag|package bag/.test(name)) return [];
  if (/ - bluetooth module$/.test(name)) return ["electrical-components"];
  const title = name.replace(/^(core|duoheat tech)\s+-\s+/, "").split(" - ")[0];
  if (/cable|connector|adaptor|adapter|bracket|mount|fuse|circuit breaker|monitor|shunt|bluetooth module|assembly tool|renogy one/.test(title)) return ["electrical-components"];
  if (/power system|backup system|power kit/.test(title)) return ["backup-power"];
  if (/solar.*kit/.test(title)) return ["solar", "solar/kits"];
  if (/charge controller/.test(title)) return ["solar", "solar/controllers"];
  if (/solar panel|solar suitcase/.test(title)) return ["solar", "solar/panels"];
  if (/inverter/.test(title)) return ["inverters"];
  if (/battery charger/.test(title)) return ["chargers"];
  if (/power station/.test(title)) return ["backup-power"];
  if (/lifepo4|lithium.*battery/.test(title)) return ["batteries"];
  return [];
}

export function supplierEntryName(entry: SupplierEntry): string {
  return entry.name.replace(/^(?:member price|special offer)\s*/i, "")
    .replace(/[（(]save[^)）]*[)）]/gi, "").replace(/\s+/g, " ").trim();
}

export type DiscoveryResult = { type: "reviewed"; product: Equipment } | { type: "supplier"; entry: SupplierEntry };

export function discoverEquipment(products: Equipment[], raw: CatalogQuery, path = "/search"): DiscoveryResult[] {
  const query = cleanQuery(raw);
  const reviewed = query.kind === "supplier-entry" ? [] : filterEquipment(products, { ...query, kind: query.kind || "product" });
  const entriesAllowed = !query.kind || query.kind === "supplier-entry";
  const hasTechnicalFilters = Object.keys(facetLabels).some(key => query[key]);
  const scope = path.startsWith("/marketplace/") ? path.slice("/marketplace/".length) : "";
  const terms = normalizeSearch(query.q ?? "").split(/\s+/).filter(Boolean);
  const identities = new Map(products.filter(p => p.kind === "product").flatMap(p => {
    const identity = productFeedIdentity(p);
    return identity?.provider === "renogy" ? [[identity.merchantSku, p] as const] : [];
  }));
  const rawEntries = entriesAllowed && !hasTechnicalFilters && (!query.brand || query.brand === "Renogy") ? feed.products.filter(entry => {
    const paths = supplierEntryPaths(entry);
    const haystack = normalizeSearch(`${entry.sku} ${entry.name} Renogy ${paths.join(" ")} ${paths.includes("batteries") ? "baterii acumulator" : ""} ${paths.includes("solar/panels") ? "panouri solare" : ""} ${paths.includes("inverters") ? "invertor invertoare" : ""}`);
    return (!scope || paths.includes(scope)) && terms.every(term => haystack.includes(term));
  }) : [];
  const result: DiscoveryResult[] = reviewed.map(product => ({ type: "reviewed", product }));
  const seen = new Set(reviewed.map(p => p.id));
  for (const entry of rawEntries) {
    const canonical = identities.get(entry.sku);
    if (canonical && query.kind !== "supplier-entry") {
      if (!seen.has(canonical.id)) { result.push({ type: "reviewed", product: canonical }); seen.add(canonical.id); }
    } else result.push({ type: "supplier", entry });
  }
  if (!result.length && !query.kind) result.push(...filterEquipment(products, { ...query, kind: "equipment-class" }).map(product => ({ type: "reviewed" as const, product })));
  if (query.sort === "name") result.sort((a, b) => (a.type === "reviewed" ? a.product.name : a.entry.name).localeCompare(b.type === "reviewed" ? b.product.name : b.entry.name, "en", { numeric: true }));
  return result;
}

export const supplierSkuCount = feed.products.length;

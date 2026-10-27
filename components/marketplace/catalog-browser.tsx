import Link from "@/components/localized-link";
import { ProductCard } from "./product-card";
import {
  filterEquipment,
  normalizeFacet,
  facetValueLabel,
  cleanQuery,
  facetLabels,
  type CatalogQuery,
} from "@/lib/marketplace/query";
import type { Equipment } from "@/lib/marketplace/catalog-data";
import type { Dictionary } from "@/lib/i18n/types";
import { localizedPath } from "@/lib/i18n/routing";
import { discoverEquipment, supplierSkuCount } from "@/lib/marketplace/supplier-discovery";
import { getPublicRenogyFeedPrices } from "@/lib/affiliate/price-feed";
import { SupplierEntryCard } from "./supplier-entry-card";
export async function CatalogBrowser({
  products,
  query: raw,
  path,
  facets,
  dictionary,
  ro,
  pageSize: requestedPageSize,
}: {
  products: Equipment[];
  query: CatalogQuery;
  path: string;
  facets: string[];
  dictionary: Dictionary;
  ro: boolean;
  pageSize?: number;
}) {
  const query = cleanQuery(raw);
  const allResults = discoverEquipment(products, query, path);
  const results = allResults.flatMap(result => result.type === "reviewed" ? [result.product] : []);
  const pageSize = requestedPageSize ?? (query.kind === "product" || query.kind === "equipment-class" ? 48 : 24);
  const pages = Math.max(1, Math.ceil(allResults.length / pageSize));
  const page = Math.max(1, Math.min(pages, Number.parseInt(query.page ?? "1", 10) || 1));
  const visible = allResults.slice((page - 1) * pageSize, page * pageSize);
  const prices = visible.some(result => result.type === "supplier") ? await getPublicRenogyFeedPrices() : {};
  const supplierCount = allResults.length - results.length;
  const pageHref = (value: number) => `${path}?${new URLSearchParams(Object.entries({ ...query, page: String(value) }).filter((entry): entry is [string, string] => Boolean(entry[1])))}`;
  const facetProducts = filterEquipment(products, { q: query.q, kind: query.kind, brand: query.brand });
  const modelCount = results.filter(product => product.kind === "product").length;
  const classCount = results.length - modelCount;
  const active = Object.entries(query).filter(([key, value]) => value && ["q", "kind", "brand", ...Object.keys(facetLabels)].includes(key));
  return (
    <section className="catalog-layout">
      {/* Reset uncontrolled fields when client navigation changes the applied URL query. */}
      <form key={JSON.stringify(query)} action={localizedPath(path, ro ? "ro" : "en")} className="catalog-filters">
        <h2>{ro ? "Caută și filtrează" : "Search & filter"}</h2>
        <label>
          {ro
            ? "Nume, specificații, utilizare"
            : "Name, specifications, use case"}
          <input
            name="q"
            defaultValue={query.q ?? ""}
            maxLength={120}
            type="search"
          />
        </label>
        <label>
          {ro ? "Tip înregistrare" : "Record type"}
          <select name="kind" defaultValue={query.kind ?? ""}>
            <option value="">{ro ? "Modele și catalog furnizor" : "Models and supplier catalog"}</option>
            <option value="product">
              {ro ? "Modele reale" : "Real models"}
            </option>
            <option value="equipment-class">
              {ro ? "Clase de echipamente" : "Equipment classes"}
            </option>
            <option value="supplier-entry">{ro ? "Doar catalog furnizor" : "Supplier catalog only"}</option>
          </select>
        </label>
        <label>
          {ro ? "Marcă" : "Brand"}
          <select name="brand" defaultValue={query.brand ?? ""}>
            <option value="">{ro ? "Toate mărcile" : "All brands"}</option>
            {[...new Set(products.filter(p => p.kind === "product").map(p => p.brand))].sort().map(brand => <option key={brand} value={brand}>{brand}</option>)}
          </select>
        </label>
        <label>
          {ro ? "Ordonează" : "Sort by"}
          <select name="sort" defaultValue={query.sort ?? ""}>
            <option value="">{ro ? "Ordinea catalogului" : "Catalog order"}</option>
            <option value="name">{ro ? "Nume A–Z" : "Name A–Z"}</option>
            <option value="models">{ro ? "Modele reale mai întâi" : "Real models first"}</option>
          </select>
        </label>
        <details className="filter-options" open={facets.some(key => Boolean(query[key]))}>
          <summary>{ro ? "Filtre tehnice" : "Technical filters"}</summary>
          <div>{facets.map((key) => {
          const values = [
            ...new Set(facetProducts.map((p) => p.facets[key]).filter(Boolean).map(value => normalizeFacet(key, value))),
          ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
          if (query[key] && !values.includes(normalizeFacet(key, query[key]!))) values.push(normalizeFacet(key, query[key]!));
          return values.length ? (
            <label key={key}>
              {facetLabels[key]?.[ro ? 1 : 0] ?? key}
              <select name={key} defaultValue={normalizeFacet(key, query[key] ?? "")}>
                <option value="">{ro ? "Toate" : "All"}</option>
                {values.map((v) => (
                  <option key={v} value={v}>
                    {facetValueLabel(key, v, ro)}
                  </option>
                ))}
              </select>
            </label>
          ) : null;
        })}</div>
        </details>
        <button className="button-primary" type="submit">
          {ro ? "Aplică filtrele" : "Apply filters"}
        </button>
        <Link href={path}>{ro ? "Resetează" : "Reset"}</Link>
        <p className="small-copy">
          {ro
            ? "Sunt afișate doar filtre cu valori cunoscute. Câmpurile necunoscute nu sunt presupuse."
            : "Only filters with known values are shown. Missing fields are never assumed."}
        </p>
      </form>
      <div>
        {active.length > 0 && <nav className="active-filters" aria-label={ro ? "Filtre active" : "Active filters"}>
          {active.map(([key, value]) => {
            const params = new URLSearchParams([...active, ...(query.sort ? [["sort", query.sort]] : [])].filter(([other]) => other !== key).map(([k, v]) => [k, v!]));
            const label = key === "q" ? (ro ? "Căutare" : "Search") : key === "kind" ? (ro ? "Tip" : "Type") : key === "brand" ? (ro ? "Marcă" : "Brand") : facetLabels[key]?.[ro ? 1 : 0] ?? key;
            const display = value === "product" ? (ro ? "Modele reale" : "Real models") : value === "equipment-class" ? (ro ? "Clase de echipamente" : "Equipment classes") : value === "supplier-entry" ? (ro ? "Catalog furnizor" : "Supplier catalog") : value;
            return <Link key={key} href={`${path}${params.size ? `?${params}` : ""}`} aria-label={`${ro ? "Elimină filtrul" : "Remove filter"}: ${label} ${display}`}>{label}: {display} <span aria-hidden="true">×</span></Link>;
          })}
          <Link href={path}>{ro ? "Șterge toate" : "Clear all"}</Link>
        </nav>}
        <p className="result-count" role="status">
          {allResults.length} {ro ? "rezultate" : "results"}
          {query.q ? ` · “${query.q}”` : ""}
        </p>
        <p className="small-copy catalog-source-summary">{ro ? `${supplierCount} poziții din catalogul furnizorului. Index Renogy: ${supplierSkuCount} SKU-uri, nu ${supplierSkuCount} modele evaluate.` : `${supplierCount} supplier catalog entries. Renogy index: ${supplierSkuCount} SKUs, not ${supplierSkuCount} reviewed models.`} <Link href="/renogy/catalog">{ro ? "Index complet" : "Complete index"} →</Link></p>
        <p className="small-copy" data-testid="catalog-record-types">
          {ro
            ? `Modele reale: ${modelCount}. Ghiduri de clasă: ${classCount}. Ghidurile explică cerințele și nu reprezintă oferte de cumpărare.`
            : `Real models: ${modelCount}. Equipment class guides: ${classCount}. Guides explain requirements and are not purchase offers.`}
        </p>
        {allResults.length ? (
          <div className="product-grid">
            {visible.map(result => result.type === "reviewed" ? <ProductCard key={result.product.id} product={result.product} dictionary={dictionary} /> : <SupplierEntryCard key={result.entry.sku} entry={result.entry} price={prices[result.entry.sku]} ro={ro} />)}
          </div>
        ) : (
          <div className="content-panel">
            <h3>{ro ? "Nicio potrivire în catalog" : "No catalog matches"}</h3>
            <p>
              {ro
                ? "Încearcă o putere sau tensiune mai generală, elimină filtrele sau caută după tipul echipamentului. Pentru această categorie poți pregăti cerințele tehnice chiar dacă nu există încă un model selectat."
                : "Try a broader power or voltage, remove filters, or search by equipment type. You can prepare the technical requirements even where a selected model is not yet available."}
            </p>
            <Link href="/marketplace/find-my-solution">
              {ro ? "Configurează cerințele" : "Define the requirements"} →
            </Link>
          </div>
        )}
        {pages > 1 && <nav className="catalog-pagination" aria-label={ro ? "Pagini rezultate" : "Result pages"}>
          {page > 1 && <Link href={pageHref(page - 1)}>← {ro ? "Anterior" : "Previous"}</Link>}
          <span>{ro ? "Pagina" : "Page"} {page}/{pages}</span>
          {page < pages && <Link href={pageHref(page + 1)}>{ro ? "Următor" : "Next"} →</Link>}
        </nav>}
      </div>
    </section>
  );
}

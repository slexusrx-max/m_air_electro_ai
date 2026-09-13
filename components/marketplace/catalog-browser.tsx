import Link from "next/link";
import { ProductCard } from "./product-card";
import {
  filterEquipment,
  cleanQuery,
  facetLabels,
  type CatalogQuery,
} from "@/lib/marketplace/query";
import type { Equipment } from "@/lib/marketplace/catalog-data";
import type { Dictionary } from "@/lib/i18n/types";
export function CatalogBrowser({
  products,
  query: raw,
  path,
  facets,
  dictionary,
  ro,
}: {
  products: Equipment[];
  query: CatalogQuery;
  path: string;
  facets: string[];
  dictionary: Dictionary;
  ro: boolean;
}) {
  const query = cleanQuery(raw);
  const results = filterEquipment(products, query);
  return (
    <section className="catalog-layout">
      <form action={path} className="catalog-filters">
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
            <option value="">{ro ? "Toate" : "All"}</option>
            <option value="product">
              {ro ? "Modele reale" : "Real models"}
            </option>
            <option value="equipment-class">
              {ro ? "Clase de echipamente" : "Equipment classes"}
            </option>
          </select>
        </label>
        {facets.map((key) => {
          const values = [
            ...new Set(products.map((p) => p.facets[key]).filter(Boolean)),
          ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
          return values.length ? (
            <label key={key}>
              {facetLabels[key]?.[ro ? 1 : 0] ?? key}
              <select name={key} defaultValue={query[key] ?? ""}>
                <option value="">{ro ? "Toate" : "All"}</option>
                {values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          ) : null;
        })}
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
        <p className="result-count" role="status">
          {results.length} {ro ? "rezultate" : "results"}
          {query.q ? ` · “${query.q}”` : ""}
        </p>
        {results.length ? (
          <div className="product-grid">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} dictionary={dictionary} />
            ))}
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
      </div>
    </section>
  );
}

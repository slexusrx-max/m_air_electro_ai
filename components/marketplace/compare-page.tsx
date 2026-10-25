import { EditorialRecord } from "@/components/editorial-record";
import { AnalyticsEvent } from "@/components/analytics-event";
import Link from "@/components/localized-link";
import { specificationLabel, specificationValue } from "@/lib/marketplace/specifications";
import { catalog } from "@/lib/affiliate/catalog";
import { parseComparison } from "@/lib/marketplace/query";
import { RemoveComparison } from "./compare-control";
import { SupplierLink } from "./supplier-link";
import { localizedPath } from "@/lib/i18n/routing";
import { SelectionHelp } from "./selection-help";
import { stationCandidates, batteryCandidates } from "@/lib/marketplace/selection-guidance";
export function Comparison({ ids, ro }: { ids: string; ro: boolean }) {
  const selected = parseComparison(ids, catalog);
  const waterOnly = selected.length > 0 && selected.every(p => p.category === "water");
  const mixed = new Set(selected.map(p => `${p.kind}/${p.category}`)).size > 1;
  const starterGroups = [
    { title: ro ? "Stații portabile: PECRON și BLUETTI" : "Portable stations: PECRON and BLUETTI", items: stationCandidates(catalog, "EU", { batteryWh: 1, loadWh: 1, inverterW: 1, surgeW: 1 }) },
    { title: ro ? "Baterii Renogy de clasă 12 V" : "Renogy 12 V-class batteries", items: batteryCandidates(catalog, 1, 12) },
  ];
  const fields = [
    ...new Set(selected.flatMap((p) => Object.keys(p.technicalSpecs))),
  ];
  return (
    <>
      {!waterOnly && <section className="content-panel">
        <h2>{ro ? "Compară produse cu același rol" : "Compare products with the same role"}</h2>
        <p>{ro ? "Selecții editoriale din modelele documentate, nu kituri sau oferte de preț. Pentru consumatorii tăi, începe cu configuratorul." : "Editorial selections of documented models, not kits or price offers. For your own loads, start with the finder."}</p>
        <div className="action-row">{starterGroups.filter(g => g.items.length >= 2).map(g => <Link key={g.title} className="button-outline" href={`/compare?ids=${encodeURIComponent(g.items.map(p => p.id).join(","))}`}>{g.title}</Link>)}<Link href="/marketplace/find-my-solution">{ro ? "Calculează necesarul" : "Calculate requirements"}</Link></div>
      </section>}
      {!waterOnly && <SelectionHelp ro={ro} />}
      <form key={selected.map(p => p.id).join(",")} action={localizedPath("/compare", ro ? "ro" : "en")} className="content-panel">
        <p>
          {ro
            ? "Selectează 2–4 înregistrări. Compară preferabil aceeași categorie; clasele de echipamente nu sunt modele comerciale."
            : "Select 2–4 records. Prefer the same category; equipment classes are not purchasable models."}
        </p>
        <div className="compare-selectors">
          {[0, 1, 2, 3].map((i) => (
            <label key={i}>
              {ro ? "Echipament" : "Equipment"} {i + 1}
              <select
                name={`item${i + 1}`}
                defaultValue={selected[i]?.id ?? ""}
              >
                <option value="">{ro ? "Selectează" : "Select"}</option>
                {catalog.map((p) => (
                  <option key={p.id} value={p.id}>
                    {ro ? p.title.ro : p.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="action-row">
          <button type="submit" className="button-primary">
            {ro ? "Compară selecția" : "Compare selection"}
          </button>
          <Link href="/compare">{ro ? "Resetează" : "Reset"}</Link>
        </div>
      </form>
      {selected.length < 2 ? (
        <p className="content-panel" role="status">
          {ro
            ? "Alege cel puțin două echipamente pentru tabelul comparativ."
            : "Choose at least two items to display the comparison table."}
        </p>
      ) : (
        <>
          <AnalyticsEvent name="comparison_view" eventKey={selected.map(p => p.id).join(",")} />
          {mixed && <p className="safety-note" role="status">{ro ? "Selecția conține roluri diferite. O baterie, un panou și o stație completă nu sunt alternative interschimbabile; tabelul nu confirmă compatibilitatea dintre ele." : "This selection contains different roles. A battery, a panel and a complete station are not interchangeable alternatives; this table does not confirm compatibility between them."}</p>}
          <p>{waterOnly ? (ro ? "Verifica instalarea, analiza apei si manualul modelului. Livrarea in Romania nu este confirmata." : "Check installation, source-water analysis and the exact manual. Romanian delivery is not confirmed.") : ro ? "Prețurile, stocul și livrarea în România se confirmă la vânzător. O valoare Wh descrie energia, nu o autonomie garantată; W descrie puterea, nu energia stocată." : "Confirm prices, stock and delivery to Romania with the seller. Wh describes energy, not guaranteed runtime; W describes power, not stored energy."}</p>
          <EditorialRecord path="/compare" title={ro ? "Comparație factuală de echipamente" : "Factual equipment comparison"} ro={ro} sources={[...new Set(selected.flatMap(p => p.sourceUrls))]} />
          <p className="small-copy">
            {ro
              ? "Câmpurile fără date sunt marcate «Nedocumentat». Nicio valoare nu este dedusă din preț sau din produse asemănătoare."
              : "Missing fields are marked “Not documented”. No value is inferred from price or similar products."}
          </p>
          <div
            className="comparison-scroll"
            tabIndex={0}
            role="region"
            aria-label={
              ro
                ? "Tabel comparativ, derulare orizontală"
                : "Comparison table, scroll horizontally"
            }
          >
            <table>
              <caption>
                {ro ? "Comparație factuală" : "Factual comparison"}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{ro ? "Criteriu" : "Criterion"}</th>
                  {selected.map((p) => (
                    <th scope="col" key={p.id}>
                      <Link href={`/marketplace/products/${p.slug}`}>
                        {ro ? p.title.ro : p.name}
                      </Link>
                      <RemoveComparison ids={selected.filter(n => n.id !== p.id).map(n => n.id)} ro={ro} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{ro ? "Utilizare" : "Intended use"}</th>
                  {selected.map((p) => (
                    <td key={p.id}>{ro ? p.bestFor.ro : p.bestFor.en}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">{ro ? "Limitări" : "Limitations"}</th>
                  {selected.map((p) => (
                    <td key={p.id}>
                      {ro ? p.limitations.ro : p.limitations.en}
                    </td>
                  ))}
                </tr>
                {!waterOnly && [
                  [ro ? "Energie nominală (Wh)" : "Nominal energy (Wh)", "capacityWh"],
                  [ro ? "Putere (W; rolul diferă după categorie)" : "Power (W; role depends on category)", "power"],
                  [ro ? "Clasa de tensiune (V)" : "Voltage class (V)", "voltage"],
                ].map(([label, field]) => <tr key={field}><th scope="row">{label}</th>{selected.map(p => <td key={p.id}>{p.facets[field] ?? (ro ? "Nedocumentat / nu se aplică" : "Not documented / not applicable")}</td>)}</tr>)}
                <tr>
                  <th scope="row">{ro ? "Furnizor extern" : "External supplier"}</th>
                  {selected.map(p => {
                    return <td key={p.id}>{p.productUrl ? <SupplierLink product={p} ro={ro}>{p.merchant}</SupplierLink> : (ro ? "Niciun furnizor selectat" : "No supplier selected")}</td>;
                  })}
                </tr>
                <tr>
                  <th scope="row">{ro ? "Tip" : "Type"}</th>
                  {selected.map((p) => (
                    <td key={p.id}>
                      {p.kind === "product"
                        ? p.brand
                        : ro
                          ? "Clasă de echipament"
                          : "Equipment class"}
                    </td>
                  ))}
                </tr>
                {fields.map((field) => (
                  <tr key={field}>
                    <th scope="row">{specificationLabel(field, ro)}</th>
                    {selected.map((p) => (
                      <td key={p.id}>
                        {(p.technicalSpecs[field] ? specificationValue(p.technicalSpecs[field], ro) : undefined) ??
                          (ro ? "Nedocumentat" : "Not documented")}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row">{ro ? "Verificare sursă (asistată AI)" : "Source check (AI-assisted)"}</th>
                  {selected.map((p) => (
                    <td key={p.id}>{p.kind === "product" ? p.lastUpdated : (ro ? "Nu se aplică — clasă de echipament" : "Not applicable — equipment class")}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

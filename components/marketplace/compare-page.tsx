import { EditorialRecord } from "@/components/editorial-record";
import { AnalyticsEvent } from "@/components/analytics-event";
import Link from "@/components/localized-link";
import { specificationLabel, specificationValue } from "@/lib/marketplace/specifications";
import { catalog } from "@/lib/affiliate/catalog";
import { comparableSelection, comparisonGroup } from "@/lib/marketplace/comparison";
import { ComparisonForm } from "./comparison-form";
import { RemoveComparison } from "./compare-control";
import { SupplierPrice } from "./supplier-link";
import { stationCandidates, batteryCandidates } from "@/lib/marketplace/selection-guidance";
export function Comparison({ ids, ro, category }: { ids: string; ro: boolean; category?: string }) {
  const { selected, invalid } = comparableSelection(ids, catalog);
  const waterOnly = selected.length > 0 && selected.every(p => p.category === "water");
  const group = selected[0] ? comparisonGroup(selected[0]) : category;
  const starterGroups = [
    { title: ro ? "Stații portabile: PECRON și BLUETTI" : "Portable stations: PECRON and BLUETTI", items: stationCandidates(catalog, "EU", { batteryWh: 1, loadWh: 1, inverterW: 1, surgeW: 1 }) },
    { title: ro ? "Baterii Renogy de clasă 12 V" : "Renogy 12 V-class batteries", items: batteryCandidates(catalog, 1, 12) },
  ];
  const fields = [
    ...new Set(selected.flatMap((p) => Object.keys(p.technicalSpecs))),
  ];
  return (
    <>
      {invalid && <p className="safety-note" role="status">{ro ? "Selecția combină categorii sau roluri diferite, ori ghiduri de clasă. Compară modele cu același rol: stații AC, surse DC sau baterii de extensie separat." : "This selection mixes categories, equipment roles or class guides. Compare models with the same role: AC stations, DC supplies and expansion batteries separately."}</p>}
      <ComparisonForm key={ids} ro={ro} initialCategory={category} products={catalog.filter(p => p.kind === "product").map(p => ({ id: p.id, name: ro ? p.title.ro : p.name, category: comparisonGroup(p) }))} selected={selected.map(p => p.id)} />
      {group === "dc-backup" && <p className="safety-note" data-comparison-role="dc-backup">{ro ? "Aceste surse DC nu oferă o priză AC de 230 V. Verifică tensiunea, polaritatea și conectorul fiecărui aparat." : "These DC supplies do not provide a 230 V AC socket. Check each device's voltage, polarity and connector."}</p>}
      {group === "expansion-batteries" && <p className="safety-note" data-comparison-role="expansion-batteries">{ro ? "Aceste baterii de extensie necesită o stație compatibilă separată. Nu sunt stații AC autonome; compararea capacității nu confirmă compatibilitatea." : "These expansion batteries require a separate compatible station. They are not standalone AC stations; comparing capacity does not confirm compatibility."}</p>}
      {!waterOnly && <section className="content-panel">
        <h2>{ro ? "Compară produse cu același rol" : "Compare products with the same role"}</h2>
        <p>{ro ? "Selecții editoriale din modelele documentate, nu kituri sau oferte de preț. Pentru consumatorii tăi, începe cu configuratorul." : "Editorial selections of documented models, not kits or price offers. For your own loads, start with the finder."}</p>
        <div className="action-row">{starterGroups.filter(g => g.items.length >= 2).map(g => <Link key={g.title} className="button-outline" href={`/compare?ids=${encodeURIComponent(g.items.map(p => p.id).join(","))}`}>{g.title}</Link>)}<Link href="/marketplace/find-my-solution">{ro ? "Calculează necesarul" : "Calculate requirements"}</Link></div>
      </section>}
      {selected.length < 2 ? (
        <p className="content-panel" role="status">
          {ro
            ? "Alege cel puțin două echipamente pentru tabelul comparativ."
            : "Choose at least two items to display the comparison table."}
        </p>
      ) : (
        <>
          <AnalyticsEvent name="comparison_view" eventKey={selected.map(p => p.id).join(",")} />
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
                  <th scope="row">{ro ? "Preț curent / furnizor" : "Current price / supplier"}</th>
                  {selected.map(p => {
                    return <td key={p.id}>{p.productUrl ? <SupplierPrice product={p} ro={ro} compact /> : (ro ? "Niciun furnizor selectat" : "No supplier selected")}</td>;
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

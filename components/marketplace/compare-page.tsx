import { EditorialRecord } from "@/components/editorial-record";
import { AnalyticsEvent } from "@/components/analytics-event";
import Link from "next/link";
import { specificationLabel } from "@/lib/marketplace/specifications";
import { catalog } from "@/lib/affiliate/catalog";
import { parseComparison } from "@/lib/marketplace/query";
import { RemoveComparison } from "./compare-control";
import { renogyLink } from "@/lib/affiliate/providers/renogy";
export function Comparison({ ids, ro }: { ids: string; ro: boolean }) {
  const selected = parseComparison(ids, catalog);
  const fields = [
    ...new Set(selected.flatMap((p) => Object.keys(p.technicalSpecs))),
  ];
  return (
    <>
      <form key={selected.map(p => p.id).join(",")} action="/compare" className="content-panel">
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
                  <th scope="row">{ro ? "Furnizor extern" : "External supplier"}</th>
                  {selected.map(p => {
                    const link = p.productUrl ? renogyLink(p.productUrl) : null;
                    return <td key={p.id}>{link ? <a href={link.href} target="_blank" rel={link.tracked ? "sponsored noopener noreferrer" : "noopener noreferrer"}>
                      {ro ? "Verifică prețul la furnizor" : "Check price at supplier"} ↗{link.tracked ? (ro ? " (afiliat)" : " (affiliate)") : ""}
                    </a> : (ro ? "Niciun furnizor selectat" : "No supplier selected")}</td>;
                  })}
                </tr>
                <tr>
                  <th scope="row">{ro ? "Tip" : "Type"}</th>
                  {selected.map((p) => (
                    <td key={p.id}>
                      {p.kind === "product"
                        ? "Renogy"
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
                        {p.technicalSpecs[field] ??
                          (ro ? "Nedocumentat" : "Not documented")}
                      </td>
                    ))}
                  </tr>
                ))}
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

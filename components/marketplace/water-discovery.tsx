"use client";

import { useState } from "react";
import Link from "next/link";
import { waterCategories, waterContaminants, documentedWaterClaims } from "@/lib/marketplace/water";
import type { WaterContaminant } from "@/lib/marketplace/water";
import type { Equipment } from "@/lib/marketplace/catalog-data";

export function WaterDiscovery({ ro, products }: { ro: boolean; products: Equipment[] }) {
  const [selected, setSelected] = useState<WaterContaminant | "">("");
  const [source, setSource] = useState("mains");
  const [setting, setSetting] = useState("countertop");
  const matches = selected ? products.flatMap(p => documentedWaterClaims(p.id, p.waterPerformance ?? [], selected).map(claim => ({ product: p, claim }))) : [];
  const suggested = waterCategories.find(c => c.slug === setting)!;
  const name = (value: { en: string; ro: string }) => ro ? value.ro : value.en;
  return <>
    <section id="contaminants" className="water-section">
      <p className="water-kicker">{ro ? "ALEGE DUPĂ DOVEZI" : "CHOOSE BY EVIDENCE"}</p>
      <h2>{ro ? "Ce vrei să reduci?" : "What do you want to reduce?"}</h2>
      <p>{ro ? "Selectează un obiectiv pentru a vedea modelele cu performanță documentată. O denumire de tehnologie sau un brand nu confirmă reducerea unui contaminant." : "Select a goal to see models with documented performance. A technology name or brand does not establish contaminant reduction."}</p>
      <div className="water-chips" role="group" aria-label={ro ? "Contaminanți" : "Contaminants"}>
        {waterContaminants.map(c => <button key={c.id} type="button" aria-pressed={selected === c.id} onClick={() => setSelected(selected === c.id ? "" : c.id)}>{name(c.title)}</button>)}
      </div>
      <div className="water-evidence" aria-live="polite">
        {!selected ? <p>{ro ? "Alege un contaminant. Capacitatea necunoscută nu este considerată o potrivire." : "Choose a contaminant. Unknown capability is not treated as a match."}</p> : matches.length === 0 ? <>
          <h3>{ro ? "Niciun model verificat în catalog pentru această selecție" : "No verified catalog model for this selection"}</h3>
          <p>{ro ? "Capacitate necunoscută. Verifică substanța exactă, modelul și cartușul în fișa oficială de performanță, apoi certificarea sau testul independent disponibil. PFAS și metalele grele sunt grupuri: dovada pentru o substanță nu se extinde automat la întregul grup." : "Capability unknown. Check the exact substance, model and cartridge in the official performance sheet, then the available independent certification or test. PFAS and heavy metals are groups: evidence for one substance does not cover the entire group."}</p>
        </> : matches.map(({ product, claim }) => <article key={`${product.id}-${claim.testedSubstance}`}>
          <h3><Link href={`/marketplace/products/${product.slug}`}>{product.name}</Link></h3>
          <p>{claim.model} · {claim.cartridge} · {claim.testedSubstance}: {claim.performance}</p><p>{claim.conditions}</p>
          <a href={claim.officialSpecificationUrl}>{ro ? "Fișa oficială" : "Official specification"}</a>{" · "}
          {claim.independentEvidence ? <a href={claim.independentEvidence.url}>{claim.independentEvidence.organization} {claim.independentEvidence.standard}</a> : <span>{ro ? "Verificare independentă necunoscută" : "Independent verification unknown"}</span>}
        </article>)}
      </div>
    </section>
    <section id="finder" className="water-section water-finder">
      <div><p className="water-kicker">{ro ? "DE LA NEVOIE LA SISTEM" : "FROM NEED TO SYSTEM"}</p><h2>{ro ? "Găsește sistemul tău de apă" : "Find Your Water System"}</h2><p>{ro ? "Un punct de pornire pentru planificare. Alegerea unei categorii nu confirmă că apa este potabilă." : "A starting point for planning. Choosing a category does not establish that water is safe to drink."}</p></div>
      <div className="water-form">
        <label htmlFor="water-source">{ro ? "Sursa apei" : "Water source"}</label>
        <select id="water-source" value={source} onChange={e => setSource(e.target.value)}>
          <option value="mains">{ro ? "Rețea publică" : "Public mains"}</option><option value="well">{ro ? "Puț / sursă privată" : "Well / private supply"}</option><option value="surface">{ro ? "Apă de suprafață / necunoscută" : "Surface water / unknown"}</option>
        </select>
        <label htmlFor="water-setting">{ro ? "Unde și cum îl folosești?" : "Where and how will you use it?"}</label>
        <select id="water-setting" value={setting} onChange={e => setSetting(e.target.value)}>
          {waterCategories.map(c => <option key={c.slug} value={c.slug}>{name(c.title)}</option>)}
        </select>
        <div className="water-plan" aria-live="polite">
          <h3>{name(suggested.title)}</h3><p>{name(suggested.checks)}</p>
          <p>{source === "mains" ? (ro ? "Pregătește raportul furnizorului de apă și, dacă este necesar, analiza la robinetul tău." : "Prepare your water utility’s report and, where needed, a test at your own tap.") : source === "well" ? (ro ? "Începe cu o analiză de laborator a sursei private și discută rezultatele cu un specialist înainte de alegerea tratării." : "Start with a laboratory analysis of the private source and discuss the results with a specialist before choosing treatment.") : (ro ? "Sursa și riscurile nu sunt confirmate. Nu presupune că un filtru portabil face orice apă potabilă; urmează recomandările autorităților sanitare." : "The source and hazards are unconfirmed. Do not assume a portable filter makes any water safe to drink; follow public-health guidance.")}</p>
          <Link className="water-button" href={`/marketplace/water/${suggested.slug}`}>{ro ? "Explorează categoria" : "Explore category"} →</Link>
        </div>
      </div>
    </section>
  </>;
}

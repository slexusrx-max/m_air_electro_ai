import Link from "@/components/localized-link";
import { catalog } from "@/lib/affiliate/catalog";
import { batteryCandidates } from "@/lib/marketplace/selection-guidance";
import { SupplierLink } from "./supplier-link";
import { SelectionHelp } from "./selection-help";

export function BatteryCandidates({ minimumWh, voltage, ro }: { minimumWh: number; voltage: number; ro: boolean }) {
  const matches = batteryCandidates(catalog, minimumWh, voltage);
  return <section className="content-panel battery-candidates" aria-label={ro ? "Modele după calcul" : "Models based on this calculation"}>
    <h3>{ro ? "Baterii de verificat după acest calcul" : "Batteries to check against this calculation"}</h3>
    <p>{ro ? "Filtrare după energia nominală minimă calculată și clasa de tensiune introdusă. Modelele LiFePO4 de clasă 12 V au 12,8 V nominali. Nu presupunem legare în serie/paralel; confirmă curentul BMS, încărcătorul, invertorul și protecțiile pentru sarcina ta." : "Screened by the calculated minimum nominal energy and the entered voltage class. The 12 V-class LiFePO4 models have 12.8 V nominal voltage. No series/parallel wiring is assumed; confirm BMS current, charger, inverter and protection for your load."}</p>
    {matches.length ? <ul>{matches.map(p => <li key={p.id}>
      <Link href={`/marketplace/products/${p.slug}`}>{ro ? "Detalii" : "Details"}: {ro ? p.title.ro : p.name}</Link> — {p.facets.capacityWh} Wh. <SupplierLink product={p} ro={ro} />
    </li>)}</ul> : <p role="status">{ro ? "Niciun model individual documentat nu acoperă aceste praguri de energie și tensiune. Nu este o recomandare de a combina baterii." : "No documented single model covers these energy and voltage thresholds. This is not a recommendation to combine batteries."}</p>}
    {matches.length >= 2 && <Link className="button-outline" href={`/compare?ids=${encodeURIComponent(matches.map(p => p.id).join(","))}`}>{ro ? "Compară aceste baterii" : "Compare these batteries"}</Link>}
    <p><Link href="/marketplace/batteries">{ro ? "Explorează categoria și limitele sistemului" : "Explore the category and system limitations"}</Link></p>
    <SelectionHelp ro={ro} />
  </section>;
}

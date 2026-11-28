import Link from "@/components/localized-link";
import { catalog } from "@/lib/affiliate/catalog";
import { batteryCandidates } from "@/lib/marketplace/selection-guidance";
import { SupplierPrice } from "./supplier-link";
import { SelectionHelp } from "./selection-help";

export function BatteryCandidates({ minimumWh, voltage, ro }: { minimumWh: number; voltage: number; ro: boolean }) {
  const matches = batteryCandidates(catalog, minimumWh, voltage);
  return <section className="content-panel battery-candidates" aria-label={ro ? "Modele după calcul" : "Models based on this calculation"}>
    <h3>{ro ? "Baterii de verificat după acest calcul" : "Batteries to check against this calculation"}</h3>
    <p>{ro ? "Filtrăm după energia nominală minimă calculată. Tensiunea introdusă trebuie să corespundă clasei sau valorii nominale documentate pentru model. Verifică separat curentul BMS, încărcătorul, invertorul și protecțiile pentru sarcina ta. Rezultatul nu presupune legarea în serie sau în paralel." : "We screen by the calculated minimum nominal energy. The entered voltage must match the model’s voltage class or its documented nominal voltage. Check BMS current, charger, inverter and protection for your load separately. The result assumes no series or parallel wiring."}</p>
    {matches.length ? <ul>{matches.map(p => <li key={p.id}>
      <Link href={`/marketplace/products/${p.slug}`}>{ro ? "Detalii" : "Details"}: {ro ? p.title.ro : p.name}</Link> — {p.facets.capacityWh} Wh. <SupplierPrice product={p} ro={ro} compact />
    </li>)}</ul> : <p role="status">{ro ? "Niciun model individual documentat nu acoperă aceste praguri de energie și tensiune. Nu este o recomandare de a combina baterii." : "No documented single model covers these energy and voltage thresholds. This is not a recommendation to combine batteries."}</p>}
    {matches.length >= 2 && <Link className="button-outline" href={`/compare?ids=${encodeURIComponent(matches.map(p => p.id).join(","))}`}>{ro ? "Compară aceste baterii" : "Compare these batteries"}</Link>}
    <p><Link href="/marketplace/batteries">{ro ? "Explorează categoria și limitele sistemului" : "Explore the category and system limitations"}</Link></p>
    <SelectionHelp ro={ro} />
  </section>;
}

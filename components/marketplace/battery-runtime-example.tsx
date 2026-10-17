import Link from "@/components/localized-link";
import type { Equipment } from "@/lib/marketplace/catalog-data";

export function BatteryRuntimeExample({ product, ro }: { product: Equipment; ro: boolean }) {
  if (!["renogy-mini-100", "renogy-mini-200"].includes(product.id)) return null;
  const wh = Number(product.facets.capacityWh);
  const format = (n: number) => new Intl.NumberFormat(ro ? "ro-RO" : "en-GB", { maximumFractionDigits: 1 }).format(n);
  return <section className="content-panel energy-example">
    <h2>{ro ? "Ce înseamnă capacitatea pentru autonomie?" : "What does this capacity mean for runtime?"}</h2>
    <p>{ro ? "Calcul editorial, fără test fizic: capacitatea nominală documentată este" : "Editorial calculation, without physical testing: documented nominal capacity is"} {format(wh)} Wh. {ro ? "Cu fracție utilizabilă 80% și randament invertor 92%, energia AC calculată este" : "With an assumed 80% usable fraction and 92% inverter efficiency, calculated AC energy is"} {format(wh * 0.8 * 0.92)} Wh.</p>
    <div className="table-scroll" role="region" tabIndex={0} aria-label={ro ? "Autonomie calculată" : "Calculated runtime"}><table><caption>{ro ? "Ore = Wh nominali × 0,80 × 0,92 / W AC. Derulează tabelul pe ecrane mici." : "Hours = nominal Wh × 0.80 × 0.92 / AC W. Scroll the table on small screens."}</caption><thead><tr><th scope="col">{ro ? "Consum AC constant" : "Constant AC load"}</th><th scope="col">{ro ? "Ore calculate" : "Calculated hours"}</th></tr></thead><tbody>{[100, 300, 600].map(watts => <tr key={watts}><th scope="row">{watts} W</th><td>{format(wh * 0.8 * 0.92 / watts)}</td></tr>)}</tbody></table></div>
    <p>{ro ? "Bateria nu are ieșire AC integrată: este necesar un invertor separat. Estimarea exclude consumul în gol, cablurile, temperatura și îmbătrânirea. Nu confirmă că un anumit invertor sau motor este compatibil; verifică tensiunea minimă, curentul continuu și vârful cu durată. Dublarea capacității dublează energia calculată la aceleași ipoteze, dar nu dovedește compatibilitatea instalației." : "This battery has no integrated AC output: a separate inverter is required. The estimate excludes idle draw, cable losses, temperature and ageing. It does not establish compatibility with an inverter or motor; check minimum voltage, continuous current and timed surge. Doubling capacity doubles calculated energy under the same assumptions, but does not establish installation compatibility."}</p>
    <div className="action-row"><Link href="/compare?ids=renogy-mini-100,renogy-mini-200">{ro ? "Compară Core Mini 100 Ah și 200 Ah" : "Compare Core Mini 100 Ah and 200 Ah"} →</Link><Link href="/learn/battery-runtime-calculation">{ro ? "Formula și bugetul consumatorilor" : "Formula and appliance budget"} →</Link></div>
  </section>;
}

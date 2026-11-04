import { getRequestLocale } from "@/lib/i18n/request";
import BatteryCalculator from "@/app/calculators/battery/battery-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";
import Link from "@/components/localized-link";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return buildMetadata({
    locale,
    title: ro ? "Calculator capacitate baterie: Wh și Ah" : "Battery capacity calculator: Wh & Ah sizing",
    description: ro
      ? "Calculează capacitatea bateriei în Wh și Ah din consum, ore de rezervă, tensiune și pierderi. Vezi un exemplu și compară modele documentate."
      : "Size a battery bank in Wh and Ah from load, backup hours, voltage and losses. Follow a worked example, then compare documented battery models.",
    path: "/calculators/battery",
  });
}

export default async function BatteryPage() { const ro=await getRequestLocale()==="ro";
  return (
    <CalculatorPageShell
      title={ro?"Calculator baterie":"Battery calculator"}
      description={ro?"Estimează capacitatea nominală din consum, autonomie, tensiune, randament și fracția de descărcare.":"Estimate nominal battery-bank capacity from load power, autonomy time, system voltage, efficiency, and depth-of-discharge limits."}
      actions={[
        { href: "/calculators", label: ro ? "Înapoi la calculatoare" : "Back to calculators", variant: "secondary" },
        { href: "/calculators/fuse-selection", label: ro ? "Alege siguranța" : "Open fuse selection" },
      ]}
    >
      <BatteryCalculator ro={ro}/>
      <section className="content-panel" data-testid="battery-sizing-explainer" aria-labelledby="battery-sizing-example">
        <h2 id="battery-sizing-example">{ro ? "Cum transformi consumul în capacitatea bateriei" : "How load and backup hours become battery capacity"}</h2>
        <p>{ro
          ? "Energia la consumator este puterea în wați înmulțită cu timpul în ore. Împarte această energie la randamentul invertorului și la fracția utilizabilă a bateriei pentru a afla energia nominală minimă. Apoi împarte Wh la tensiunea nominală a bancului pentru Ah."
          : "Load energy is watts multiplied by hours. Divide it by inverter efficiency and the usable battery fraction to find minimum nominal energy. Then divide Wh by the bank's nominal voltage to obtain Ah."}</p>
        <p><strong>{ro ? "Exemplu ilustrativ, nu autonomie garantată:" : "Illustrative example, not guaranteed runtime:"}</strong> {ro
          ? "100 W timp de 4 ore înseamnă 400 Wh la consumator. Cu randament de 90% și 80% energie utilizabilă: 400 ÷ (0,90 × 0,80) ≈ 556 Wh nominali. La 12,8 V, rezultatul este aproximativ 43,4 Ah, înaintea rezervelor suplimentare."
          : "100 W for 4 hours requires 400 Wh at the load. With 90% efficiency and 80% usable energy: 400 ÷ (0.90 × 0.80) ≈ 556 nominal Wh. At 12.8 V, that is about 43.4 Ah before additional design reserve."}</p>
        <h3>{ro ? "Ce verifici înainte de alegerea modelului" : "What to check before choosing a model"}</h3>
        <p>{ro
          ? "Ah nu se compară fără tensiune. Clasa de 12 V și tensiunea nominală de 12,8 V nu sunt aceeași valoare; folosește datele bancului real. Verifică chimia, curentul BMS, vârful de pornire, temperaturile și încărcătorul. O baterie separată nu oferă o priză de 230 V: sunt necesare un invertor adecvat, protecții și un montaj corect."
          : "Ah cannot be compared without voltage. A 12 V system class and a 12.8 V nominal rating are different values; use the actual bank data. Check chemistry, BMS current, startup demand, temperatures and charging. A standalone battery has no 230 V socket: it needs a suitable inverter, protection and correct installation."}</p>
        <div className="action-row">
          <Link href="/marketplace/batteries/lifepo4">{ro ? "Explorează baterii LiFePO4" : "Browse LiFePO4 batteries"} →</Link>
          <Link href="/compare?ids=renogy-mini-100,renogy-mini-200">{ro ? "Compară Renogy Core Mini 100 / 200 Ah" : "Compare Renogy Core Mini 100 / 200 Ah"} →</Link>
          <Link href="/learn/battery-runtime-calculation">{ro ? "Înțelege autonomia reală" : "Understand real runtime"} →</Link>
        </div>
      </section>
    </CalculatorPageShell>
  );
}

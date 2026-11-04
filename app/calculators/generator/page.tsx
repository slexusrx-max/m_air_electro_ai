import { getRequestLocale } from "@/lib/i18n/request";
import GeneratorCalculator from "@/app/calculators/generator/generator-calculator";
import { CalculatorPageShell } from "@/components/calculators/calculator-page-shell";
import { buildMetadata } from "@/lib/metadata";
import Link from "@/components/localized-link";
import { catalog } from "@/lib/affiliate/catalog";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return buildMetadata({
    locale,
    title: ro ? "Calculator dimensionare generator: kW, kVA și pornire" : "Generator sizing calculator: kW, kVA & motor starts",
    description: ro
      ? "Estimează necesarul în kW și kVA din consum, factor de putere și pornirea motoarelor. Vezi exemple de calcul, limite și pașii alegerii generatorului."
      : "Estimate generator kW and kVA needs from running load, power factor and motor starts. Follow worked examples, sizing limits and equipment-selection steps.",
    path: "/calculators/generator",
  });
}

export default async function GeneratorPage() {
  const ro = await getRequestLocale() === "ro";
  const generatorModels = catalog.filter(product => product.kind === "product" && product.category === "generators");
  return (
    <CalculatorPageShell
      title={ro ? "Calculator dimensionare generator" : "Generator sizing calculator"}
      description={ro ? "Separă consumul continuu în kW de necesarul în kVA, aplică rezerva și evaluează orientativ pornirea motorului. Rezultatul este un buget de putere, nu o confirmare a unui model." : "Separate running kW from kVA demand, apply a reserve and screen a motor-start case. The result is a power budget, not approval of a particular generator."}
      actions={[
        { href: "/marketplace/generators", label: ro ? "Ghid de alegere a generatorului" : "Generator selection guidance", variant: "secondary" },
        { href: "/calculators/motor-current", label: ro ? "Calculează curentul motorului" : "Calculate motor current" },
      ]}
    >
      <GeneratorCalculator ro={ro} />
      <section className="content-panel space-y-5" data-testid="generator-sizing-explainer" aria-labelledby="generator-kw-kva">
        <h2 id="generator-kw-kva">{ro ? "kW versus kVA: de câtă putere ai nevoie?" : "kW vs kVA: how much generator capacity do you need?"}</h2>
        <p>{ro
          ? "Adună puterile electrice ale consumatorilor care funcționează simultan, inclusiv motorul analizat. kW reprezintă puterea activă; kVA reprezintă puterea aparentă. Pentru factorul de putere total PF, necesarul de funcționare este S = P ÷ PF. PF nu este randamentul motorului și nu descrie autonomia sau consumul de combustibil."
          : "Add the electrical input of loads that run simultaneously, including the motor being assessed. kW measures real power; kVA measures apparent power. With aggregate load power factor PF, running demand is S = P ÷ PF. PF is not motor efficiency and does not describe runtime or fuel consumption."}</p>
        <p>{ro
          ? "Verifică ambele valori de pe generator: puterea utilă în kW și capacitatea în kVA. De exemplu, un generator etichetat 10 kVA la PF nominal 0,8 are 8 kW la acel regim. Nu rezultă că poate alimenta 10 kW de consumatori. PF al sarcinii și PF nominal al generatorului sunt verificări distincte."
          : "Check both generator ratings: usable kW and kVA capacity. For example, a generator rated 10 kVA at a rated PF of 0.8 provides 8 kW at that rating. This does not establish that it can supply a 10 kW load. Load PF and the generator's rated PF are separate checks."}</p>
        <p>{ro
          ? "Rezerva r se aplică aici sarcinii continue: P cu rezervă = P × (1 + r/100), iar S cu rezervă = (P ÷ PF) × (1 + r/100). Ea nu înlocuiește verificarea pornirii, a temperaturii, altitudinii, fazelor sau a regimului continuu/standby. Alege procentul pentru proiectul real; nu există o rezervă unică potrivită tuturor instalațiilor."
          : "Reserve r is applied here to running demand: reserved P = P × (1 + r/100), and reserved S = (P ÷ PF) × (1 + r/100). It does not replace checking startup, temperature, altitude, phase arrangement or continuous/standby duty. Choose the percentage for the actual project; one reserve is not suitable for every installation."}</p>
      </section>
      <section className="content-panel space-y-5" data-testid="generator-worked-examples" aria-labelledby="generator-examples">
        <h2 id="generator-examples">{ro ? "Două exemple de dimensionare" : "Two generator sizing examples"}</h2>
        <h3>{ro ? "1. Consum rezistiv, fără motor" : "1. Resistive load, no motor"}</h3>
        <p>{ro
          ? "Cu 2 kW simultan, PF = 1, motor = 0 și rezervă = 25%: 2 ÷ 1 = 2 kVA în funcționare. Cu rezervă: 2 × 1,25 = 2,5 kW și 2,5 kVA. Calculatorul afișează bugetul de 2,5 kVA; nu afirmă că există sau că este aprobat un anumit model de 2,5 kVA."
          : "For 2 kW running load, PF = 1, motor = 0 and reserve = 25%: 2 ÷ 1 = 2 running kVA. With reserve: 2 × 1.25 = 2.5 kW and 2.5 kVA. The calculator displays a 2.5 kVA budget; it does not claim that a particular 2.5 kVA model exists or has been approved."}</p>
        <h3>{ro ? "2. Sarcină cu motor: exemplul simplificat al calculatorului" : "2. Motor load: the calculator's simplified example"}</h3>
        <p>{ro
          ? "Cu 6 kW simultan, inclusiv 1 kW de intrare electrică al motorului, PF = 0,8 și rezervă = 20%: sarcina este 7,5 kVA, sau 9 kVA și 7,2 kW cu rezervă. Pentru pornire directă, bugetul suplimentar ilustrativ este 1 × 4,5 = 4,5 kVA. Cazul de pornire devine 7,5 + 4,5 = 12 kVA. Maximul dintre 9 și 12 este 12 kVA. Rezerva nu se aplică încă o dată acestui caz de pornire."
          : "For 6 kW running load including 1 kW of motor electrical input, PF = 0.8 and reserve = 20%: demand is 7.5 kVA, or 9 kVA and 7.2 kW with reserve. For direct-on-line starting, the illustrative additional budget is 1 × 4.5 = 4.5 kVA. The start case is 7.5 + 4.5 = 12 kVA. The larger of 9 and 12 is 12 kVA. Reserve is not applied again to that start case."}</p>
        <p className="safety-note">{ro
          ? "Factorii suplimentari 4,5 / 2,2 / 1,2 kVA per kW electric pentru pornire directă / soft starter / VFD sunt ipoteze ilustrative ale acestui calculator. Nu sunt rapoarte universale ale curentului de pornire, date măsurate sau promisiuni ale producătorului. Rezultatul poate fi insuficient pentru un motor real; dimensionarea finală cere datele motorului și analiza tranzitorie a generatorului."
          : "The additional factors 4.5 / 2.2 / 1.2 kVA per electrical kW for DOL / soft starter / VFD are this calculator's illustrative assumptions. They are not universal starting-current ratios, measurements or manufacturer promises. The result may be insufficient for a real motor; final sizing needs motor data and generator transient analysis."}</p>
      </section>
      <section className="content-panel space-y-5" aria-labelledby="generator-motor-start">
        <h2 id="generator-motor-start">{ro ? "Pornirea motoarelor și limitele estimării" : "Motor starting and the limits of this estimate"}</h2>
        <p>{ro
          ? "Puterea în kW înscrisă pe un motor poate fi putere mecanică la arbore. Pentru acest calculator, folosește intrarea electrică: puterea mecanică împărțită la randament. Pentru o analiză a pornirii, pornește de la curentul și durata de pornire documentate; la monofazat S pornire = V × I pornire ÷ 1000, iar la trifazat echilibrat S pornire = √3 × V linie × I linie ÷ 1000."
          : "A motor's kW nameplate value may describe mechanical shaft output. This calculator needs electrical input: mechanical output divided by efficiency. For startup analysis, obtain documented starting current and duration; single-phase starting kVA = V × starting A ÷ 1000, and balanced three-phase starting kVA = √3 × line V × line A ÷ 1000."}</p>
        <p>{ro
          ? "Un soft starter depinde de limita de curent și de sarcina mecanică; un VFD poate introduce armonici. Niciunul nu garantează automat un generator mai mic. Verifică scăderea de tensiune și frecvență, durata accelerației, ordinea pornirii, simultaneitatea și dezechilibrul între faze cu furnizorul generatorului. Cerințele instalației rămân separate de simpla sumă a puterilor."
          : "A soft starter depends on its current limit and the mechanical load; a VFD can introduce harmonics. Neither automatically guarantees a smaller generator. Review voltage and frequency dip, acceleration time, start sequencing, simultaneous events and phase imbalance with the generator supplier. Installation requirements remain separate from simply adding power values."}</p>
        <div className="action-row">
          <Link href="/calculators/motor-current">{ro ? "Calculează curentul motorului" : "Calculate motor current"} →</Link>
          <Link href="/learn/industrial-motor-planning">{ro ? "Planificarea motoarelor și VFD" : "Motor and VFD planning"} →</Link>
          <Link href="/calculators/transformer">{ro ? "Sarcini prin transformator: dimensionare" : "Transformer-fed loads: transformer sizing"} →</Link>
          <Link href="/marketplace/generators">{ro ? "Criterii de alegere a generatorului" : "Generator selection criteria"} →</Link>
        </div>
        {generatorModels.length === 0 && <p className="small-copy">{ro ? "Catalogul oferă acum ghidare pentru generatoare, fără modele comerciale de generator verificate. Nu este publicată o ofertă de vânzare." : "The catalog currently provides generator guidance without verified commercial generator models. No generator sale offer is published."}</p>}
      </section>
      <section className="content-panel space-y-5" aria-labelledby="generator-backup-options">
        <h2 id="generator-backup-options">{ro ? "Generator cu combustibil sau stație cu baterii?" : "Fuel generator or battery power station?"}</h2>
        <p>{ro
          ? "Generatorul cu ardere produce energie cât permit combustibilul și condițiile de operare. Stația cu baterii stochează o cantitate finită de Wh și are o limită proprie de putere și pornire. Compară-le după durata întreruperii, sarcinile reale, amplasare și reîncărcare. Modelele PECRON de mai jos sunt stații cu baterii, nu generatoare cu ardere; comparația lor nu validează bugetul de pornire calculat aici."
          : "A combustion generator produces energy while fuel and operating conditions allow. A battery station stores finite Wh and has its own output and starting limits. Compare them by outage duration, actual loads, placement and recharging. The PECRON models below are battery stations, not combustion generators; comparing them does not validate the startup budget calculated here."}</p>
        <div className="action-row">
          <Link href="/learn/generator-vs-battery-backup">{ro ? "Ghid: generator sau baterie" : "Guide: generator vs battery"} →</Link>
          <Link href="/compare?ids=pecron-e1000lfp,pecron-e1500lfp">{ro ? "Compară alternativele cu baterii PECRON E1000LFP / E1500LFP" : "Compare battery alternatives: PECRON E1000LFP / E1500LFP"} →</Link>
          <Link href="/marketplace/backup-power">{ro ? "Stații portabile cu baterii" : "Portable battery power stations"} →</Link>
        </div>
      </section>
      <section className="content-panel space-y-5" aria-labelledby="generator-safety-sources">
        <h2 id="generator-safety-sources">{ro ? "Amplasare sigură și surse tehnice" : "Safe placement and technical sources"}</h2>
        <p>{ro
          ? "Folosește generatoarele cu ardere numai afară, departe de uși, ferestre și prize de ventilație; niciodată în locuință sau garaj. Gazele de ardere pot provoca intoxicație fatală cu monoxid de carbon. Nu alimenta instalația casei printr-o priză: un transfer și protecțiile proiectate de un specialist trebuie să prevină alimentarea inversă a rețelei. Urmează manualul și cerințele locale de instalare."
          : "Operate combustion generators outdoors, away from doors, windows and air intakes; never inside a home or garage. Exhaust can cause fatal carbon monoxide poisoning. Never feed house wiring through a socket: a professionally designed transfer arrangement and protection must prevent backfeeding the grid. Follow the manual and local installation requirements."}</p>
        <ul className="list-disc space-y-2 pl-5">
          <li><a href="https://www.generac.com/globalassets/pdfs/industrial/whitepapers/basic-sizing-for-mobile-generators.pdf" target="_blank" rel="noopener noreferrer">Generac — Basic Sizing for Mobile Generators</a></li>
          <li><a href="https://www.generac.com/globalassets/pdfs/industrial/whitepapers/sizing-considerations-for-comm-and-ind-gens.pdf" target="_blank" rel="noopener noreferrer">Generac — Sizing Considerations for Commercial and Industrial Generators</a></li>
          <li><a href="https://www.cpsc.gov/s3fs-public/Portable-Generator-Safety-Alert-2017_5123.pdf" target="_blank" rel="noopener noreferrer">CPSC — Portable Generator Hazards</a></li>
        </ul>
      </section>
    </CalculatorPageShell>
  );
}

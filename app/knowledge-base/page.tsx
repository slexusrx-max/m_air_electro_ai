import Link from "next/link";
import { PlatformShell } from "@/components/platform-shell";
import { getRequestDictionary } from "@/lib/i18n/request";
import { commercialCopy } from "@/lib/marketplace/copy";
import { buildMetadata } from "@/lib/metadata";
export const metadata = buildMetadata({
  title: "Ghid de selecție: baterii, invertoare și solar",
  description:
    "Explicații independente despre energie, putere de vârf și compatibilitatea unui sistem de rezervă.",
  path: "/knowledge-base",
});
const guides = [
  {
    category: "lithium-batteries",
    ro: [
      "Câtă energie trebuie să stocheze bateria?",
      "Wații (W) descriu puterea instantanee; watt-oră (Wh) descriu energia. Un consum de 500 W timp de 4 ore cere 2.000 Wh la consumatori. Cu un randament de 92% și descărcare utilă de 80%, bateria nominală necesară este 2.000 ÷ 0,92 ÷ 0,80 = aproximativ 2.717 Wh.",
      "Capacitatea în Ah nu se compară fără tensiune: 100 Ah la 12,8 V înseamnă 1.280 Wh. Verifică energia utilizabilă, curentul continuu și de vârf al BMS-ului și temperatura permisă pentru încărcare. Nu presupune că două baterii pot fi conectate în serie: manualul trebuie să permită configurația.",
      "Orele fiecărui aparat contează. Un frigider nu consumă permanent puterea înscrisă pe etichetă. Folosește energie măsurată pe un ciclu reprezentativ; păstrează separat rezerva pentru pornirea compresorului.",
    ],
    en: [
      "How much energy should a battery store?",
      "Watts (W) describe instantaneous power; watt-hours (Wh) describe energy. A 500 W load for 4 hours needs 2,000 Wh at the appliances. With 92% efficiency and 80% usable discharge, nominal storage is 2,000 ÷ 0.92 ÷ 0.80 = about 2,717 Wh.",
      "Amp-hours cannot be compared without voltage: 100 Ah at 12.8 V is 1,280 Wh. Check usable energy, continuous and surge BMS current, and permitted charging temperature. Do not assume batteries support series connection; the manual must explicitly allow it.",
      "Each appliance’s operating hours matter. A refrigerator does not continuously draw its label power. Use energy measured over a representative cycle and separately allow for compressor starting power.",
    ],
  },
  {
    category: "inverters",
    ro: [
      "Puterea invertorului și pornirea motoarelor",
      "Adună puterile aparatelor care funcționează simultan. Pentru o primă estimare folosim 25% rezervă continuă. La 500 W, rezultatul rotunjit în sus la 100 W este 700 W. Această rezervă nu înlocuiește verificarea temperaturii de funcționare sau a regimului de sarcină.",
      "Vârful de pornire are o durată, nu doar o valoare în W. Compară curentul de pornire al motorului și durata lui cu specificația invertorului. Formula noastră de vârf este conservatoare și presupune porniri simultane; consultă datele aparatelor pentru a ajusta scenariul.",
      "Verifică tensiunea DC a bateriei, ieșirea AC potrivită aparatelor și forma de undă. Un invertor de 1.000 W alimentat la 12,8 V și 92% randament poate cere aproximativ 85 A. Cablurile, siguranțele și BMS-ul trebuie dimensionate pentru întregul circuit.",
    ],
    en: [
      "Inverter output and motor starting",
      "Add the loads that run simultaneously. Our starting estimate uses 25% continuous reserve. At 500 W, rounding upward to 100 W gives 700 W. This allowance does not replace operating-temperature and duty-cycle checks.",
      "Starting surge has a duration, not just a wattage. Compare motor starting demand and duration against the inverter specification. Our surge formula conservatively assumes simultaneous starts; consult appliance data to refine the scenario.",
      "Check battery DC voltage, suitable AC output and waveform. A 1,000 W inverter at 12.8 V and 92% efficiency can draw about 85 A. Wiring, fuses and the BMS must support the entire circuit.",
    ],
  },
  {
    category: "solar-panels",
    ro: [
      "Panouri, regulator și încărcare alternativă",
      "Puterea înscrisă pe panou este măsurată în condiții de test. Producția reală depinde de anotimp, umbrire, orientare, temperatură și amplasament. Nu promitem autonomie zilnică doar prin împărțirea energiei la puterea nominală a panourilor.",
      "Configuratorul folosește un scenariu de 3,5 ore solare echivalente și factor de 0,80 pentru pierderi, separat de randamentul invertorului. Pentru 2 kWh la consumatori rezultă aproximativ 0,8 kW de panouri. Acesta nu este un studiu de producție pentru o adresă din România și poate fi insuficient iarna.",
      "Tensiunea în gol a panourilor, inclusiv creșterea la frig, trebuie să rămână sub limita regulatorului. Verifică și curentul de intrare, puterea admisă la tensiunea bateriei și profilul de încărcare. Pentru perioade fără soare, planifică încărcare compatibilă de la rețea sau generator.",
    ],
    en: [
      "Panels, charge controller and alternative charging",
      "Panel nameplate output is measured under test conditions. Actual generation depends on season, shade, orientation, temperature and location. Daily autonomy cannot be promised simply by dividing energy by panel nameplate power.",
      "The planner uses a scenario of 3.5 equivalent sun hours and a 0.80 system derating factor, separately from inverter efficiency. For 2 kWh at appliances this gives about 0.8 kW of panels. This is not a yield study for a Romanian address and may be inadequate in winter.",
      "Panel open-circuit voltage, including its rise in cold conditions, must stay below the controller limit. Also check input current, permitted power at the battery voltage and charging profile. Plan compatible mains or generator charging for periods without sun.",
    ],
  },
];
export default async function Page() {
  const c = commercialCopy(await getRequestDictionary());
  return (
    <PlatformShell>
      <main className="mx-auto max-w-4xl space-y-7">
        <section className="brand-glass-card rounded-3xl p-7">
          <p className="eyebrow">
            M Air • {c.ro ? "Ghid independent" : "Independent guide"}
          </p>
          <h1 className="mt-3 text-4xl font-bold">
            {c.ro
              ? "De la consum la un sistem compatibil"
              : "From power demand to a compatible system"}
          </h1>
          <p className="mt-4 leading-7">
            {c.ro
              ? "Trei verificări înainte de cumpărare: energia bateriei, puterea invertorului și încărcarea. Exemplele explică formulele calculatoarelor noastre."
              : "Three checks before buying: battery energy, inverter output and charging. Examples explain the formulas used in our calculators."}
          </p>
        </section>
        {guides.map((g) => {
          const [title, ...body] = c.ro ? g.ro : g.en;
          return (
            <article className="info-card" key={g.category}>
              <h2>{title}</h2>
              {body.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <Link
                className="button-outline mt-5"
                href={"/marketplace/category/" + g.category}
              >
                {c.ro ? "Compară echipamentele" : "Compare equipment"} →
              </Link>
            </article>
          );
        })}
        <p className="rounded-xl bg-amber-50 p-5 leading-7">{c.safety}</p>
        <div className="flex flex-wrap gap-3">
          <Link className="button-primary" href="/marketplace/find-my-solution">
            {c.finder}
          </Link>
          <Link className="button-outline" href="/backup-calculator">
            {c.backup}
          </Link>
          <Link className="button-outline" href="/affiliate-disclosure">
            {c.disclosure}
          </Link>
        </div>
      </main>
    </PlatformShell>
  );
}

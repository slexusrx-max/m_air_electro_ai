import type { Entry } from "./catalog-data";
import { bilingual as b } from "./content";

type PowerStation = {
  id: string; name: string; provider: "pecron-eu" | "bluetti-eu";
  wh: number; watts: number; url: string;
};
const powerStations: PowerStation[] = [
  { id: "pecron-e1500lfp", name: "PECRON E1500LFP", provider: "pecron-eu", wh: 1536, watts: 2200,
    url: "https://eu.pecron.com/products/e1500lfp-power-station-2200w-1536wh" },
  { id: "pecron-e2400lfp", name: "PECRON E2400LFP", provider: "pecron-eu", wh: 2048, watts: 2400,
    url: "https://eu.pecron.com/products/pecron-e2400lfp-power-station-2400w-2048wh" },
  { id: "pecron-f3000lfp", name: "PECRON F3000LFP", provider: "pecron-eu", wh: 3072, watts: 3600,
    url: "https://eu.pecron.com/products/pecron-f3000lfp-portable-power-station" },
  { id: "bluetti-elite-100-v2", name: "BLUETTI Elite 100 V2", provider: "bluetti-eu", wh: 1024, watts: 1800,
    url: "https://www.bluettipower.eu/products/elite-100-v2-portable-power-station" },
  { id: "bluetti-elite-200-v2", name: "BLUETTI Elite 200 V2", provider: "bluetti-eu", wh: 2073.6, watts: 2600,
    url: "https://www.bluettipower.eu/products/elite-200-v2-portable-power-station" },
  { id: "bluetti-apex-300", name: "BLUETTI Apex 300", provider: "bluetti-eu", wh: 2764.8, watts: 3840,
    url: "https://www.bluettipower.eu/products/apex-300-home-battery-backup" },
];

const waterSystems = [
  { id: "waterdrop-g3p600", name: "Waterdrop G3P600", gpd: 600, ratio: "2:1",
    url: "https://www.waterdropfilter.de/en/products/g3p600-waterdrop-umkehrosmose-wasserfilteranlage" },
  { id: "waterdrop-g3p800", name: "Waterdrop G3P800", gpd: 800, ratio: "3:1",
    url: "https://www.waterdropfilter.de/en/products/umkehrosmoseanlage-g3p800" },
  { id: "waterdrop-x12", name: "Waterdrop X12", gpd: 1200, ratio: "3:1",
    url: "https://www.waterdropfilter.de/en/products/umkehrosmose-wasserfilter-x12" },
];

/** AI-assisted official EU source check, not hands-on testing or human technical approval. */
export const supplierProducts: Entry[] = [
  ...powerStations.map((p): Entry => ({
    id: p.id, slug: p.id, kind: "product", provider: p.provider, sourceCheckedAt: "2026-10-12",
    title: b(p.name, p.name), category: "backup-power", paths: ["backup-power"], url: p.url,
    summary: b(
      `${p.name} combines ${p.wh} Wh of stated battery capacity with ${p.watts} W rated AC output. Compare storage and output separately: a higher watt rating does not by itself provide longer runtime.`,
      `${p.name} combină capacitatea declarată de ${String(p.wh).replace(".", ",")} Wh cu ieșirea AC nominală de ${p.watts} W. Compară separat energia și puterea: mai mulți wați nu înseamnă automat autonomie mai mare.`,
    ),
    bestFor: b("Comparing plug-in backup for selected household or travel loads within the model's documented limits.", "Compararea rezervei pentru consumatori individuali de acasă sau din călătorii, în limitele documentate ale modelului."),
    limitations: b("Values describe the base station, not an expanded bundle. Delivered AC energy is lower than stored energy. Starting loads, transfer behaviour and accessory compatibility need separate checks; medical or uninterrupted operation is not established.", "Valorile descriu stația de bază, nu un pachet extins. Energia AC livrată este mai mică decât energia stocată. Pornirea consumatorilor, transferul și accesoriile necesită verificări separate; utilizarea medicală sau neîntreruptă nu este confirmată."),
    compatibility: b("Select the EU socket variant and check the exact manual for AC voltage, solar input limits, earthing and accessories. Do not feed house wiring through a socket. Fixed-circuit backup requires a qualified installer and appropriate transfer protection.", "Selectează varianta cu prize UE și verifică manualul exact pentru tensiunea AC, limitele intrării solare, împământare și accesorii. Nu alimenta instalația casei printr-o priză. Rezerva circuitelor fixe necesită instalator calificat și protecție adecvată la transfer."),
    facets: { capacityWh: String(p.wh), power: String(p.watts), application: "Backup" },
    specs: { "Stored energy": `${p.wh} Wh`, "Rated AC output": `${p.watts} W` },
  })),
  ...waterSystems.map((p): Entry => ({
    id: p.id, slug: p.id, kind: "product", provider: "waterdrop-eu", sourceCheckedAt: "2026-10-12",
    title: b(p.name, p.name), category: "water",
    paths: ["water", "water/home-purification", "water/reverse-osmosis", "water/under-sink"], url: p.url,
    summary: b(
      `${p.name} is an electrically powered, tankless under-sink reverse-osmosis system. The manufacturer's EU page lists ${p.gpd} GPD nominal production and a ${p.ratio} purified-water-to-drain ratio; these are stated ratings, not a guarantee at your tap.`,
      `${p.name} este un sistem electric de osmoză inversă, fără rezervor, montat sub chiuvetă. Pagina UE a producătorului declară ${p.gpd} GPD și un raport apă purificată/evacuată de ${p.ratio}; sunt valori nominale, nu o garanție la robinetul tău.`,
    ),
    bestFor: b("Comparing indoor drinking-water systems where under-sink space, electrical power and a drain connection are available.", "Compararea sistemelor de apă pentru băut, la interior, cu spațiu sub chiuvetă, electricitate și racord la evacuare."),
    limitations: b("Not a whole-house filter or a non-electric emergency purifier. Output depends on inlet conditions and filter condition. No contaminant-reduction percentage, independent certification or safe-water guarantee is asserted in this listing.", "Nu este filtru pentru întreaga locuință sau purificator de urgență fără electricitate. Producția depinde de apa de intrare și de starea filtrelor. Listarea nu afirmă procente de reducere a contaminanților, certificare independentă sau garanția potabilității."),
    compatibility: b("Check source-water analysis, inlet pressure and temperature, cabinet dimensions, faucet, power adapter and drain requirements in the exact model manual. Confirm replacement-cartridge codes and Romania availability with the merchant before purchase.", "Verifică analiza apei, presiunea și temperatura de intrare, dimensiunile dulapului, robinetul, adaptorul electric și evacuarea în manualul modelului exact. Confirmă codurile cartușelor de schimb și disponibilitatea în România la comerciant înainte de cumpărare."),
    facets: {},
    specs: { "Nominal production": `${p.gpd} GPD`, "Purified water to drain": p.ratio,
      "Tehnologie / Technology": "RO", "Electricitate / Electricity": "Necesară / Required",
      "Instalare / Installation": "Sub chiuvetă, interior / Under-sink, indoor" },
  })),
];

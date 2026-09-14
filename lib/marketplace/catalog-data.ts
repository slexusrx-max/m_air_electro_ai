import type { CatalogProduct, ProductCategory } from "@/lib/affiliate/types";
import { bilingual as b, type LocalText } from "@/lib/marketplace/content";

export type Equipment = CatalogProduct & {
  kind: "product" | "equipment-class";
  paths: string[];
  title: LocalText;
  summary: LocalText;
  bestFor: LocalText;
  limitations: LocalText;
  compatibility: LocalText;
  facets: Record<string, string>;
  sourceUrls: string[];
  model?: string;
};
type Entry = {
  id: string;
  slug: string;
  title: LocalText;
  category: ProductCategory;
  paths: string[];
  summary: LocalText;
  bestFor: LocalText;
  limitations: LocalText;
  compatibility: LocalText;
  facets: Record<string, string>;
  url?: string;
  kind?: "product" | "equipment-class";
  specs?: Record<string, string>;
};
function item(e: Entry): Equipment {
  const kind = e.kind ?? "equipment-class";
  return {
    ...e,
    kind,
    name: e.title.en,
    brand: kind === "product" ? "Renogy" : "Equipment class",
    model: kind === "product" ? e.title.en : undefined,
    description: e.summary.en,
    image: null,
    price: null,
    currency: "EUR",
    originalPrice: null,
    availability: "partner-check",
    provider: e.url ? "renogy" : "other",
    merchant: e.url ? "Renogy EU" : "No supplier selected",
    merchantRegion: "EU",
    productUrl: e.url ?? "",
    affiliateUrl: e.url ?? "",
    technicalSpecs: e.specs ?? {},
    tags: [...e.paths, ...Object.values(e.facets)],
    featured: true,
    lastUpdated: kind === "product" ? "2026-09-14" : "2026-09-13",
    recommendedFor: [e.bestFor.en],
    compatibilityNotes: e.compatibility.en,
    whyRecommended: e.summary.en,
    sourceUrls: e.url ? [e.url] : [],
  };
}
const batteryCompat = b(
  "Check charger profile, BMS current and approved battery grouping. At 2 kW, a 12.8 V bank may need over 170 A after conversion losses; a 100 A BMS is insufficient for that continuous load.",
  "Verifică profilul încărcătorului, curentul BMS și gruparea permisă. La 2 kW, un banc de 12,8 V poate necesita peste 170 A cu pierderile de conversie; un BMS de 100 A nu ajunge pentru această sarcină continuă.",
);
export const equipment: Equipment[] = [
  item({
    id: "renogy-mini-100",
    slug: "renogy-core-mini-100ah",
    kind: "product",
    title: b(
      "Renogy Core Mini 12.8 V 100 Ah",
      "Renogy Core Mini 12,8 V 100 Ah",
    ),
    category: "lithium-batteries",
    paths: [
      "batteries",
      "batteries/lifepo4",
      "batteries/12v",
      "batteries/100ah",
    ],
    summary: b(
      "Compact lithium storage with documented 100 A maximum discharge rating. Evaluate it for modest DC and AC loads rather than selecting by Ah alone.",
      "Stocare compactă cu curent maxim de descărcare documentat de 100 A. Potrivită de evaluat pentru consumuri moderate DC și AC, nu doar după Ah.",
    ),
    bestFor: b(
      "RV house loads and modest essential-load backup.",
      "Consumatori de servicii în rulotă și rezervă pentru sarcini moderate.",
    ),
    limitations: b(
      "Not a stand-alone 2 kW continuous battery source. Charging below the specified temperature range is not allowed.",
      "Nu alimentează singură 2 kW continuu. Încărcarea sub intervalul de temperatură specificat nu este permisă.",
    ),
    compatibility: batteryCompat,
    facets: {
      voltage: "12",
      capacityAh: "100",
      capacityWh: "1280",
      chemistry: "LiFePO4",
      application: "RV",
    },
    specs: {
      "Nominal voltage": "12.8 V",
      Capacity: "100 Ah",
      "Stored energy (V × Ah)": "1280 Wh",
      "Maximum discharge": "100 A",
      Chemistry: "LiFePO4",
    },
    url: "https://eu.renogy.com/products/core-mini-12-8v-100ah-lithium-iron-phosphate-battery",
  }),
  item({
    id: "renogy-mini-200",
    slug: "renogy-core-mini-200ah",
    kind: "product",
    title: b("Renogy Core Mini 12 V 200 Ah", "Renogy Core Mini 12 V 200 Ah"),
    category: "lithium-batteries",
    paths: ["batteries", "batteries/lifepo4", "batteries/12v"],
    summary: b(
      "A higher-capacity member of the Core Mini family for users prioritising longer autonomy. Verify the exact model manual before combining it with other batteries.",
      "Variantă Core Mini cu capacitate mai mare pentru autonomie prelungită. Verifică manualul exact înainte de combinarea cu alte baterii.",
    ),
    bestFor: b(
      "Longer RV stays and compact solar storage.",
      "Staționări prelungite cu rulota și stocare solară compactă.",
    ),
    limitations: b(
      "Capacity alone does not establish inverter compatibility or permission to connect batteries in series.",
      "Capacitatea nu stabilește compatibilitatea cu invertorul sau permisiunea legării în serie.",
    ),
    compatibility: batteryCompat,
    facets: {
      voltage: "12",
      capacityAh: "200",
      chemistry: "LiFePO4",
      application: "RV",
    },
    specs: {
      "Voltage class": "12 V",
      Capacity: "200 Ah",
      Chemistry: "LiFePO4",
    },
    url: "https://eu.renogy.com/products/core-mini-12-8v-200ah-lifepo4-battery-w-low-temperature-protection",
  }),
  item({
    id: "renogy-panel-200",
    slug: "renogy-n-type-200w",
    kind: "product",
    title: b(
      "Renogy 16BB N-Type 200 W rigid panel",
      "Panou rigid Renogy 16BB N-Type 200 W",
    ),
    category: "solar-panels",
    paths: ["solar", "solar/panels", "solar/panels/rigid"],
    summary: b(
      "A framed 200 W module with 37.44 V open-circuit voltage at standard test conditions. That input voltage matters more than a nominal battery-system label when choosing a controller.",
      "Modul cu ramă de 200 W și tensiune în gol de 37,44 V în condiții standard. Această tensiune contează la alegerea regulatorului mai mult decât clasa bateriei.",
    ),
    bestFor: b(
      "Fixed mounts with suitable structural support and a matched MPPT controller.",
      "Montaj fix cu suport structural și regulator MPPT compatibil.",
    ),
    limitations: b(
      "Not a portable folding panel. Nameplate output is measured under test conditions, not a daily-yield promise.",
      "Nu este panou pliabil portabil. Puterea nominală este măsurată în condiții de test, nu garantează producția zilnică.",
    ),
    compatibility: b(
      "Use cold-corrected array Voc and total input current to check controller limits. Never connect a panel directly to a battery.",
      "Verifică limitele regulatorului cu Voc corectată la rece și curentul total. Nu conecta panoul direct la baterie.",
    ),
    facets: {
      power: "200",
      format: "rigid",
      application: "Off-grid",
      voltage: "24",
    },
    specs: {
      "Rated power (STC)": "200 W",
      "Open-circuit voltage (STC)": "37.44 V",
      "Operating voltage (STC)": "31.03 V",
      "Short-circuit current (STC)": "6.85 A",
      Weight: "10.6 kg",
      Format: "Rigid",
    },
    url: "https://eu.renogy.com/products/renogy-16bb-n-type-200-watt-24v-solar-panel",
  }),
  item({
    id: "renogy-inverter-1000",
    slug: "renogy-pure-sine-1000w",
    kind: "product",
    title: b(
      "Renogy 12 V 1000 W pure sine inverter",
      "Invertor Renogy 12 V 1000 W sinus pur",
    ),
    category: "inverters",
    paths: ["inverters", "inverters/pure-sine"],
    summary: b(
      "A 1 kW inverter for a 12 V bank. Confirm the selected EU variant, socket format and transfer behaviour on the supplier page before purchase.",
      "Invertor de 1 kW pentru banc de 12 V. Confirmă varianta UE, prizele și comportamentul la transfer pe pagina furnizorului.",
    ),
    bestFor: b(
      "Small AC appliances within the documented continuous and starting limits.",
      "Aparate AC mici, în limitele documentate de funcționare și pornire.",
    ),
    limitations: b(
      "Not a whole-home supply and not automatically suitable for medical or no-break loads.",
      "Nu este sursă pentru întreaga casă și nu este automat potrivit pentru aparatură medicală sau sarcini fără întrerupere.",
    ),
    compatibility: b(
      "Check the manual for input current, DC protection, earthing and transfer time. A transfer function does not by itself establish a battery charger function.",
      "Verifică în manual curentul, protecția DC, împământarea și timpul de transfer. Funcția de transfer nu implică automat încărcarea bateriei.",
    ),
    facets: {
      power: "1000",
      voltage: "12",
      waveform: "pure-sine",
      application: "Backup",
    },
    specs: {
      "Continuous output": "1000 W",
      "DC input class": "12 V",
      Waveform: "Pure sine",
    },
    url: "https://eu.renogy.com/products/1000w-12v-pure-sine-wave-inverter-with-ups-function",
  }),
  item({
    id: "renogy-dcc50",
    slug: "renogy-dcc50s-mppt",
    kind: "product",
    title: b(
      "Renogy 12 V 50 A DC-DC + MPPT",
      "Renogy 12 V 50 A DC-DC + MPPT",
    ),
    category: "chargers",
    paths: ["chargers", "chargers/dc-dc"],
    summary: b(
      "Dual-source battery charging for a mobile system using alternator and solar inputs. Review how simultaneous sources share the output limit.",
      "Încărcare din două surse pentru sistem mobil, cu intrări de alternator și solar. Verifică împărțirea limitei de ieșire între surse.",
    ),
    bestFor: b(
      "RV house batteries with a suitable alternator and PV input.",
      "Baterii de servicii pentru rulotă, cu alternator și intrare PV compatibile.",
    ),
    limitations: b(
      "Not a mains AC charger. The solar input is not interchangeable with every high-voltage panel string.",
      "Nu este încărcător de la rețeaua AC. Intrarea solară nu acceptă orice șir de panouri cu tensiune mare.",
    ),
    compatibility: b(
      "Confirm source voltage, PV Voc limit, ignition signalling, battery profile and alternator thermal margin in the exact revision manual.",
      "Confirmă tensiunea sursei, limita Voc PV, semnalul de contact, profilul bateriei și rezerva termică a alternatorului în manualul versiunii exacte.",
    ),
    facets: {
      voltage: "12",
      current: "50",
      controllerType: "MPPT",
      application: "RV",
    },
    specs: {
      "Battery voltage class": "12 V",
      "Charge current class": "50 A",
      "Solar control": "MPPT",
      Sources: "Alternator + solar",
    },
    url: "https://eu.renogy.com/products/dcc50s-12v-50a-dc-dc-on-board-battery-charger-with-mppt-new-version",
  }),
];
const classes: [
  string,
  string,
  LocalText,
  ProductCategory,
  string[],
  LocalText,
  LocalText,
  LocalText,
  Record<string, string>,
][] = [
  [
    "battery-lfp-100",
    "lfp-battery-12v-100ah-class",
    b("12 V 100 Ah LiFePO4 battery class", "Clasă baterie LiFePO4 12 V 100 Ah"),
    "lithium-batteries",
    ["batteries", "batteries/lifepo4", "batteries/12v", "batteries/100ah"],
    b(
      "A planning envelope for compact storage; actual nominal voltage and discharge limits come from the chosen model.",
      "Clasă de planificare pentru stocare compactă; tensiunea nominală și limitele vin din modelul ales.",
    ),
    b("Compact mobile systems", "Sisteme mobile compacte"),
    b(
      "Not a specific purchasable model; no Bluetooth or heating capability is assumed.",
      "Nu este model comercial specific; Bluetooth și încălzirea nu sunt presupuse.",
    ),
    {
      voltage: "12",
      capacityAh: "100",
      chemistry: "LiFePO4",
      application: "RV",
    },
  ],
  [
    "inverter-2000",
    "pure-sine-inverter-2000w",
    b("2000 W pure sine inverter class", "Clasă invertor sinus pur 2000 W"),
    "inverters",
    ["inverters", "inverters/pure-sine", "inverters/2000w"],
    b(
      "A 2 kW AC planning class. Compare 12, 24 and 48 V architectures before committing to the battery bank.",
      "Clasă de planificare AC de 2 kW. Compară arhitecturile de 12, 24 și 48 V înaintea alegerii bancului.",
    ),
    b("Essential AC circuits", "Circuite AC esențiale"),
    b(
      "Surge rating, charger function and input voltage remain model-specific.",
      "Vârful, încărcătorul și tensiunea de intrare depind de model.",
    ),
    { power: "2000", waveform: "pure-sine", application: "Backup" },
  ],
  [
    "solar-kit-400",
    "portable-solar-kit-400w",
    b("400 W solar kit class", "Clasă kit solar 400 W"),
    "solar-kits",
    ["solar", "solar/kits"],
    b(
      "An array-size starting point for a mobile energy budget. Kit contents must be checked individually.",
      "Punct de plecare pentru puterea solară într-un buget mobil. Componentele kitului trebuie verificate separat.",
    ),
    b("RV and seasonal cabins", "Rulote și cabane sezoniere"),
    b(
      "400 W is peak array rating, not continuous charging or battery capacity.",
      "400 W este puterea nominală a panourilor, nu încărcare continuă sau capacitate a bateriei.",
    ),
    { power: "400", application: "RV" },
  ],
  [
    "controller-mppt",
    "mppt-controller-class",
    b("MPPT controller class", "Clasă regulator MPPT"),
    "charge-controllers",
    ["solar", "solar/controllers"],
    b(
      "A controller role that tracks the array operating point while charging a compatible battery.",
      "Regulator care urmărește punctul de funcționare al panourilor și încarcă o baterie compatibilă.",
    ),
    b(
      "Arrays with a suitable voltage margin",
      "Panouri cu rezervă de tensiune adecvată",
    ),
    b(
      "Input voltage and output current are not specified until a model is selected.",
      "Tensiunea de intrare și curentul de ieșire se stabilesc la alegerea modelului.",
    ),
    { controllerType: "MPPT", application: "Off-grid" },
  ],
  [
    "portable-panel",
    "portable-panel-200w-class",
    b("200 W portable panel class", "Clasă panou portabil 200 W"),
    "solar-panels",
    ["solar", "solar/panels", "solar/panels/portable"],
    b(
      "Deployable generation that can be moved to avoid local shade; plan connector and extension-cable losses.",
      "Producție mobilă ce poate evita umbra; ia în calcul conectorii și pierderile prelungitorului.",
    ),
    b("Camping and temporary setups", "Camping și instalații temporare"),
    b(
      "Weather resistance and folding life must be verified per model.",
      "Rezistența la intemperii și pliere se verifică pentru fiecare model.",
    ),
    { power: "200", format: "portable", application: "RV" },
  ],
  [
    "flexible-panel",
    "flexible-panel-200w-class",
    b("200 W flexible panel class", "Clasă panou flexibil 200 W"),
    "solar-panels",
    ["solar", "solar/panels", "solar/panels/flexible"],
    b(
      "A low-profile array option where a framed panel cannot be mounted. Surface cooling and adhesive compatibility are critical.",
      "Opțiune cu profil redus unde nu încape un panou cu ramă. Răcirea și compatibilitatea adezivului sunt esențiale.",
    ),
    b(
      "Approved curved mounting surfaces",
      "Suprafețe curbe de montaj aprobate",
    ),
    b(
      "Not every panel can be walked on or bent in both directions.",
      "Nu orice panou suportă mersul pe el sau curbarea în ambele direcții.",
    ),
    { power: "200", format: "flexible", application: "Marine" },
  ],
  [
    "backup-essential",
    "essential-load-backup",
    b(
      "Essential-load backup system",
      "Sistem de rezervă pentru consumatori esențiali",
    ),
    "backup-power",
    ["backup-power"],
    b(
      "A system class combining storage, AC conversion and a defined transfer arrangement.",
      "Clasă de sistem cu stocare, conversie AC și metodă de transfer definită.",
    ),
    b(
      "Apartment or home essentials",
      "Consumatori esențiali în apartament sau casă",
    ),
    b(
      "Not a certified package or a guarantee of uninterrupted power.",
      "Nu este pachet certificat sau garanție de alimentare neîntreruptă.",
    ),
    { application: "Backup" },
  ],
  [
    "marine-dc",
    "marine-dc-power-system",
    b("Marine DC distribution class", "Clasă distribuție DC navală"),
    "marine-electrical",
    ["marine"],
    b(
      "House-bank distribution, charging and monitoring treated as one vessel-specific system.",
      "Distribuția bancului de servicii, încărcarea și monitorizarea ca sistem specific navei.",
    ),
    b(
      "Vessel house electrical planning",
      "Planificarea circuitelor de servicii ale navei",
    ),
    b(
      "No marine certification or corrosion rating is implied for an individual component.",
      "Nu se presupune certificare navală sau rezistență la coroziune pentru componente.",
    ),
    { application: "Marine" },
  ],
  [
    "dc-protection",
    "dc-wiring-and-protection",
    b("DC wiring and protection class", "Clasă cabluri și protecție DC"),
    "electrical-accessories",
    ["electrical-components"],
    b(
      "Cables, terminals, disconnects and fuses selected as a coordinated current path.",
      "Cabluri, borne, separatoare și siguranțe selectate ca circuit coordonat.",
    ),
    b("Battery and inverter connections", "Conexiuni baterie și invertor"),
    b(
      "A fuse current rating alone does not establish adequate DC interrupting capacity.",
      "Curentul nominal al siguranței nu stabilește capacitatea de rupere DC.",
    ),
    { application: "Backup" },
  ],
  [
    "generator-hybrid",
    "generator-battery-system",
    b("Generator + battery system class", "Clasă sistem generator + baterie"),
    "generators",
    ["generators"],
    b(
      "A generator replenishes storage during extended low-solar periods while batteries supply shorter quiet intervals.",
      "Generatorul reîncarcă stocarea când soarele lipsește, iar bateriile alimentează intervalele liniștite.",
    ),
    b("Cabins and longer backup periods", "Cabane și rezervă de durată"),
    b(
      "Requires safe outdoor generator siting and an engineered transfer scheme.",
      "Necesită amplasarea sigură în exterior și schemă de transfer proiectată.",
    ),
    { application: "Off-grid" },
  ],
];
for (const [
  id,
  slug,
  title,
  category,
  paths,
  summary,
  bestFor,
  limitations,
  facets,
] of classes)
  equipment.push(
    item({
      id,
      slug,
      title,
      category,
      paths,
      summary,
      bestFor,
      limitations,
      facets,
      compatibility:
        category === "lithium-batteries"
          ? batteryCompat
          : b(
              "Confirm the exact manufacturer's manual, electrical ratings, protection and installation conditions before combining components. Equipment classes are procurement briefs, not compatibility guarantees.",
              "Confirmă manualul exact, valorile electrice, protecția și condițiile de montaj înainte de combinarea componentelor. Clasele de echipamente sunt cerințe de achiziție, nu garanții de compatibilitate.",
            ),
      specs: Object.fromEntries(
        Object.entries(facets)
          .filter(([key]) => key !== "application")
          .map(([key, value]) => [key, value]),
      ),
    }),
  );

equipment.push(
  item({
    id: "mppt-charge-controller",
    slug: "mppt-charge-controller",
    kind: "product",
    title: {
      en: "Renogy Rover Li MPPT / 40 A",
      ro: "Renogy Rover Li MPPT / 40 A",
    },
    category: "charge-controllers",
    paths: ["solar", "solar/controllers"],
    summary: {
      en: "A solar controller that adapts array power for battery charging. The 40 A rating describes charging output, not every possible PV configuration.",
      ro: "Controler solar care adaptează energia panourilor la încărcarea bateriei. Curentul de 40 A se referă la ieșirea de încărcare, nu la orice configurație PV posibilă.",
    },
    bestFor: { en: "Off-grid solar system", ro: "Sistem solar autonom" },
    limitations: {
      en: "Confirm battery voltage, cold-weather PV voltage and chemistry profile. Never exceed the maximum input voltage.",
      ro: "Confirmă tensiunea bateriei, limita PV la rece și profilul chimiei. Nu depăși tensiunea maximă de intrare.",
    },
    compatibility: {
      en: "Confirm battery voltage, cold-weather PV voltage and chemistry profile. Never exceed the maximum input voltage.",
      ro: "Confirmă tensiunea bateriei, limita PV la rece și profilul chimiei. Nu depăși tensiunea maximă de intrare.",
    },
    facets: { controllerType: "MPPT", current: "40", application: "Off-grid" },
    specs: {
      "Reglare / Regulation": "MPPT",
      "Curent de încărcare / Charge current": "40 A",
    },
    url: "https://eu.renogy.com/products/rover-li-40-amp-mppt-solar-charge-controller",
  }),
);

equipment.push(
  item({
    id: "dc-dc-charger-20a",
    slug: "dc-dc-charger-20a",
    kind: "product",
    title: {
      en: "Renogy 12 V / 20 A DC–DC charger",
      ro: "Renogy încărcător DC–DC 12 V / 20 A",
    },
    category: "chargers",
    paths: ["chargers", "chargers/dc-dc"],
    summary: {
      en: "An example for controlled charging of an auxiliary battery from a compatible vehicle system.",
      ro: "Un exemplu pentru încărcarea controlată a unei baterii auxiliare dintr-un sistem auto compatibil.",
    },
    bestFor: {
      en: "Caravan, auxiliary battery",
      ro: "Rulotă, baterie auxiliară",
    },
    limitations: {
      en: "Confirm alternator type, ignition signal, battery chemistry and protection. This is not a 230 V mains charger.",
      ro: "Confirmă tipul alternatorului, semnalul de pornire, chimia și protecțiile. Nu este un încărcător de rețea 230 V.",
    },
    compatibility: {
      en: "Confirm alternator type, ignition signal, battery chemistry and protection. This is not a 230 V mains charger.",
      ro: "Confirmă tipul alternatorului, semnalul de pornire, chimia și protecțiile. Nu este un încărcător de rețea 230 V.",
    },
    facets: { voltage: "12", current: "20", application: "RV" },
    specs: {
      "Sistem / System": "12 V",
      "Curent / Current": "20 A",
      "Conversie / Conversion": "DC–DC",
    },
    url: "https://eu.renogy.com/products/12v-20a-dc-to-dc-battery-charger",
  }),
);

equipment.push(
  item({
    id: "industrial-backup-planning",
    slug: "industrial-backup-planning",
    kind: "equipment-class",
    title: {
      en: "Industrial load continuity guide",
      ro: "Ghid pentru continuitatea sarcinilor industriale",
    },
    category: "industrial-electrical",
    paths: ["industrial"],
    summary: {
      en: "Identify control loads that must remain active before sizing backup for the whole installation.",
      ro: "Identifică sarcinile de control care trebuie să rămână active înainte de a dimensiona rezerva pentru întreaga instalație.",
    },
    bestFor: { en: "Controls and automation", ro: "Control și automatizare" },
    limitations: {
      en: "Measured data and protection coordination are required. Residential guides do not validate industrial three-phase installations.",
      ro: "Sunt necesare date măsurate și analiza coordonării protecțiilor. Ghidurile rezidențiale nu validează instalații trifazate industriale.",
    },
    compatibility: {
      en: "Measured data and protection coordination are required. Residential guides do not validate industrial three-phase installations.",
      ro: "Sunt necesare date măsurate și analiza coordonării protecțiilor. Ghidurile rezidențiale nu validează instalații trifazate industriale.",
    },
    facets: { application: "Industrial" },
    specs: {
      "Sarcini / Loads": "Control, automatizare / Controls, automation",
      "Date necesare / Required data":
        "kW, kVA, curent de pornire / starting current",
    },
  }),
);

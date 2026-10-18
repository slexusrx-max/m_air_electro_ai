import type { Locale } from "@/lib/i18n/types";
import { waterCategories } from "./water";

export type LocalText = { en: string; ro: string };
export const bilingual = (en: string, ro: string): LocalText => ({ en, ro });
export function local(text: LocalText, locale: Locale) {
  return locale === "ro" ? text.ro : text.en;
}
export type Category = {
  path: string;
  title: LocalText;
  seoTitle?: LocalText;
  seoDescription?: LocalText;
  summary: LocalText;
  choose: LocalText;
  checks: LocalText;
  facets: string[];
  calculator: string;
  solution: string;
  guide: string;
  topics: LocalText;
};
const c = (
  path: string,
  en: string,
  ro: string,
  summary: LocalText,
  choose: LocalText,
  checks: LocalText,
  facets: string[],
  calculator: string,
  solution: string,
  guide: string,
  topics: LocalText,
): Category => ({
  path,
  title: bilingual(en, ro),
  summary,
  choose,
  checks,
  facets,
  calculator,
  solution,
  guide,
  topics,
});
export const categories: Category[] = [
  c(
    "solar",
    "Solar equipment",
    "Echipamente solare",
    bilingual(
      "Build generation around daily energy and winter sunlight, then match storage and charging.",
      "Dimensionează producția după consumul zilnic și soarele de iarnă, apoi alege stocarea și încărcarea.",
    ),
    bilingual(
      "Start with daily Wh, usable roof area and the worst month you intend to operate. Separate panel power from delivered daily energy.",
      "Începe cu energia zilnică în Wh, suprafața utilă și luna cu cea mai slabă producție. Separă puterea panourilor de energia zilnică livrată.",
    ),
    bilingual(
      "Check cold-weather open-circuit voltage, controller input limits, shading and mounting loads.",
      "Verifică tensiunea în gol la rece, limitele regulatorului, umbrirea și sarcinile mecanice.",
    ),
    ["power", "format", "application"],
    "/calculators/solar",
    "solar-battery",
    "solar-panel-sizing",
    bilingual(
      "Rigid, flexible and portable panels · Home, RV, marine and off-grid kits · MPPT and PWM controllers",
      "Panouri rigide, flexibile și portabile · Kituri pentru casă, rulotă, ambarcațiune și cabană · Regulatoare MPPT și PWM",
    ),
  ),
  c(
    "batteries",
    "Batteries",
    "Acumulatoare",
    bilingual(
      "Compare usable storage, DC voltage and discharge limits before choosing capacity.",
      "Compară energia utilă, tensiunea DC și limitele de descărcare înainte de alegerea capacității.",
    ),
    bilingual(
      "Convert your required AC energy into stored DC energy using the allowed discharge fraction and inverter efficiency. Ah is comparable only at the same voltage.",
      "Transformă energia AC necesară în energie DC stocată folosind fracția de descărcare și randamentul invertorului. Ah se compară numai la aceeași tensiune.",
    ),
    bilingual(
      "Verify BMS continuous and peak current, permitted series/parallel configurations, charging temperature and charger profile. Bluetooth is monitoring, not protection.",
      "Verifică curentul continuu și de vârf al BMS, configurațiile serie/paralel permise, temperatura de încărcare și profilul încărcătorului. Bluetooth oferă monitorizare, nu protecție.",
    ),
    [
      "voltage",
      "capacityAh",
      "capacityWh",
      "chemistry",
      "bluetooth",
      "selfHeating",
      "application",
    ],
    "/calculators/battery",
    "home-backup",
    "how-to-size-backup-battery",
    bilingual(
      "LiFePO4 · 12 / 24 / 48 V · 100 / 200 / 300 Ah+ · Bluetooth · Self-heating",
      "LiFePO4 · 12 / 24 / 48 V · 100 / 200 / 300 Ah+ · Bluetooth · Autoîncălzire",
    ),
  ),
  c(
    "inverters",
    "Inverters",
    "Invertoare",
    bilingual(
      "Match continuous AC demand, starting surge and battery voltage.",
      "Corelează consumul AC continuu, vârful de pornire și tensiunea bateriei.",
    ),
    bilingual(
      "List loads that run together, then separately record motor starting demand and duration. Choose a pure sine unit where the appliance requires it.",
      "Listează consumatorii simultani și notează separat curentul și durata pornirii motoarelor. Alege undă sinusoidală pură dacă aparatul o cere.",
    ),
    bilingual(
      "Confirm 230 V / 50 Hz output for the installation, DC current, earthing scheme, transfer time and whether battery charging is included.",
      "Confirmă ieșirea de 230 V / 50 Hz pentru instalație, curentul DC, schema de împământare, timpul de transfer și existența încărcării bateriei.",
    ),
    ["power", "surgePower", "voltage", "charger", "waveform"],
    "/backup-calculator",
    "home-backup",
    "how-to-choose-inverter",
    bilingual(
      "Pure sine wave · 1000 / 2000 / 3000 W+ · Inverter chargers · 12 / 24 / 48 V",
      "Undă sinusoidală pură · 1000 / 2000 / 3000 W+ · Invertoare cu încărcător · 12 / 24 / 48 V",
    ),
  ),
  c(
    "chargers",
    "Battery charging",
    "Încărcarea bateriilor",
    bilingual(
      "Choose a charger for the source, battery chemistry and permitted charge current.",
      "Alege încărcătorul după sursă, chimia bateriei și curentul permis.",
    ),
    bilingual(
      "Distinguish mains AC charging from alternator DC charging. A dual-input charger can combine alternator and solar, but shared current limits matter.",
      "Separă încărcarea din rețeaua AC de cea de la alternator. Un încărcător cu două intrări poate utiliza alternatorul și soarele, dar limitele comune contează.",
    ),
    bilingual(
      "Check smart-alternator support, source isolation, temperature sensing and the battery manufacturer's maximum charge current.",
      "Verifică suportul pentru alternator inteligent, izolarea surselor, senzorii de temperatură și curentul maxim permis de producătorul bateriei.",
    ),
    ["current", "voltage", "controllerType"],
    "/calculators/battery",
    "rv-caravan",
    "dc-dc-charger-guide",
    bilingual(
      "DC-DC · AC-DC · DC-DC + MPPT · Battery maintainers",
      "DC-DC · AC-DC · DC-DC + MPPT · Încărcătoare de întreținere",
    ),
  ),
  c(
    "backup-power",
    "Backup power",
    "Energie de rezervă",
    bilingual(
      "Keep essential loads operating with a defined autonomy and transfer requirement.",
      "Menține consumatorii esențiali cu autonomie și timp de transfer definite.",
    ),
    bilingual(
      "Split essential circuits from high-power heating and cooking. Compare portable plug-in backup with a professionally installed fixed system.",
      "Separă circuitele esențiale de încălzire și gătit. Compară rezerva portabilă cu sistemul fix instalat de un profesionist.",
    ),
    bilingual(
      "A grid-connected solar inverter may stop during an outage. Backup needs an approved islanding/transfer arrangement and compatible storage.",
      "Un invertor solar conectat la rețea se poate opri la întreruperea alimentării. Rezerva necesită transfer/funcționare insulară adecvată și stocare compatibilă.",
    ),
    ["application", "capacityWh", "power"],
    "/backup-calculator",
    "apartment-backup",
    "apartment-backup-system",
    bilingual(
      "Apartment · Home · Business · Portable · UPS / essential loads",
      "Apartament · Casă · Afacere · Portabil · UPS / consumatori esențiali",
    ),
  ),
  c(
    "generators",
    "Generators",
    "Generatoare",
    bilingual(
      "Plan longer-duration supply around starting loads, fuel and safe outdoor placement.",
      "Planifică alimentarea de durată după porniri, combustibil și amplasarea sigură în exterior.",
    ),
    bilingual(
      "Use running load plus the largest credible starting event, not just the sum of nameplates. A battery can support quiet periods while a generator recharges it.",
      "Folosește sarcina în regim normal plus cel mai mare vârf credibil. O baterie poate alimenta în perioadele liniștite, iar generatorul o reîncarcă.",
    ),
    bilingual(
      "Combustion generators must operate outdoors, away from openings; never indoors, in a garage or on an enclosed balcony. A qualified installer must design transfer protection.",
      "Generatoarele cu ardere se folosesc în exterior, departe de deschideri; niciodată în interior, garaj sau balcon închis. Un instalator calificat proiectează protecția la transfer.",
    ),
    ["application"],
    "/calculators/generator",
    "off-grid-cabin",
    "generator-vs-battery-backup",
    bilingual(
      "Portable · Home standby · Generator + battery · Transfer equipment",
      "Portabile · Rezervă pentru casă · Generator + baterie · Echipamente de transfer",
    ),
  ),
  c(
    "ev-charging",
    "EV charging",
    "Încărcare auto electrică",
    bilingual(
      "Choose charging around the vehicle, available supply and parking arrangement.",
      "Alege încărcarea după automobil, alimentarea disponibilă și locul de parcare.",
    ),
    bilingual(
      "Check the car's onboard AC limit before selecting a wallbox. More installed power does not guarantee faster charging if the car or site cannot accept it.",
      "Verifică limita încărcătorului AC al mașinii înainte de alegerea stației. Puterea instalată mai mare nu garantează încărcare mai rapidă dacă mașina sau instalația o limitează.",
    ),
    bilingual(
      "Verify phase availability, cable route, load management and required residual-current protection with an installer. Portable charging still needs a suitable inspected circuit.",
      "Verifică fazele disponibile, traseul cablului, managementul sarcinii și protecția diferențială cu instalatorul. Încărcarea portabilă necesită și ea un circuit verificat.",
    ),
    ["power", "application"],
    "/calculators/cable-sizing",
    "home-backup",
    "ev-charging-basics",
    bilingual(
      "Home wallboxes · Portable EVSE · Cables and accessories",
      "Stații pentru casă · EVSE portabile · Cabluri și accesorii",
    ),
  ),
  c(
    "electrical-components",
    "Electrical components",
    "Componente electrice",
    bilingual(
      "Complete the power path with correctly rated cables, isolation and protection.",
      "Completează circuitul cu conductoare, separare și protecție dimensionate corect.",
    ),
    bilingual(
      "Size conductors for installation conditions and voltage drop; then coordinate protection with the cable and prospective fault current.",
      "Dimensionează conductoarele după montaj și căderea de tensiune; coordonează protecția cu cablul și curentul de scurtcircuit.",
    ),
    bilingual(
      "AC and DC switching ratings are not interchangeable. Check interrupting capacity, enclosure, terminals and conductor temperature ratings.",
      "Valorile de comutație AC și DC nu sunt interschimbabile. Verifică puterea de rupere, carcasa, bornele și temperatura admisă a conductorului.",
    ),
    ["application", "voltage"],
    "/calculators/cable-sizing",
    "workshop",
    "cable-and-protection-basics",
    bilingual(
      "Breakers · Fuses · Contactors · Relays · Cable & wiring · Protection · Disconnects",
      "Disjunctoare · Siguranțe · Contactoare · Relee · Cabluri · Protecție · Separatoare",
    ),
  ),
  c(
    "industrial",
    "Industrial electrical",
    "Echipamente industriale",
    bilingual(
      "Frame a procurement brief for motors, controls and continuity equipment.",
      "Pregătește cerințele de achiziție pentru motoare, automatizări și continuitatea alimentării.",
    ),
    bilingual(
      "Record supply phases, motor duty, control signals and downtime consequences. Select a VFD by motor current and operating duty as well as kW.",
      "Notează fazele, regimul motorului, semnalele de comandă și efectele opririi. Selectează convertizorul după curent și regim, nu doar kW.",
    ),
    bilingual(
      "EMC, braking, enclosure rating and functional safety require application-specific engineering. A catalog match is not an automation safety assessment.",
      "EMC, frânarea, gradul carcasei și siguranța funcțională cer proiectare specifică. O potrivire în catalog nu este o evaluare de siguranță.",
    ),
    ["application", "power"],
    "/calculators/motor-current",
    "workshop",
    "industrial-motor-planning",
    bilingual(
      "VFD · Motors · PLC · Sensors · Automation · Industrial backup",
      "Convertizoare de frecvență · Motoare · PLC · Senzori · Automatizări · Rezervă industrială",
    ),
  ),
  c(
    "marine",
    "Marine electrical",
    "Sisteme electrice navale",
    bilingual(
      "Plan house batteries, charging and distribution for a vessel environment.",
      "Planifică bateriile de servicii, încărcarea și distribuția pentru mediul naval.",
    ),
    bilingual(
      "Separate engine-start and house loads. Audit anchorage consumption, passage charging and shore-power availability before selecting battery size.",
      "Separă pornirea motorului de consumul de servicii. Evaluează energia la ancoră, încărcarea în mers și alimentarea de la cheu.",
    ),
    bilingual(
      "Salt, vibration, bonding, corrosion and shore-power protection are vessel-specific. Do not assume a domestic component is suitable for a wet marine compartment.",
      "Sarea, vibrațiile, legăturile de protecție, coroziunea și alimentarea de la cheu sunt specifice navei. Nu presupune că o componentă casnică este potrivită într-un compartiment umed.",
    ),
    ["application", "voltage"],
    "/calculators/battery",
    "marine",
    "marine-battery-system",
    bilingual(
      "Marine batteries · DC distribution · Chargers · Inverters · Shore power · Monitoring",
      "Baterii navale · Distribuție DC · Încărcătoare · Invertoare · Alimentare de la cheu · Monitorizare",
    ),
  ),
];
const subcategories: [string, string, string, string, LocalText][] = [
  [
    "solar/panels",
    "solar",
    "Solar panels",
    "Panouri solare",
    bilingual(
      "Compare panel formats against mounting area, daily yield and controller limits.",
      "Compară formatele după suprafața de montaj, producție și limitele regulatorului.",
    ),
  ],
  [
    "solar/panels/rigid",
    "solar",
    "Rigid solar panels",
    "Panouri solare rigide",
    bilingual(
      "Framed panels for permanent mounting: allow cooling airflow and design the fixing for wind loads.",
      "Panouri cu ramă pentru montaj permanent: asigură ventilație și fixare calculată la vânt.",
    ),
  ],
  [
    "solar/panels/portable",
    "solar",
    "Portable solar panels",
    "Panouri solare portabile",
    bilingual(
      "Move generation into sunlight while keeping the vehicle shaded; account for daily setup and theft risk.",
      "Mută panourile la soare păstrând vehiculul la umbră; ia în calcul instalarea zilnică și securitatea.",
    ),
  ],
  [
    "solar/panels/flexible",
    "solar",
    "Flexible solar panels",
    "Panouri solare flexibile",
    bilingual(
      "Low-profile panels for suitable curved surfaces; respect the specified bend radius and mounting method.",
      "Panouri cu profil redus pentru suprafețe curbe compatibile; respectă raza de curbură și metoda de montaj.",
    ),
  ],
  [
    "solar/kits",
    "solar",
    "Solar kits",
    "Kituri solare",
    bilingual(
      "A kit is a starting bill of materials. Confirm which cables, fuses and mounting parts are actually included.",
      "Un kit este un punct de plecare. Confirmă cablurile, siguranțele și elementele de montaj incluse.",
    ),
  ],
  [
    "solar/controllers",
    "solar",
    "Solar charge controllers",
    "Regulatoare de încărcare solară",
    bilingual(
      "Compare MPPT and PWM by PV input voltage, output current and supported battery profiles.",
      "Compară MPPT și PWM după tensiunea PV, curentul de ieșire și profilurile bateriilor.",
    ),
  ],
  [
    "batteries/lifepo4",
    "batteries",
    "LiFePO4 batteries",
    "Acumulatoare LiFePO4",
    bilingual(
      "Lithium iron phosphate storage still needs correctly coordinated BMS, charging and circuit protection.",
      "Stocarea litiu-fier-fosfat necesită coordonarea BMS, încărcării și protecției circuitelor.",
    ),
  ],
  [
    "batteries/12v",
    "batteries",
    "12 V batteries",
    "Acumulatoare de 12 V",
    bilingual(
      "A familiar mobile DC class. At high inverter power, current and cable requirements can become substantial.",
      "O clasă DC uzuală pentru sisteme mobile. La puteri mari ale invertorului cresc curentul și secțiunea cablurilor.",
    ),
  ],
  [
    "batteries/100ah",
    "batteries",
    "100 Ah batteries",
    "Acumulatoare de 100 Ah",
    bilingual(
      "100 Ah is charge capacity, not energy. Multiply by nominal voltage to compare stored Wh.",
      "100 Ah reprezintă capacitatea electrică, nu energia. Înmulțește cu tensiunea nominală pentru Wh.",
    ),
  ],
  [
    "inverters/pure-sine",
    "inverters",
    "Pure sine inverters",
    "Invertoare sinus pur",
    bilingual(
      "Compare clean AC conversion while checking no-load consumption and documented surge duration.",
      "Compară conversia AC sinusoidală verificând consumul în gol și durata documentată a vârfului.",
    ),
  ],
  [
    "inverters/2000w",
    "inverters",
    "2000 W inverters",
    "Invertoare de 2000 W",
    bilingual(
      "The 2 kW class is not automatically compatible with a single 12 V battery: verify DC discharge capability.",
      "Clasa de 2 kW nu este automat compatibilă cu o singură baterie de 12 V: verifică curentul de descărcare.",
    ),
  ],
  [
    "chargers/dc-dc",
    "chargers",
    "DC-DC chargers",
    "Încărcătoare DC-DC",
    bilingual(
      "Controlled charging between alternator and house battery, with source and destination limits checked independently.",
      "Încărcare controlată între alternator și bateria de servicii, cu verificarea separată a limitelor sursei și bateriei.",
    ),
  ],
];
for (const [path, parent, en, ro, summary] of subcategories)
  categories.push({
    ...categories.find((c) => c.path === parent)!,
    path,
    title: bilingual(en, ro),
    summary,
  });
// Category navigation stays compact; search titles explain the buying task.
const categoryEditorial: Record<string, Pick<Category, "seoTitle" | "seoDescription" | "summary" | "choose" | "checks">> = {
  inverters: {
    seoTitle: bilingual("Battery inverters: sizing and comparison for Romania", "Invertoare pentru baterii: alegere și comparație în România"),
    seoDescription: bilingual("Compare battery inverters for home backup and caravans: continuous power, starting loads, DC voltage and supplier checks for Romania.", "Compară invertoare pentru baterii: putere continuă, pornirea aparatelor, tensiune DC și verificări înainte de cumpărare pentru casă sau rulotă."),
    summary: bilingual(
      "Compare battery inverters for essential home loads, caravans and off-grid systems. Check continuous output, starting power and battery voltage before choosing a model. A battery inverter is not automatically a grid-connected solar inverter.",
      "Compară invertoare pentru baterii, pentru consumatori esențiali acasă, rulote și sisteme off-grid. Verifică puterea continuă, pornirea aparatelor și tensiunea bateriei. Un invertor pentru baterii nu este automat un invertor fotovoltaic conectat la rețea.",
    ),
    choose: bilingual(
      "Add the power of appliances that run together and check motor starting demand separately. Compare the documented continuous rating, surge duration and waveform. Choose the inverter and battery together: at 2000 W, a 12 V system needs about 167 A before conversion losses and more once losses are included, so battery capacity in Ah alone is not enough.",
      "Adună puterile aparatelor folosite simultan și verifică separat pornirea motoarelor. Compară puterea continuă, durata suprasarcinii și forma de undă documentate. Alege împreună invertorul și bateria: la 2000 W, un sistem de 12 V cere peste 167 A după includerea pierderilor; capacitatea în Ah nu este suficientă pentru alegere.",
    ),
    checks: bilingual(
      "For a Romanian installation, verify the model's 230 V / 50 Hz output, DC input range, BMS current, cable and fuse sizing, earthing and any transfer function. Do not infer a battery charger or grid-export capability from the word inverter. Fixed home circuits need a qualified installer and suitable transfer protection; never feed house wiring through a socket.",
      "Pentru o instalație din România, verifică ieșirea de 230 V / 50 Hz a modelului, intervalul DC, curentul BMS, cablurile, siguranțele, împământarea și funcția de transfer. Denumirea invertor nu confirmă un încărcător de baterii sau posibilitatea injectării în rețea. Circuitele fixe necesită instalator calificat și protecție la transfer; nu alimenta instalația casei printr-o priză.",
    ),
  },
  "solar/panels": {
    seoTitle: bilingual("Solar panels: compare formats and size your system", "Panouri solare fotovoltaice: comparație și dimensionare"),
    seoDescription: bilingual("Compare rigid, portable and flexible solar panels. Check daily energy, mounting area and controller limits for systems used in Romania.", "Compară panouri solare rigide, portabile și flexibile. Verifică energia zilnică, spațiul de montaj și regulatorul pentru utilizare în România."),
    summary: bilingual(
      "Choose solar panels for a caravan, cabin or a planned home system by available mounting space and daily energy use. Compare rigid, portable and flexible formats, then match the documented panel voltage and current to the controller or power station.",
      "Alege panouri solare fotovoltaice pentru rulotă, cabană sau un sistem planificat pentru casă, în funcție de spațiul de montaj și consumul zilnic. Compară formatele rigide, portabile și flexibile, apoi verifică tensiunea și curentul față de limitele regulatorului sau stației de energie.",
    ),
    choose: bilingual(
      "Start with daily consumption in Wh, usable mounting area and the months you need the system. Rated panel watts describe test conditions, not guaranteed daily energy in Romania. Consider local shading, orientation and winter sunlight. Rigid panels suit planned fixed mounting; portable panels need setup space; flexible panels require the manufacturer's mounting and cooling instructions.",
      "Începe cu energia zilnică în Wh, suprafața utilă și lunile în care folosești sistemul. Puterea nominală în wați descrie condiții de test, nu energia zilnică garantată în România. Ia în calcul umbrirea, orientarea și soarele de iarnă. Panourile rigide cer montaj fix planificat, cele portabile spațiu de amplasare, iar cele flexibile respectarea instrucțiunilor de fixare și răcire.",
    ),
    checks: bilingual(
      "Check open-circuit voltage at the lowest design temperature, short-circuit current and series/parallel limits against the exact controller or power-station manual. A matching connector alone does not establish compatibility. Check mounting loads, cable protection and the permitted installation method before ordering.",
      "Verifică tensiunea în gol la temperatura minimă de proiectare, curentul de scurtcircuit și limitele legării serie/paralel în manualul regulatorului sau stației de energie. O mufă potrivită nu dovedește compatibilitatea electrică. Verifică sarcinile de montaj, protecția cablurilor și metoda de instalare permisă înainte de comandă.",
    ),
  },
};
for (const category of categories) {
  const editorial = categoryEditorial[category.path];
  if (editorial) Object.assign(category, editorial);
}
const waterRoot: Category = {
  path: "water", title: bilingual("Water & Resilience", "Apă și reziliență"),
  summary: bilingual("Water solutions for home, travel and off-grid living, selected around your source and documented performance.", "Soluții de apă pentru acasă, călătorii și off-grid, alese după sursă și performanța documentată."),
  choose: bilingual("Start with a water analysis and your installation needs.", "Începe cu analiza apei și condițiile de instalare."),
  checks: bilingual("Verify the exact model, cartridge and performance documentation.", "Verifică modelul exact, cartușul și documentația de performanță."),
  facets: [], calculator: "/marketplace/water", solution: "off-grid-cabin", guide: "choosing-water-system", topics: bilingual("Home · On the go · Off-grid", "Acasă · În călătorie · Off-grid"),
};
categories.push(waterRoot, ...waterCategories.map(w => ({ ...waterRoot, path: `water/${w.slug}`, title: w.title, summary: w.summary, checks: w.checks })));
export const rootCategories = categories.filter((c) => !c.path.includes("/"));
export const categoryByPath = (path: string) =>
  categories.find((c) => c.path === path);
export const categoryChildren = (path: string) =>
  categories.filter(
    (c) =>
      c.path.startsWith(path + "/") &&
      c.path.split("/").length === path.split("/").length + 1,
  );
export const legacyCategories: Record<string, string> = {
  "solar-panels": "solar/panels",
  "lithium-batteries": "batteries",
  inverters: "inverters",
  "backup-power": "backup-power",
  "solar-kits": "solar/kits",
  "charge-controllers": "solar/controllers",
  "electrical-accessories": "electrical-components",
  "industrial-electrical": "industrial",
  "marine-electrical": "marine",
  "battery-chargers": "chargers",
  chargers: "chargers",
  generators: "generators",
  "ev-charging": "ev-charging",
};

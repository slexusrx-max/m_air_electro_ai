import type {
  CatalogProduct,
  MarketplaceRegion,
  ProductCategory,
} from "@/lib/affiliate/types";
export const marketplaceCategories: {
  slug: ProductCategory;
  name: string;
  nameEn: string;
  summary: string;
  summaryEn: string;
  icon: string;
  primary: boolean;
  supplierUrl: string;
}[] = [
  {
    slug: "lithium-batteries",
    name: "Baterii cu litiu",
    nameEn: "Lithium Batteries",
    summary:
      "Stocare pentru autonomie, cu limite BMS și încărcare compatibilă.",
    summaryEn: "Storage for autonomy, with compatible charging and BMS limits.",
    icon: "battery",
    primary: true,
    supplierUrl: "https://eu.renogy.com/collections/lithium-battery",
  },
  {
    slug: "inverters",
    name: "Invertoare",
    nameEn: "Inverters",
    summary: "Putere continuă și de pornire pentru consumatori AC.",
    summaryEn: "Continuous and starting power for AC loads.",
    icon: "inverter",
    primary: true,
    supplierUrl: "https://eu.renogy.com/collections/solar-inverter",
  },
  {
    slug: "solar-panels",
    name: "Panouri solare",
    nameEn: "Solar Panels",
    summary: "Producție dimensionată pentru spațiul și energia necesare.",
    summaryEn: "Generation matched to available space and energy needs.",
    icon: "solar",
    primary: true,
    supplierUrl: "https://eu.renogy.com/collections/solar-panel",
  },
  {
    slug: "solar-kits",
    name: "Kituri solare",
    nameEn: "Solar Kits",
    summary: "Componente de analizat împreună, înainte de montaj.",
    summaryEn: "Components to assess together before installation.",
    icon: "solar",
    primary: true,
    supplierUrl: "https://eu.renogy.com/collections/solar-kits",
  },
  {
    slug: "charge-controllers",
    name: "Controlere de încărcare",
    nameEn: "Charge Controllers",
    summary: "Potrivirea panourilor cu tensiunea și chimia bateriei.",
    summaryEn: "Match the array to battery voltage and chemistry.",
    icon: "controller",
    primary: true,
    supplierUrl: "https://eu.renogy.com/collections/solar-charge-controller",
  },
  {
    slug: "battery-chargers",
    name: "Încărcătoare de baterii",
    nameEn: "Battery Chargers",
    summary: "Încărcare de la alternator sau surse compatibile.",
    summaryEn: "Charging from an alternator or compatible source.",
    icon: "controller",
    primary: true,
    supplierUrl: "https://eu.renogy.com/collections/battery-charger",
  },
  {
    slug: "backup-power",
    name: "Energie de rezervă",
    nameEn: "Backup Power",
    summary: "Sisteme pentru consumatori esențiali, fără alimentare inversă.",
    summaryEn: "Essential-load systems without unsafe backfeeding.",
    icon: "battery",
    primary: true,
    supplierUrl: "https://eu.renogy.com/collections/solar-kits",
  },
  {
    slug: "electrical-accessories",
    name: "Accesorii electrice",
    nameEn: "Electrical Accessories",
    summary: "Cabluri, siguranțe, separatoare și monitorizare.",
    summaryEn: "Cables, fuses, isolators and monitoring.",
    icon: "controller",
    primary: true,
    supplierUrl: "https://eu.renogy.com/collections/accessories-wiring",
  },
  {
    slug: "marine-electrical",
    name: "Electricitate la bord",
    nameEn: "Marine Electrical",
    summary: "Baterii și circuite DC evaluate pentru mediul marin.",
    summaryEn: "Battery and DC circuits assessed for marine use.",
    icon: "battery",
    primary: false,
    supplierUrl: "https://eu.renogy.com/collections/battery-charger",
  },
  {
    slug: "industrial-electrical",
    name: "Electricitate industrială",
    nameEn: "Industrial Electrical",
    summary: "Planificare și verificări pentru sarcini profesionale.",
    summaryEn: "Planning and checks for professional loads.",
    icon: "inverter",
    primary: false,
    supplierUrl: "https://eu.renogy.com/collections/accessories-wiring",
  },
];
export const catalog: CatalogProduct[] = [
  {
    id: "lfp-battery-12v-100ah",
    slug: "lfp-battery-12v-100ah",
    category: "lithium-batteries",
    name: "Renogy Core Mini 12,8 V 100 Ah",
    kind: "product",
    brand: "Renogy",
    provider: "renogy",
    productUrl:
      "https://eu.renogy.com/products/core-mini-12-8v-100ah-lithium-iron-phosphate-battery",
    technicalSpecs: {
      "Chimie / Chemistry": "LiFePO₄",
      "Tensiune / Voltage": "12.8 V",
      "Capacitate / Capacity": "100 Ah",
      "Energie nominală / Nominal energy": "1.28 kWh",
    },
    description:
      "O baterie compactă pentru circuite DC de 12 V și autonomie mobilă. Cei 1,28 kWh nominali nu sunt integral disponibili la priză: pierderile și rezerva de descărcare reduc energia utilă.",
    recommendedFor: ["Rulotă", "consumatori DC mici"],
    advantages:
      "Capacitatea nominală permite compararea directă cu necesarul calculat.",
    compatibilityNotes:
      "Verifică limitele BMS și încărcarea la rece. Nu presupune că o singură baterie poate alimenta orice invertor de 2 kW.",
    whyRecommended:
      "Este un exemplu documentat pentru această componentă; nu reprezintă o garanție că se potrivește oricărui sistem.",
    merchantRegion: "EU",
    featured: true,
    lastUpdated: "2026-09-12",
    en: {
      name: "Renogy Core Mini 12.8 V 100 Ah",
      description:
        "A compact battery for 12 V DC circuits and mobile backup. Its 1.28 kWh nominal capacity is not all available at the socket: conversion losses and discharge reserve reduce usable energy.",
      recommendedFor: ["Caravan", "small DC loads"],
      advantages: "Nominal energy can be compared with the calculated demand.",
      compatibilityNotes:
        "Check BMS current limits and cold-weather charging. A single battery is not automatically suitable for any 2 kW inverter.",
      brand: "Renogy",
      whyRecommended:
        "A documented example for this component, not a guarantee of suitability for every system.",
    },
  },
  {
    id: "renogy-inverter-1000w",
    slug: "renogy-inverter-1000w",
    category: "inverters",
    name: "Renogy invertor sinus pur 12 V / 1.000 W",
    kind: "product",
    brand: "Renogy",
    provider: "renogy",
    productUrl:
      "https://eu.renogy.com/products/1000w-12v-pure-sine-wave-inverter-with-ups-function",
    technicalSpecs: {
      "Intrare / Input": "12 V DC",
      "Putere / Power": "1,000 W",
      "Formă de undă / Waveform": "Sinus pur / Pure sine",
    },
    description:
      "Un exemplu pentru alimentarea unor consumatori AC esențiali. Compară puterea continuă și cerințele de pornire separat.",
    recommendedFor: ["Electronice", "sarcini AC mici"],
    advantages:
      "Sinusul pur este un criteriu util pentru aparate cu surse sensibile.",
    compatibilityNotes:
      "Confirmă varianta europeană, tensiunea de ieșire și puterea de vârf la furnizor. Cablurile DC și protecțiile se dimensionează separat.",
    whyRecommended:
      "Este un exemplu documentat pentru această componentă; nu reprezintă o garanție că se potrivește oricărui sistem.",
    merchantRegion: "EU",
    featured: true,
    lastUpdated: "2026-09-12",
    en: {
      name: "Renogy 12 V / 1,000 W pure sine inverter",
      description:
        "An example for selected essential AC loads. Compare continuous output and appliance starting requirements separately.",
      recommendedFor: ["Electronics", "small AC loads"],
      advantages:
        "Pure sine output is a useful criterion for sensitive power supplies.",
      compatibilityNotes:
        "Confirm the European variant, AC output voltage and surge rating with the supplier. DC cables and protection require separate sizing.",
      brand: "Renogy",
      whyRecommended:
        "A documented example for this component, not a guarantee of suitability for every system.",
    },
  },
  {
    id: "solar-panel-200w",
    slug: "solar-panel-200w",
    category: "solar-panels",
    name: "Renogy panou rigid N-Type 16BB / 200 W",
    kind: "product",
    brand: "Renogy",
    provider: "renogy",
    productUrl:
      "https://eu.renogy.com/products/renogy-16bb-n-type-200-watt-24v-solar-panel",
    technicalSpecs: {
      "Putere nominală / Rated power": "200 W",
      "Tehnologie / Technology": "N-Type 16BB",
      Format: "Rigid",
    },
    description:
      "Panou rigid pentru o configurație solară fixă. Puterea nominală este măsurată în condiții standard; energia zilnică depinde de amplasare și vreme.",
    recommendedFor: ["Rulotă", "cabană"],
    advantages:
      "Un modul de 200 W permite construirea etapizată a unei instalații mici.",
    compatibilityNotes:
      "Verifică dimensiunile, Voc și Isc înainte de conectare. Denumirea de tensiune a panoului nu înlocuiește verificarea controlerului.",
    whyRecommended:
      "Este un exemplu documentat pentru această componentă; nu reprezintă o garanție că se potrivește oricărui sistem.",
    merchantRegion: "EU",
    featured: true,
    lastUpdated: "2026-09-12",
    en: {
      name: "Renogy N-Type 16BB rigid panel / 200 W",
      description:
        "A rigid panel for a fixed solar configuration. Rated power is measured under standard conditions; daily energy depends on location and weather.",
      recommendedFor: ["Caravan", "cabin"],
      advantages: "A 200 W module supports a modular small-array layout.",
      compatibilityNotes:
        "Check dimensions, Voc and Isc before connection. A panel voltage label does not replace controller compatibility checks.",
      brand: "Renogy",
      whyRecommended:
        "A documented example for this component, not a guarantee of suitability for every system.",
    },
  },
  {
    id: "mppt-charge-controller",
    slug: "mppt-charge-controller",
    category: "charge-controllers",
    name: "Renogy Rover Li MPPT / 40 A",
    kind: "product",
    brand: "Renogy",
    provider: "renogy",
    productUrl:
      "https://eu.renogy.com/products/rover-li-40-amp-mppt-solar-charge-controller",
    technicalSpecs: {
      "Reglare / Regulation": "MPPT",
      "Curent de încărcare / Charge current": "40 A",
    },
    description:
      "Controler solar care adaptează energia panourilor la încărcarea bateriei. Curentul de 40 A se referă la ieșirea de încărcare, nu la orice configurație PV posibilă.",
    recommendedFor: ["Sistem solar autonom"],
    advantages: "Reglarea MPPT urmărește punctul de funcționare al panourilor.",
    compatibilityNotes:
      "Confirmă tensiunea bateriei, limita PV la rece și profilul chimiei. Nu depăși tensiunea maximă de intrare.",
    whyRecommended:
      "Este un exemplu documentat pentru această componentă; nu reprezintă o garanție că se potrivește oricărui sistem.",
    merchantRegion: "EU",
    featured: true,
    lastUpdated: "2026-09-12",
    en: {
      name: "Renogy Rover Li MPPT / 40 A",
      description:
        "A solar controller that adapts array power for battery charging. The 40 A rating describes charging output, not every possible PV configuration.",
      recommendedFor: ["Off-grid solar system"],
      advantages: "MPPT regulation tracks the array operating point.",
      compatibilityNotes:
        "Confirm battery voltage, cold-weather PV voltage and chemistry profile. Never exceed the maximum input voltage.",
      brand: "Renogy",
      whyRecommended:
        "A documented example for this component, not a guarantee of suitability for every system.",
    },
  },
  {
    id: "dc-dc-charger-20a",
    slug: "dc-dc-charger-20a",
    category: "battery-chargers",
    name: "Renogy încărcător DC–DC 12 V / 20 A",
    kind: "product",
    brand: "Renogy",
    provider: "renogy",
    productUrl:
      "https://eu.renogy.com/products/12v-20a-dc-to-dc-battery-charger",
    technicalSpecs: {
      "Sistem / System": "12 V",
      "Curent / Current": "20 A",
      "Conversie / Conversion": "DC–DC",
    },
    description:
      "Un exemplu pentru încărcarea controlată a unei baterii auxiliare dintr-un sistem auto compatibil.",
    recommendedFor: ["Rulotă", "baterie auxiliară"],
    advantages:
      "Separă profilul de încărcare al bateriei auxiliare de sursa vehiculului.",
    compatibilityNotes:
      "Confirmă tipul alternatorului, semnalul de pornire, chimia și protecțiile. Nu este un încărcător de rețea 230 V.",
    whyRecommended:
      "Este un exemplu documentat pentru această componentă; nu reprezintă o garanție că se potrivește oricărui sistem.",
    merchantRegion: "EU",
    featured: true,
    lastUpdated: "2026-09-12",
    en: {
      name: "Renogy 12 V / 20 A DC–DC charger",
      description:
        "An example for controlled charging of an auxiliary battery from a compatible vehicle system.",
      recommendedFor: ["Caravan", "auxiliary battery"],
      advantages:
        "Separates auxiliary battery charging needs from the vehicle source.",
      compatibilityNotes:
        "Confirm alternator type, ignition signal, battery chemistry and protection. This is not a 230 V mains charger.",
      brand: "Renogy",
      whyRecommended:
        "A documented example for this component, not a guarantee of suitability for every system.",
    },
  },
  {
    id: "pure-sine-inverter-2000w",
    slug: "pure-sine-inverter-2000w",
    category: "inverters",
    name: "Clasa de invertoare sinus pur / 2 kW",
    kind: "class",
    brand: "M Air — ghid editorial",
    provider: "renogy",
    productUrl: "https://eu.renogy.com/collections/solar-inverter",
    technicalSpecs: {
      "Putere de referință / Reference output": "2 kW",
      "Sistem DC / DC system": "12 / 24 / 48 V — după model / model dependent",
    },
    description:
      "O clasă de echipamente pentru mai mulți consumatori esențiali. Este un reper de comparație, nu un model Renogy specific.",
    recommendedFor: ["Locuință", "cabană"],
    advantages:
      "Separă cerința de putere de capacitatea bateriei: W nu înseamnă Wh.",
    compatibilityNotes:
      "La 12 V, 2 kW pot solicita peste 180 A după pierderi. Verifică BMS, cabluri, protecții și durata puterii de vârf.",
    whyRecommended:
      "Folosește aceste repere pentru a verifica necesarul calculat, apoi compară modele concrete.",
    merchantRegion: "EU",
    featured: false,
    lastUpdated: "2026-09-12",
    en: {
      name: "Pure sine inverter class / 2 kW",
      description:
        "An equipment class for several essential loads. This is a comparison reference, not a specific Renogy model.",
      recommendedFor: ["Home", "cabin"],
      advantages: "Separates output power from battery capacity: W is not Wh.",
      compatibilityNotes:
        "At 12 V, 2 kW can require over 180 A after losses. Check BMS, cables, protection and surge duration.",
      brand: "M Air — editorial guide",
      whyRecommended:
        "Use these references to check the calculated requirement, then compare specific models.",
    },
  },
  {
    id: "portable-solar-kit-400w",
    slug: "portable-solar-kit-400w",
    category: "solar-kits",
    name: "Ghid de sistem solar / 400 W",
    kind: "class",
    brand: "M Air — ghid editorial",
    provider: "renogy",
    productUrl: "https://eu.renogy.com/collections/solar-kits",
    technicalSpecs: {
      "Panouri / Array": "400 W — reper / reference",
      "Controler / Controller": "MPPT compatibil / compatible",
      "Baterie / Battery": "Dimensionare separată / sized separately",
    },
    description:
      "Un punct de pornire pentru rulote și cabane cu consum redus. Compară un kit cu achiziția separată a panourilor, controlerului și accesoriilor.",
    recommendedFor: ["Rulotă", "cabană de weekend"],
    advantages:
      "O listă completă de componente reduce riscul de a omite conectica.",
    compatibilityNotes:
      "400 W nu produc 400 W în permanență. Verifică ce include kitul; bateria și invertorul pot fi separate.",
    whyRecommended:
      "Folosește aceste repere pentru a verifica necesarul calculat, apoi compară modele concrete.",
    merchantRegion: "EU",
    featured: false,
    lastUpdated: "2026-09-12",
    en: {
      name: "Solar system guide / 400 W",
      description:
        "A starting point for low-demand caravans and cabins. Compare a kit with separately selected panels, controller and accessories.",
      recommendedFor: ["Caravan", "weekend cabin"],
      advantages:
        "A complete component list reduces the risk of missing connection hardware.",
      compatibilityNotes:
        "400 W is not a continuous output guarantee. Check kit contents; the battery and inverter may be separate.",
      brand: "M Air — editorial guide",
      whyRecommended:
        "Use these references to check the calculated requirement, then compare specific models.",
    },
  },
  {
    id: "essential-backup-system",
    slug: "essential-backup-system",
    category: "backup-power",
    name: "Ghid pentru alimentarea consumatorilor esențiali",
    kind: "class",
    brand: "M Air — ghid editorial",
    provider: "renogy",
    productUrl: "https://eu.renogy.com/collections/solar-kits",
    technicalSpecs: {
      "Exemplu / Example": "500 W × 4 h = 2 kWh",
      "Baterie nominală / Nominal battery":
        "≈ 2.72 kWh la / at 80% DoD, 92% randament / efficiency",
      "Ieșire / Output": "AC / DC după consumatori / load dependent",
    },
    description:
      "Pornește de la aparatele care chiar trebuie să funcționeze: router, iluminat și automatizarea centralei. Consumatorii de încălzire electrică pot schimba radical dimensionarea.",
    recommendedFor: ["Locuință", "birou mic"],
    advantages:
      "Prioritizarea consumatorilor reduce capacitatea și puterea necesare.",
    compatibilityNotes:
      "Exemplul nu este o instalație completă. Comutarea, legarea la pământ și separarea față de rețea necesită proiectare calificată.",
    whyRecommended:
      "Folosește aceste repere pentru a verifica necesarul calculat, apoi compară modele concrete.",
    merchantRegion: "EU",
    featured: true,
    lastUpdated: "2026-09-12",
    en: {
      name: "Essential-load backup guide",
      description:
        "Start with the devices that must run: router, lighting and boiler controls. Electric heating loads can radically change system sizing.",
      recommendedFor: ["Home", "small office"],
      advantages:
        "Load prioritisation reduces required capacity and output power.",
      compatibilityNotes:
        "The example is not a complete installation. Transfer switching, earthing and grid isolation require qualified design.",
      brand: "M Air — editorial guide",
      whyRecommended:
        "Use these references to check the calculated requirement, then compare specific models.",
    },
  },
  {
    id: "dc-protection-and-wiring",
    slug: "dc-protection-and-wiring",
    category: "electrical-accessories",
    name: "Ghid pentru cabluri și protecții DC",
    kind: "class",
    brand: "M Air — ghid editorial",
    provider: "renogy",
    productUrl: "https://eu.renogy.com/collections/accessories-wiring",
    technicalSpecs: {
      "Verificări / Checks":
        "Curent, tensiune DC, lungime / Current, DC voltage, length",
      "Protecție / Protection": "Siguranță + separator / Fuse + isolator",
    },
    description:
      "Cablurile și protecțiile sunt parte din sistem, nu accesorii alese după aspect. Verifică curentul, căderea de tensiune și capacitatea de întrerupere.",
    recommendedFor: ["Sisteme cu baterie", "conexiuni PV"],
    advantages:
      "Dimensionarea împreună a cablului și protecției oferă o verificare coerentă.",
    compatibilityNotes:
      "Un dispozitiv AC nu este automat potrivit pentru DC. Nu combina conectori incompatibili; respectă instrucțiunile de sertizare.",
    whyRecommended:
      "Folosește aceste repere pentru a verifica necesarul calculat, apoi compară modele concrete.",
    merchantRegion: "EU",
    featured: false,
    lastUpdated: "2026-09-12",
    en: {
      name: "DC wiring and protection guide",
      description:
        "Cables and protection are system components, not cosmetic accessories. Check current, voltage drop and interrupting capacity.",
      recommendedFor: ["Battery systems", "PV connections"],
      advantages:
        "Sizing cable and protection together supports a coherent check.",
      compatibilityNotes:
        "An AC device is not automatically suitable for DC. Do not mix incompatible connectors; follow crimping instructions.",
      brand: "M Air — editorial guide",
      whyRecommended:
        "Use these references to check the calculated requirement, then compare specific models.",
    },
  },
  {
    id: "marine-dc-power-system",
    slug: "marine-dc-power-system",
    category: "marine-electrical",
    name: "Ghid pentru alimentare DC la bord",
    kind: "class",
    brand: "M Air — ghid editorial",
    provider: "renogy",
    productUrl: "https://eu.renogy.com/collections/battery-charger",
    technicalSpecs: {
      "Mediu / Environment": "Marin / Marine",
      "Sistem / System": "DC — conform navei / vessel specific",
    },
    description:
      "Planifică separat bateria de pornire și consumatorii auxiliari. Mediul umed schimbă cerințele pentru cabluri și conexiuni.",
    recommendedFor: ["Ambarcațiuni"],
    advantages:
      "Separarea consumatorilor ajută la păstrarea rezervei de pornire.",
    compatibilityNotes:
      "Nu presupune certificarea marină a produselor generale. Verifică protecția la coroziune și regulile aplicabile ambarcațiunii.",
    whyRecommended:
      "Folosește aceste repere pentru a verifica necesarul calculat, apoi compară modele concrete.",
    merchantRegion: "EU",
    featured: false,
    lastUpdated: "2026-09-12",
    en: {
      name: "Marine DC power guide",
      description:
        "Plan starting and auxiliary batteries separately. Moisture changes cable and connection requirements.",
      recommendedFor: ["Boats"],
      advantages: "Separating loads helps preserve starting reserve.",
      compatibilityNotes:
        "Do not assume general products are marine certified. Check corrosion protection and vessel requirements.",
      brand: "M Air — editorial guide",
      whyRecommended:
        "Use these references to check the calculated requirement, then compare specific models.",
    },
  },
  {
    id: "industrial-backup-planning",
    slug: "industrial-backup-planning",
    category: "industrial-electrical",
    name: "Ghid pentru continuitatea sarcinilor industriale",
    kind: "class",
    brand: "M Air — ghid editorial",
    provider: "renogy",
    productUrl: "https://eu.renogy.com/collections/accessories-wiring",
    technicalSpecs: {
      "Sarcini / Loads": "Control, automatizare / Controls, automation",
      "Date necesare / Required data":
        "kW, kVA, curent de pornire / starting current",
    },
    description:
      "Identifică sarcinile de control care trebuie să rămână active înainte de a dimensiona rezerva pentru întreaga instalație.",
    recommendedFor: ["Control și automatizare"],
    advantages: "Separă continuitatea controlului de pornirea motoarelor mari.",
    compatibilityNotes:
      "Sunt necesare date măsurate și analiza coordonării protecțiilor. Ghidurile rezidențiale nu validează instalații trifazate industriale.",
    whyRecommended:
      "Folosește aceste repere pentru a verifica necesarul calculat, apoi compară modele concrete.",
    merchantRegion: "EU",
    featured: false,
    lastUpdated: "2026-09-12",
    en: {
      name: "Industrial load continuity guide",
      description:
        "Identify control loads that must remain active before sizing backup for the whole installation.",
      recommendedFor: ["Controls and automation"],
      advantages: "Separates control continuity from starting large motors.",
      compatibilityNotes:
        "Measured data and protection coordination are required. Residential guides do not validate industrial three-phase installations.",
      brand: "M Air — editorial guide",
      whyRecommended:
        "Use these references to check the calculated requirement, then compare specific models.",
    },
  },
];
export function localizedProduct(
  p: CatalogProduct,
  ro: boolean,
): CatalogProduct {
  return ro ? p : { ...p, ...p.en };
}
export function productsForCategory(category: string) {
  return catalog.filter((p) => p.category === category);
}
export function productsForRegion(region: MarketplaceRegion) {
  return catalog.filter(
    (p) =>
      p.merchantRegion === region ||
      (region === "RO" && p.merchantRegion === "EU"),
  );
}
export function productBySlug(slug: string) {
  return catalog.find((p) => p.slug === slug);
}

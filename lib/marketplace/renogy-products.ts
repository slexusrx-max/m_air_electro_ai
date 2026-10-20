import type { Entry } from "./catalog-data";
import { bilingual as b } from "./content";
import reviewed from "@/data/renogy-reviewed-products.json";

type Details = Omit<Entry, "id" | "slug" | "kind" | "provider" | "sourceCheckedAt" | "url">;
function model(id: string, details: Details): Entry {
  const record = reviewed.find(r => r.id === id);
  if (!record) throw new Error(`Missing reviewed Renogy variant: ${id}`);
  return { ...details, id, slug: id, kind: "product", provider: "renogy", url: record.url,
    sourceCheckedAt: record.checkedAt,
    specs: { ...details.specs, SKU: record.manufacturerSku, "Variant ID": record.variantId },
  };
}
const batteryCompatibility = b(
  "Match the charger profile, battery voltage and BMS current to the load. Confirm permitted grouping and cable/fuse sizing in the exact model manual; Ah alone does not establish inverter compatibility.",
  "Corelează profilul încărcătorului, tensiunea bateriei și curentul BMS cu sarcina. Verifică gruparea permisă, cablurile și siguranțele în manualul exact; capacitatea în Ah nu confirmă compatibilitatea cu invertorul.",
);
const panelCompatibility = b(
  "Check cold-weather open-circuit voltage and array current against the controller or power station. Matching connectors do not establish electrical compatibility; confirm mounting and cable protection.",
  "Verifică tensiunea în gol la rece și curentul ansamblului față de limitele regulatorului sau stației de energie. Mufele potrivite nu confirmă compatibilitatea electrică; verifică montajul și protecția cablurilor.",
);
const inverterCompatibility = b(
  "Requires a 12 V battery bank with sufficient continuous BMS current, appropriately sized cables and protection. Fixed home circuits require a qualified installer and suitable isolation/transfer protection; never feed household wiring through a socket.",
  "Necesită un banc de 12 V cu suficient curent continuu BMS, cabluri dimensionate și protecții. Circuitele fixe necesită instalator calificat și separare/protecție la transfer; nu alimenta instalația casei printr-o priză.",
);
const kitCompatibility = b(
  "A collection of separate components, not a plug-in power station. Confirm the supplied cable lengths, installation, DC protection, earthing and transfer arrangements with a qualified installer before connecting household circuits.",
  "Un set de componente separate, nu o stație de energie gata de conectat. Verifică lungimile cablurilor, montajul, protecțiile DC, împământarea și transferul cu un instalator calificat înainte de conectarea circuitelor casei.",
);

export const renogyProducts: Entry[] = [
  model("renogy-duoheat-core-mini-100ah", {
    title: b("Renogy DuoHeat Core Mini 100 Ah · 1 battery", "Renogy DuoHeat Core Mini 100 Ah · 1 baterie"),
    category: "lithium-batteries", paths: ["batteries", "batteries/lifepo4", "batteries/12v", "batteries/100ah"],
    summary: b("A compact 100 Ah self-heating LiFePO4 battery with a documented 100 A continuous discharge limit. This is the single-battery option, without a separate monitor.", "Baterie compactă LiFePO4 de 100 Ah cu autoîncălzire și limită documentată de descărcare continuă de 100 A. Varianta selectată conține o baterie, fără monitor separat."),
    bestFor: b("Caravan storage where controlled self-heating is useful.", "Stocare în rulote unde este utilă autoîncălzirea controlată."),
    limitations: b("No built-in Bluetooth. Do not confuse DuoHeat with the standard Core Mini. Heating requires the manufacturer's charging conditions; exact stored Wh is not inferred from the 12 V marketing label.", "Fără Bluetooth integrat. DuoHeat este diferită de Core Mini standard. Încălzirea necesită condițiile de încărcare ale producătorului; nu deducem energia exactă în Wh din eticheta comercială de 12 V."),
    compatibility: batteryCompatibility,
    facets: { voltage: "12", capacityAh: "100", chemistry: "LiFePO4", bluetooth: "No", selfHeating: "Yes", application: "RV" },
    specs: { Capacity: "100 Ah", "Continuous discharge": "100 A", Weight: "9.7 kg", "Heating power": "110 W", Bluetooth: "No", "Ingress protection": "IP65" },
  }),
  model("renogy-pro-smart-200ah", {
    title: b("Renogy Pro Smart 200 Ah · 1 battery", "Renogy Pro Smart 200 Ah · 1 baterie"),
    category: "lithium-batteries", paths: ["batteries", "batteries/lifepo4", "batteries/12v"],
    summary: b("Single 12.8 V, 200 Ah LiFePO4 battery with built-in Bluetooth and self-heating. Its documented nominal energy is 2560 Wh and continuous discharge limit is 200 A.", "O baterie LiFePO4 de 12,8 V și 200 Ah, cu Bluetooth integrat și autoîncălzire. Energia nominală documentată este 2560 Wh, iar limita de descărcare continuă este 200 A."),
    bestFor: b("Larger caravan or essential-load storage with Bluetooth monitoring.", "Stocare pentru rulote sau consumatori esențiali, cu monitorizare Bluetooth."),
    limitations: b("The manufacturer's standalone and kit pages disagree on the lower charging-temperature limit. Confirm it in the exact manual before cold-weather charging; no temperature limit is assumed here.", "Pagina bateriei și cea a kitului indică limite inferioare diferite pentru temperatura de încărcare. Confirmă limita în manualul exact înainte de încărcarea la rece; nu presupunem aici o valoare."),
    compatibility: batteryCompatibility,
    facets: { voltage: "12", capacityAh: "200", capacityWh: "2560", chemistry: "LiFePO4", bluetooth: "Yes", selfHeating: "Yes", application: "RV" },
    specs: { "Stored energy": "2560 Wh", Capacity: "200 Ah", "Continuous discharge": "200 A", "Nominal voltage": "12.8 V", Weight: "23 kg", Bluetooth: "Yes" },
  }),
  model("renogy-shadowflux-200w-2pack", {
    title: b("Renogy ShadowFlux 200 W · 2 panels + Z brackets", "Renogy ShadowFlux 200 W · 2 panouri + suporturi Z"),
    category: "solar-panels", paths: ["solar", "solar/panels", "solar/panels/rigid"],
    summary: b("The selected ShadowFlux pack contains two 200 W panels, 400 W total, with Z brackets. Voltage and current specifications below are per panel, not for a wired array.", "Pachetul ShadowFlux selectat conține două panouri de 200 W, 400 W în total, cu suporturi Z. Tensiunea și curentul de mai jos sunt pentru un panou, nu pentru ansamblul conectat."),
    bestFor: b("Two-panel permanent installations with model-specific mounting checks.", "Instalații permanente cu două panouri și montaj verificat pentru model."),
    limitations: b("This is the two-pack option, even though generic page text says one panel. Confirm the exact bracket quantity with the supplier. Anti-shading branding does not guarantee output in shade.", "Aceasta este varianta cu două panouri, deși textul generic al paginii menționează unul. Confirmă numărul exact de suporturi la furnizor. Denumirea anti-shading nu garantează producția în umbră."),
    compatibility: panelCompatibility,
    facets: { power: "400", format: "Rigid", application: "RV" },
    specs: { "Total panel power": "400 W (2 × 200 W)", "Panel count": "2", "Voc per panel": "36.5 V", "Isc per panel": "6.86 A" },
  }),
  model("renogy-rover-2-20a", {
    title: b("Renogy Rover 2 · 20 A Bluetooth MPPT", "Renogy Rover 2 · MPPT 20 A cu Bluetooth"),
    category: "charge-controllers", paths: ["solar", "solar/controllers"],
    summary: b("Compact 20 A MPPT controller with built-in Bluetooth for 12 V or 24 V battery systems. The documented PV power limit is 300 W at 12 V and 600 W at 24 V.", "Regulator MPPT compact de 20 A cu Bluetooth integrat, pentru baterii de 12 V sau 24 V. Limita documentată a puterii PV este 300 W la 12 V și 600 W la 24 V."),
    bestFor: b("Small solar arrays within the controller's voltage and power limits.", "Ansambluri solare mici, în limitele de tensiune și putere ale regulatorului."),
    limitations: b("Do not pair a 400 W array with this controller at 12 V based only on matching connectors. This is Rover 2 20 A, not Rover Li 40 A.", "Nu asocia un ansamblu de 400 W cu acest regulator la 12 V doar pentru că mufele se potrivesc. Modelul este Rover 2 20 A, nu Rover Li 40 A."),
    compatibility: panelCompatibility,
    facets: { current: "20", controllerType: "MPPT", bluetooth: "Yes" },
    specs: { "Charge current class": "20 A", "PV power limit": "300 W / 12 V; 600 W / 24 V", "Maximum PV voltage": "100 V", "Battery voltage class": "12 / 24 V", Bluetooth: "Yes" },
  }),
  model("renogy-solar-blanket-400w", {
    title: b("Renogy solar blanket · 400 W", "Renogy panou solar tip pătură · 400 W"),
    category: "solar-panels", paths: ["solar", "solar/panels", "solar/panels/portable"],
    summary: b("The 400 W folding blanket variant weighs 7.3 kg and has a documented 39.2 V open-circuit voltage. It is a different product from the 400 W suitcase.", "Varianta pliabilă tip pătură de 400 W cântărește 7,3 kg și are tensiunea în gol documentată de 39,2 V. Este diferită de valiza solară de 400 W."),
    bestFor: b("Portable generation when carrying weight matters.", "Producție solară portabilă când contează greutatea transportată."),
    limitations: b("Select the 400 W option. The exact EU variant SKU differs from the UK-labelled generic specification table; confirm regional accessories before ordering. Rated power is not a daily energy guarantee.", "Selectează varianta de 400 W. SKU-ul variantei EU diferă de eticheta UK din tabelul generic; confirmă accesoriile regionale înainte de comandă. Puterea nominală nu garantează energia zilnică."),
    compatibility: panelCompatibility,
    facets: { power: "400", format: "Portable", application: "Camping" },
    specs: { "Rated power (STC)": "400 W", Weight: "7.3 kg", "Open-circuit voltage (STC)": "39.2 V", "Operating voltage (STC)": "33.6 V", "Short-circuit current (STC)": "13.1 A" },
  }),
  model("renogy-solar-suitcase-400w", {
    title: b("Renogy lightweight solar suitcase · 400 W", "Renogy valiză solară portabilă · 400 W"),
    category: "solar-panels", paths: ["solar", "solar/panels", "solar/panels/portable"],
    summary: b("The selected 400 W portable suitcase weighs 13.7 kg and has a documented 47.2 V open-circuit voltage. It is not the lighter 400 W blanket.", "Valiza solară portabilă selectată, de 400 W, cântărește 13,7 kg și are tensiunea în gol documentată de 47,2 V. Nu este modelul mai ușor tip pătură de 400 W."),
    bestFor: b("Portable solar setups with enough space for a supported folding array.", "Sisteme solare portabile cu spațiu pentru panoul pliabil pe suporturi."),
    limitations: b("The page also offers other wattages; this link pins 400 W. Its EU variant SKU differs from the UK-labelled generic table. Confirm regional contents and transport dimensions with the supplier.", "Pagina oferă și alte puteri; acest link fixează varianta de 400 W. SKU-ul EU diferă de tabelul generic etichetat UK. Confirmă conținutul regional și dimensiunile de transport la furnizor."),
    compatibility: panelCompatibility,
    facets: { power: "400", format: "Portable", application: "Camping" },
    specs: { "Rated power (STC)": "400 W", Weight: "13.7 kg", "Open-circuit voltage (STC)": "47.2 V", "Operating voltage (STC)": "40 V", "Short-circuit current (STC)": "11 A" },
  }),
  model("renogy-backup-400w-pro-200ah-2000w", {
    title: b("Renogy backup kit · 2560 Wh / 400 W / 2000 W", "Renogy kit de rezervă · 2560 Wh / 400 W / 2000 W"),
    category: "solar-kits", paths: ["solar", "solar/kits", "backup-power"],
    summary: b("One 400 W suitcase, one Pro Smart 200 Ah battery, a 2000 W inverter and Rover Li 40 A controller. Marketed as a 2 kWh kit, its stated nominal battery energy is 2560 Wh.", "O valiză de 400 W, o baterie Pro Smart de 200 Ah, invertor de 2000 W și regulator Rover Li de 40 A. Comercializat drept kit de 2 kWh, are energia nominală declarată a bateriei de 2560 Wh."),
    bestFor: b("Planning a separate-component backup or off-grid system.", "Planificarea unui sistem de rezervă sau off-grid din componente separate."),
    limitations: b("Includes the listed solar adaptor and battery/controller tray cables. The package list does not separately confirm a BT-1 dongle; none is promised. Usable AC energy is lower than nominal battery energy.", "Include cablurile solare adaptor și cablurile baterie/regulator indicate în listă. Lista nu confirmă separat un modul BT-1; nu promitem includerea lui. Energia AC utilă este mai mică decât energia nominală a bateriei."),
    compatibility: kitCompatibility,
    facets: { capacityWh: "2560", application: "Home backup" },
    specs: { "Stored energy": "2560 Wh", "Total panel power": "400 W (1 × 400 W)", "Continuous output": "2000 W", Capacity: "200 Ah", "Charge current class": "40 A (Rover Li)" },
  }),
  model("renogy-backup-800w-300ah-2000w", {
    title: b("Renogy backup kit · 3840 Wh / 800 W / 2000 W", "Renogy kit de rezervă · 3840 Wh / 800 W / 2000 W"),
    category: "solar-kits", paths: ["solar", "solar/kits", "backup-power"],
    summary: b("Two 400 W suitcases, one self-heating Core 300 Ah battery, a 2000 W inverter and Rover Li 60 A controller. Marketed as 4 kWh, the documented nominal battery energy is 3840 Wh.", "Două valize de 400 W, o baterie Core de 300 Ah cu autoîncălzire, invertor de 2000 W și regulator Rover Li de 60 A. Comercializat drept 4 kWh, are energia nominală documentată de 3840 Wh."),
    bestFor: b("Larger separate-component backup systems with two portable panels.", "Sisteme de rezervă din componente separate, cu două panouri portabile."),
    limitations: b("The manufacturer lists a Rover Li 60 A but also prints a conflicting 20 A entry in that table. Confirm controller limits in its exact manual. The clean official photo shows two suitcases; no sale price or discount is asserted.", "Producătorul listează Rover Li 60 A, dar tabelul conține și o valoare contradictorie de 20 A. Confirmă limitele regulatorului în manualul exact. Fotografia oficială fără reclamă arată două valize; nu afirmăm un preț sau o reducere."),
    compatibility: kitCompatibility,
    facets: { capacityWh: "3840", application: "Home backup" },
    specs: { "Stored energy": "3840 Wh", "Total panel power": "800 W (2 × 400 W)", "Continuous output": "2000 W", Capacity: "300 Ah", "Controller model": "Rover Li 60 A" },
  }),
  ...([2000, 3000] as const).map(power => model(`renogy-pure-sine-${power}w`, {
    title: b(`Renogy pure sine inverter · 12 V / ${power} W`, `Renogy invertor sinus pur · 12 V / ${power} W`),
    category: "inverters", paths: ["inverters", "inverters/pure-sine", ...(power === 2000 ? ["inverters/2000w"] : [])],
    summary: b(`A ${power} W continuous pure sine inverter for 12 V battery systems. The selected EU model operates at 50 Hz; peak output is not a continuous operating rating.`, `Invertor cu sinus pur de ${power} W continuu, pentru baterii de 12 V. Modelul EU selectat funcționează la 50 Hz; puterea de vârf nu este putere continuă.`),
    bestFor: b("Battery-to-AC conversion with a correctly sized battery bank.", "Conversie de la baterie la AC, cu banc de baterii dimensionat corect."),
    limitations: b("Not a grid-export solar inverter. Battery cables are not supplied as standard. UPS transfer does not establish suitability for medical or other critical equipment; check the exact load requirements.", "Nu este un invertor solar pentru injectare în rețea. Cablurile bateriei nu sunt incluse standard. Transferul UPS nu confirmă adecvarea pentru echipamente medicale sau critice; verifică cerințele sarcinii."),
    compatibility: inverterCompatibility,
    facets: { voltage: "12", power: String(power), surgePower: String(power * 2), waveform: "Pure sine", application: "Backup" },
    specs: { "Continuous output": `${power} W`, "DC input class": "12 V", "Rated AC output": power === 2000 ? "220–240 V AC / 50 Hz" : "200–240 V AC / 50 Hz", "Peak output": `${power * 2} W`, Weight: power === 2000 ? "4.8 kg" : "6.4 kg" },
  })),
  model("renogy-flexible-175w", {
    title: b("Renogy flexible monocrystalline panel · 175 W", "Renogy panou monocristalin flexibil · 175 W"),
    category: "solar-panels", paths: ["solar", "solar/panels", "solar/panels/flexible"],
    summary: b("One 175 W flexible panel with a documented weight of 2.8 kg and open-circuit voltage of 23.9 V. Its format requires an installation method compatible with the mounting surface.", "Un panou flexibil de 175 W, cu masa documentată de 2,8 kg și tensiune în gol de 23,9 V. Formatul necesită o metodă de instalare compatibilă cu suprafața de montaj."),
    bestFor: b("Weight-sensitive installations on suitable surfaces.", "Instalații pe suprafețe adecvate, unde contează masa redusă."),
    limitations: b("Respect the exact bending and mounting instructions. Flexible does not mean foldable or walkable; avoid unsupported bending and trapped heat.", "Respectă instrucțiunile exacte de curbare și montaj. Flexibil nu înseamnă pliabil sau destinat călcării; evită îndoirea nepermisă și acumularea căldurii."),
    compatibility: panelCompatibility,
    facets: { power: "175", format: "Flexible", application: "RV" },
    specs: { "Rated power (STC)": "175 W", Weight: "2.8 kg", "Open-circuit voltage (STC)": "23.9 V", "Operating voltage (STC)": "19.5 V", "Short-circuit current (STC)": "9.5 A" },
  }),
  model("renogy-battery-monitor-500a", {
    title: b("Renogy battery monitor · 500 A shunt", "Renogy monitor de baterie · șunt 500 A"),
    category: "electrical-accessories", paths: ["electrical-components"],
    summary: b("Wired battery monitor with LCD, 500 A shunt, shielded wire, B+ wire and shunt holder. The documented working voltage range is 10–120 V.", "Monitor de baterie cu fir, ecran LCD, șunt de 500 A, cablu ecranat, cablu B+ și suport pentru șunt. Intervalul documentat al tensiunii de lucru este 10–120 V."),
    bestFor: b("Local battery-bank monitoring without depending on a phone app.", "Monitorizarea locală a bancului de baterii, fără dependență de o aplicație."),
    limitations: b("A measurement device, not a BMS, charger or protective disconnect. State-of-charge accuracy depends on correct installation, configuration and synchronization.", "Dispozitiv de măsurare, nu BMS, încărcător sau protecție de deconectare. Precizia nivelului de încărcare depinde de instalare, configurare și sincronizare."),
    compatibility: b("Route the measured current through the shunt exactly as the manual specifies. Confirm the voltage range, current rating and cable protection for the installation.", "Trece curentul măsurat prin șunt conform manualului. Verifică intervalul de tensiune, curentul nominal și protecția cablurilor pentru instalație."),
    facets: { application: "Battery monitoring" },
    specs: { "Shunt rating": "500 A", "Working voltage": "10–120 V", "Signal cable": "6 m", "B+ cable": "1 m" },
  }),
];

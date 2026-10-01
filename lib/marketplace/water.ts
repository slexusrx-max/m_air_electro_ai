import type { LocalText } from "./content";

const text = (en: string, ro: string): LocalText => ({ en, ro });
export const waterCategories = [
  { slug: "home-purification", title: text("Home Water Purification", "Purificarea apei acasă"), summary: text("Start with your water report, the taps you use and daily drinking-water demand.", "Începe cu analiza apei, robinetele utilizate și necesarul zilnic de apă potabilă."), checks: text("Identify the water source and measured contaminants before choosing treatment. Separate drinking-water needs from whole-house use.", "Identifică sursa apei și contaminanții măsurați înainte de alegerea tratării. Separă apa pentru băut de consumul întregii locuințe.") },
  { slug: "reverse-osmosis", title: text("Reverse Osmosis", "Osmoză inversă"), summary: text("Compare installation needs, recovery ratio and the exact model’s performance data.", "Compară instalarea, raportul de recuperare și performanțele modelului exact."), checks: text("Check inlet pressure, power, wastewater connection, recovery ratio and replacement schedule. An RO label alone does not verify a contaminant claim.", "Verifică presiunea de intrare, alimentarea electrică, evacuarea, raportul de recuperare și intervalele de înlocuire. Eticheta RO nu confirmă singură reducerea unui contaminant.") },
  { slug: "under-sink", title: text("Under-Sink Systems", "Sisteme sub chiuvetă"), summary: text("Plan cabinet space, plumbing connections and access for servicing.", "Planifică spațiul din dulap, racordurile și accesul pentru întreținere."), checks: text("Measure usable cabinet space. Check faucet compatibility, pressure limits, leak protection and permission for plumbing changes.", "Măsoară spațiul disponibil. Verifică bateria compatibilă, limitele de presiune, protecția la scurgeri și acordul pentru modificarea instalației.") },
  { slug: "countertop", title: text("Countertop Systems", "Sisteme de blat"), summary: text("Compare refill routines, usable tank volume and countertop footprint.", "Compară reumplerea, volumul util al rezervorului și spațiul ocupat pe blat."), checks: text("Distinguish tank-fed from faucet-connected systems. Check power requirements, cleaning instructions and batch output against your daily use.", "Distinge sistemele cu rezervor de cele conectate la robinet. Verifică alimentarea electrică, curățarea și volumul produs raportat la consumul zilnic.") },
  { slug: "whole-house", title: text("Whole-House Filtration", "Filtrare pentru întreaga locuință"), summary: text("Assess peak flow, pressure loss and the full installation before selection.", "Evaluează debitul de vârf, pierderea de presiune și instalația completă."), checks: text("Use a water analysis and measured peak demand. Plan bypass valves, drainage and service access with a qualified installer; point-of-entry filtration is not a universal drinking-water guarantee.", "Folosește o analiză a apei și consumul de vârf măsurat. Planifică bypass-ul, evacuarea și accesul cu un instalator calificat; filtrarea la intrare nu garantează universal apa potabilă.") },
  { slug: "portable", title: text("Portable Water Filters", "Filtre de apă portabile"), summary: text("Balance carrying weight, flow and model-specific protection for your route.", "Echilibrează greutatea, debitul și protecția documentată pentru traseul tău."), checks: text("Check the exact organisms and substances covered by the model’s test report, plus freeze sensitivity, cleaning and service life. Do not infer virus protection from a bacteria claim.", "Verifică organismele și substanțele exacte din raportul modelului, sensibilitatea la îngheț, curățarea și durata de utilizare. Protecția împotriva bacteriilor nu implică protecție împotriva virusurilor.") },
  { slug: "emergency-off-grid", title: text("Emergency & Off-Grid Water", "Apă pentru urgențe și off-grid"), summary: text("Plan source, treatment, storage and power as separate parts of one system.", "Planifică sursa, tratarea, stocarea și energia ca părți distincte ale sistemului."), checks: text("Follow local public-health instructions during an incident. Confirm the model is suitable for the source and identified hazard; keep a separate stored-water plan.", "Urmează instrucțiunile autorităților sanitare în caz de incident. Confirmă adecvarea modelului pentru sursă și riscul identificat; păstrează separat un plan de apă stocată.") },
  { slug: "gravity", title: text("Gravity Filters", "Filtre gravitaționale"), summary: text("Compare batch capacity and verified performance without relying on a pump.", "Compară volumul per lot și performanța verificată fără a depinde de o pompă."), checks: text("Check element identity, priming, cleaning and flow over its service life. Gravity describes the driving force, not a verified contaminant-reduction capability.", "Verifică elementul filtrant, amorsarea, curățarea și debitul pe durata utilizării. Gravitația descrie funcționarea, nu o capacitate verificată de reducere a contaminanților.") },
  { slug: "storage", title: text("Water Storage", "Stocarea apei"), summary: text("Choose drinking-water-compatible containers and a practical cleaning routine.", "Alege recipiente potrivite pentru apă potabilă și o rutină practică de curățare."), checks: text("Verify material suitability, closure, cleaning instructions and storage conditions. A storage container does not treat contaminated water.", "Verifică materialul, închiderea, instrucțiunile de curățare și condițiile de depozitare. Un recipient nu tratează apa contaminată.") },
  { slug: "replacement-filters", title: text("Replacement Filters", "Filtre de schimb"), summary: text("Match the exact cartridge, system revision and replacement interval.", "Potrivește cartușul exact, versiunea sistemului și intervalul de înlocuire."), checks: text("Match the part number and certified system configuration. Similar dimensions do not establish compatibility or preserve the original performance claim.", "Verifică codul piesei și configurația certificată. Dimensiunile similare nu confirmă compatibilitatea sau păstrarea performanței declarate.") },
] as const;

export const waterContaminants = [
  { id: "pfas", title: text("PFAS", "PFAS") },
  { id: "lead", title: text("Lead", "Plumb") },
  { id: "chlorine", title: text("Chlorine", "Clor") },
  { id: "chloramine", title: text("Chloramine", "Cloramină") },
  { id: "vocs", title: text("VOCs", "Compuși organici volatili") },
  { id: "heavy-metals", title: text("Heavy metals", "Metale grele") },
  { id: "nitrates", title: text("Nitrates", "Nitrați") },
  { id: "microplastics", title: text("Microplastics", "Microplastice") },
  { id: "microorganisms", title: text("Bacteria / protozoa", "Bacterii / protozoare") },
] as const;
export type WaterContaminant = typeof waterContaminants[number]["id"];

/** Evidence is attached to an exact catalog product and cartridge, never a brand or technology. */
export type WaterPerformanceClaim = {
  productId: string;
  model: string;
  cartridge: string;
  contaminant: WaterContaminant;
  testedSubstance: string;
  performance: string;
  conditions: string;
  officialSpecificationUrl: string;
  independentEvidence: { organization: string; url: string; standard?: string } | null;
  checkedAt: string;
};

export function documentedWaterClaims(productId: string, claims: readonly WaterPerformanceClaim[], contaminant: WaterContaminant) {
  return claims.filter(c => c.productId === productId && c.contaminant === contaminant
    && c.model.trim() && c.cartridge.trim() && c.testedSubstance.trim()
    && c.performance.trim() && c.conditions.trim() && /^https:\/\//.test(c.officialSpecificationUrl)
    && /^\d{4}-\d{2}-\d{2}$/.test(c.checkedAt));
}

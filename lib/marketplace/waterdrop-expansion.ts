import type { Entry } from "./catalog-data";
import records from "@/data/waterdrop-reviewed-expansion.json";
import { bilingual as b } from "./content";
export const waterdropExpansion: Entry[] = records.map(r => ({
 id:r.id, slug:r.id, kind:"product", provider:"waterdrop-eu", sourceCheckedAt:"2026-10-25",
 availability:r.id === "waterdrop-k19h" ? "unavailable" : "partner-check",
 title:b("Waterdrop " + r.model,"Waterdrop " + r.model), category:"water", url:r.url,
 paths:["water","water/home-purification",...(r.technology === "RO" ? ["water/reverse-osmosis"] : []),...(r.installation === "Countertop" ? ["water/countertop"] : r.installation === "Under-sink" ? ["water/under-sink"] : [])],
 summary:b("Manufacturer-listed " + r.technology + " system. Installation: " + r.installation + ". Compare the exact model and supplied configuration.","Sistem " + r.technology + " listat de producator. Verifica instalarea si configuratia exacta in manual."),
 bestFor:b("Comparing domestic water-treatment equipment after checking the source-water report.","Compararea echipamentelor pentru apa menajera dupa verificarea analizei apei."),
 limitations:b("No emergency, off-grid or contaminant-reduction suitability is asserted. Output, recovery ratio and certifications remain unknown unless separately documented.","Nu afirmam adecvarea pentru urgente, off-grid sau reducerea contaminantilor. Debitul, recuperarea si certificarile raman necunoscute fara documentatie separata."),
 compatibility:b("Verify the exact manual, water source, plumbing, power and replacement cartridges. Confirm the supplied variant with the merchant.","Verifica manualul exact, sursa apei, racordurile, alimentarea si cartusele. Confirma varianta la comerciant."), facets:{}, specs:{"Technology":r.technology,"Installation":r.installation,"Feed SKU":r.sku}
}));

import type { Entry } from "./catalog-data";
import records from "@/data/pecron-reviewed-expansion.json";
import { bilingual as b } from "./content";

export const pecronExpansion: Entry[] = records.map((r): Entry => ({
  id: r.id, slug: r.id, kind: "product", provider: "pecron-eu", sourceCheckedAt: r.checkedAt,
  title: b(r.name, r.name), category: r.category as Entry["category"], paths: r.paths, url: r.url,
  summary: b(`${r.typeEn} from the official PECRON EU catalog. Check the exact configuration with the supplier.`, `${r.typeRo} din catalogul oficial PECRON UE. Verifică configurația exactă la furnizor.`),
  bestFor: b(`Comparing the documented ${r.typeEn.toLowerCase()} after checking the exact equipment requirements.`, `Compararea produsului după verificarea cerințelor echipamentului exact.`),
  limitations: b("Manufacturer-listed ratings are not independent test results. Accessories, expansion batteries and DC supplies are not standalone 230 V power stations. Grid-connected inverters require local connection approval and qualified installation. No price, stock or Romania delivery is asserted.", "Valorile declarate de producător nu sunt rezultate ale unui test independent. Accesoriile, bateriile de extensie și sursele DC nu sunt stații autonome de 230 V. Invertoarele conectate la rețea necesită aprobarea racordării și instalare calificată. Nu afirmăm prețul, stocul sau livrarea în România."),
  compatibility: b("Verify the exact model manual, connector, polarity, voltage/current limits and supplied configuration. A listed connector or product family does not establish system compatibility. Expansion batteries require a separately compatible station; transport accessories do not include the station.", "Verifică manualul modelului exact, conectorul, polaritatea, limitele de tensiune/curent și configurația livrată. Un conector sau o familie de produse nu confirmă compatibilitatea sistemului. Bateriile de extensie necesită o stație compatibilă separată; accesoriile de transport nu includ stația."),
  facets: r.category === "solar-panels" ? { format: "portable" } : {},
  specs: Object.fromEntries(Object.entries(r.specs).filter((entry): entry is [string, string] => typeof entry[1] === "string")),
}));

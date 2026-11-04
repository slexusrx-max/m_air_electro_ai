import { bilingual as b } from "./content";

export const waterSelectionRoutes = [
  { href: "/marketplace/water/reverse-osmosis", title: b("Home reverse osmosis", "Osmoză inversă pentru acasă"), summary: b("Compare documented production, installation and replacement requirements.", "Compară producția documentată, instalarea și consumabilele.") },
  { href: "/marketplace/water/countertop", title: b("Countertop water systems", "Sisteme de apă pe blat"), summary: b("Check refilling, usable tank volume and access to electricity.", "Verifică reumplerea, volumul util și alimentarea electrică.") },
  { href: "/marketplace/water/portable", title: b("Portable filtration planning", "Planificarea filtrării portabile"), summary: b("Check source hazards and model-specific evidence. No verified products listed yet.", "Verifică riscurile sursei și dovezile modelului. Încă nu sunt listate produse verificate.") },
  { href: "/marketplace/water/emergency-off-grid", title: b("Emergency and off-grid planning", "Planificare pentru urgențe și off-grid"), summary: b("Keep safe-water storage, source assessment and treatment capability separate.", "Separă stocarea apei sigure, evaluarea sursei și capacitatea tratării.") },
];

const sourceLabels: Record<string, string> = {
  "https://www.cdc.gov/drinking-water/prevention/about-choosing-home-water-filters.html": "CDC · About Choosing Home Water Filters",
  "https://www.nsf.org/consumer-resources/articles/contaminant-reduction-claims-guide": "NSF · Contaminant Reduction Claims",
  "https://info.nsf.org/Certified/DWTU/": "NSF · Certified Drinking Water Treatment Units",
  "https://www.cdc.gov/water-emergency/about/": "CDC · How to Make Water Safe in an Emergency",
};
export function waterGuideSourceLabel(url: string) { return sourceLabels[url] ?? url; }

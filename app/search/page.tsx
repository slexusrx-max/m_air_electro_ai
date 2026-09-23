import { PlatformShell } from "@/components/platform-shell";
import { Intro, LinkGrid } from "@/components/marketplace/shared";
import { CatalogBrowser } from "@/components/marketplace/catalog-browser";
import { catalog } from "@/lib/affiliate/catalog";
import { cleanQuery, facetLabels, type CatalogQuery } from "@/lib/marketplace/query";
import { searchContent } from "@/lib/marketplace/search";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
export const metadata={...buildMetadata({title:"Caută echipamente / Search equipment",description:"Search names, brands, specifications, voltage, power, capacity and applications in the curated catalog.",path:"/search"}),robots:{index:false,follow:true}};
export default async function Page({ searchParams }: { searchParams: Promise<CatalogQuery> }) {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  const query = cleanQuery(await searchParams);
  const related = searchContent(query.q ?? "");
  return <PlatformShell><main className="commerce-page">
    <Intro title={ro ? "Caută în catalog și ghiduri" : "Search equipment and knowledge"} description={ro ? "Modele, categorii, soluții și ghiduri. Încearcă: 100 Ah, 2000 W, Renogy, RV sau MPPT." : "Models, categories, solutions and guides. Try: 100 Ah, 2000 W, Renogy, RV or MPPT."} />
    <CatalogBrowser products={catalog} query={query} path="/search" facets={Object.keys(facetLabels)} dictionary={await getRequestDictionary()} ro={ro} />
    {query.q && <section className="search-content" aria-label={ro ? "Rezultate în conținut" : "Content results"}>
      <h2>{ro ? "Categorii, soluții și ghiduri" : "Categories, solutions and guides"} ({related.length})</h2>
      {related.length ? <LinkGrid items={related} locale={locale} /> : <p>{ro ? "Încearcă solar, baterie, invertor sau backup pentru mai multe informații." : "Try solar, battery, inverter or backup to explore more information."}</p>}
    </section>}
  </main></PlatformShell>;
}

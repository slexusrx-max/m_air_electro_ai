import { PlatformShell } from "@/components/platform-shell";
import { Intro, LinkGrid } from "@/components/marketplace/shared";
import { CatalogBrowser } from "@/components/marketplace/catalog-browser";
import { catalog } from "@/lib/affiliate/catalog";
import { cleanQuery, facetLabels, type CatalogQuery } from "@/lib/marketplace/query";
import { searchContent } from "@/lib/marketplace/search";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
export async function generateMetadata() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return {
    ...buildMetadata({
      locale,
      title: ro ? "Caută echipamente" : "Search equipment",
      description: ro
        ? "Caută modele documentate și poziții din catalogul furnizorului după nume, marcă sau SKU. Filtrează numai caracteristici cunoscute."
        : "Search documented models and supplier catalog entries by name, brand or SKU. Filter only known specifications.",
      path: "/search",
    }),
    robots: { index: false, follow: true },
  };
}
export default async function Page({ searchParams }: { searchParams: Promise<CatalogQuery> }) {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  const query = cleanQuery(await searchParams);
  const related = searchContent(query.q ?? "");
  return <PlatformShell><main className="commerce-page">
    <Intro title={ro ? "Caută în catalog și ghiduri" : "Search equipment and knowledge"} description={ro ? "Modele documentate, SKU-uri din feed și ghiduri. Caută un nume, o marcă sau codul exact al furnizorului." : "Documented models, feed SKUs and guides. Search a name, brand or exact supplier code."} />
    <CatalogBrowser products={catalog} query={query} path="/search" facets={Object.keys(facetLabels)} dictionary={await getRequestDictionary()} ro={ro} />
    {query.q && <section className="search-content" aria-label={ro ? "Rezultate în conținut" : "Content results"}>
      <h2>{ro ? "Categorii, soluții și ghiduri" : "Categories, solutions and guides"} ({related.length})</h2>
      {related.length ? <LinkGrid items={related} locale={locale} /> : <p>{ro ? "Încearcă solar, baterie, invertor sau backup pentru mai multe informații." : "Try solar, battery, inverter or backup to explore more information."}</p>}
    </section>}
  </main></PlatformShell>;
}

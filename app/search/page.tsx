import { PlatformShell } from "@/components/platform-shell";
import { Intro } from "@/components/marketplace/shared";
import { CatalogBrowser } from "@/components/marketplace/catalog-browser";
import { catalog } from "@/lib/affiliate/catalog";
import { facetLabels, type CatalogQuery } from "@/lib/marketplace/query";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
export const metadata={...buildMetadata({title:"Caută echipamente / Search equipment",description:"Search names, brands, specifications, voltage, power, capacity and applications in the curated catalog.",path:"/search"}),robots:{index:false,follow:true}};
export default async function Page({searchParams}:{searchParams:Promise<CatalogQuery>}){const ro=await getRequestLocale()==="ro";return <PlatformShell><main className="commerce-page"><Intro title={ro?"Caută în catalog":"Search the catalog"} description={ro?"Caută model, marcă, tensiune, putere, capacitate sau utilizare. De exemplu: 100 Ah, 200 W, Renogy, RV.":"Search model, brand, voltage, power, capacity or use case. Try: 100 Ah, 200 W, Renogy, RV."}/><CatalogBrowser products={catalog} query={await searchParams} path="/search" facets={Object.keys(facetLabels)} dictionary={await getRequestDictionary()} ro={ro}/></main></PlatformShell>;}

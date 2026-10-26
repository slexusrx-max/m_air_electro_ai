import Link from "@/components/localized-link";
import { BrandMark } from "@/components/brand-artwork";
import { rootCategories } from "@/lib/marketplace/content";
import { catalog } from "@/lib/affiliate/catalog";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
import { ProductCard } from "./product-card";
import { AffiliateDisclosure } from "./affiliate-disclosure";
import { WaterPromo } from "./water-promo";
import { RenogyFeature } from "./renogy-feature";
import { ProductVisual } from "./product-visual";
import { QuickSolutionStarter } from "./quick-solution-starter";
import { EquipmentVisual } from "./equipment-visual";
import { CatalogBrowser } from "./catalog-browser";
import { localizedPath } from "@/lib/i18n/routing";
import { PublisherTrust } from "./publisher-trust";
import { HomeBuyingGuide } from "./home-buying-guide";

export async function DiscoveryHome({ marketplace = false, requirements }: {
  marketplace?: boolean;
  requirements?: Record<string, string | undefined>;
}) {
  const locale = await getRequestLocale();
  const dictionary = await getRequestDictionary();
  const ro = locale === "ro";
  const products = catalog.filter(p => p.provider === "renogy").slice(0, 3);
  const categorySection = <section id="equipment-categories" className="equipment-explorer" aria-labelledby="equipment-heading">
    <div className="section-line"><h2 id="equipment-heading">{ro ? "Categorii de echipamente" : "Equipment categories"}</h2><Link href="/search?kind=product">{ro ? "Toate modelele" : "All models"} →</Link></div>
    <div className="category-tiles">{rootCategories.map(category => <Link key={category.path} href={`/marketplace/${category.path}`} data-pointer-tilt>
      <div className="category-preview"><EquipmentVisual category={category.path} /></div>
      <span>{category.title[ro ? "ro" : "en"]}</span><span aria-hidden="true">↗</span>
    </Link>)}</div>
    <p><Link href="/marketplace/solar/panels">{ro ? "Panouri solare fotovoltaice" : "Photovoltaic solar panels"}</Link> · <Link href="/marketplace/batteries/lifepo4">{ro ? "Baterii LiFePO4" : "LiFePO4 batteries"}</Link></p>
    <p className="category-photo-credits"><Link href="/photo-credits">{ro ? "Sursele și licențele fotografiilor de categorii" : "Category photo sources and licences"} →</Link></p>
  </section>;
  return <main className="commerce-page discovery-home storefront-home">
    {marketplace ? <header className="page-intro marketplace-intro">
      <p className="eyebrow">Marketplace · România / EU</p>
      <h1>{ro ? "Alege echipamentul potrivit." : "Find the right equipment."}</h1>
      <p>{ro ? "Caută modele și SKU-uri, compară datele documentate și cumpără la furnizor." : "Search models and SKUs, compare documented specifications and buy from the supplier."} <Link href="/marketplace/find-my-solution">{ro ? "Ai nevoie de ajutor?" : "Need help choosing?"} →</Link></p>
    </header> : <section className="discovery-hero brand-hero">
      <div className="discovery-hero-copy">
        <p className="eyebrow">M Air Electro AI · România / EU</p>
        <h1>{marketplace ? (ro ? "Catalog de echipamente energetice" : "Energy equipment catalog") : (ro ? "Panouri solare, baterii și invertoare" : "Solar panels, batteries and inverters")}</h1>
        <p className="hero-promise">{ro ? "Găsește energia de rezervă potrivită pentru casă sau călătorii. Compară, calculează și cumpără direct la furnizor." : "Find backup power for home or life on the move. Compare, calculate and buy directly from the supplier."}</p>
        <div className="action-row">
          <Link className="button-primary" href="/marketplace/find-my-solution">{ro ? "Găsește soluția" : "Find My Solution"} →</Link>
          <Link className="button-outline" href={marketplace ? "#equipment-categories" : "/marketplace"}>{ro ? "Alege echipamente" : "Browse Equipment"} →</Link>
        </div>
        <form action={localizedPath("/marketplace", locale)} className="hero-search" role="search" aria-label={ro ? "Caută echipamente" : "Search equipment"}>
          <label className="sr-only" htmlFor="hero-query">{ro ? "Caută echipamente" : "Search equipment"}</label>
          <input id="hero-query" name="q" type="search" placeholder={ro ? "Renogy, 100 Ah, panouri solare…" : "Renogy, 100 Ah, solar panels…"} maxLength={120} />
          <button type="submit">{ro ? "Caută" : "Search"} →</button>
        </form>
        <p className="hero-assurance">{ro ? "Selecție independentă. Calcule explicabile. Achiziție la furnizor." : "Independent selection. Clear calculations. Buy from the supplier."}</p>
      </div>
      <div className="hero-equipment-showcase" aria-label={ro ? "Explorează echipamentele" : "Explore the equipment"}>
        <div className="hero-equipment-heading"><span>{ro ? "ENERGIE PENTRU FIECARE ZI" : "POWER FOR EVERY DAY"}</span><BrandMark /></div>
        <div className="hero-equipment-grid">
          {catalog.filter(p => p.provider === "renogy" && ["lithium-batteries", "solar-panels", "inverters"].includes(p.category)).slice(0, 4).map(p => <Link key={p.id} href={`/marketplace/products/${p.slug}`} className="hero-equipment-tile hero-model-tile" data-pointer-tilt>
            <ProductVisual product={p} ro={ro} />
            <span>{ro ? p.title.ro : p.name}</span>
          </Link>)}
        </div>
        <p className="hero-equipment-caption">{ro ? "Fotografii ale modelelor indicate. Componente individuale, nu un kit compatibil confirmat. Stațiile portabile PECRON și BLUETTI sunt disponibile pentru comparație în catalog." : "Photos of the named models. Individual components, not a confirmed compatible kit. PECRON and BLUETTI portable stations are also listed for comparison in the catalog."}</p>
      </div>
    </section>}
    {requirements && (requirements.batteryKwh || requirements.inverterKw) && <section className="content-panel">
      <h2>{ro ? "Cerințe primite din calculator" : "Requirements received from calculator"}</h2>
      <p>{ro ? "Baterie" : "Battery"}: {requirements.batteryKwh ?? "—"} kWh · {ro ? "Invertor" : "Inverter"}: {requirements.inverterKw ?? "—"} kW · {ro ? "Vârf" : "Surge"}: {requirements.surgeKw ?? "—"} kW · {requirements.region ?? "EU"}</p>
      <p>{ro ? "Estimări pentru sistem, nu confirmare de compatibilitate a unui produs." : "System estimates, not confirmation of product compatibility."}</p>
      <Link href="/marketplace/batteries">{ro ? "Verifică baterii" : "Review batteries"} →</Link>
    </section>}
    {marketplace && <><CatalogBrowser products={catalog} query={requirements ?? {}} path="/marketplace" facets={["voltage", "capacityAh", "power"]} dictionary={dictionary} ro={ro} />{categorySection}</>}
    {!marketplace && <>
    <PublisherTrust ro={ro} compact />
    <section className="application-section" aria-labelledby="application-heading">
      <div className="section-line"><div><p className="eyebrow">{ro ? "PORNEȘTE DE LA NEVOIE" : "START WITH YOUR EVERYDAY"}</p><h2 id="application-heading">{ro ? "Un sistem pentru felul tău de a trăi." : "A system for the way you live."}</h2></div><Link href="/solutions">{ro ? "Toate soluțiile" : "All solutions"} →</Link></div>
      <p className="small-copy">{ro ? "Alege un exemplu, adaptează consumul și autonomia, apoi vezi ce modele acoperă cerința." : "Choose an example, adjust the load and runtime, then see which models meet the requirement."}</p>
      <QuickSolutionStarter ro={ro} />
      <p><Link href="/methodology">{ro ? "Ipoteze, criterii și metodologia selecției" : "Assumptions, criteria and selection methodology"}</Link></p>
    </section>
    <section aria-labelledby="featured-models">
      <div className="section-line"><div><p className="eyebrow">{ro ? "SELECȚIE RENOGY EU" : "RENOGY EU SELECTION"}</p><h2 id="featured-models">{ro ? "Mai puține presupuneri. Alegeri mai clare." : "Less guesswork. Better-informed choices."}</h2></div><Link href="/renogy#renogy-products">{ro ? "Vezi selecția Renogy" : "View Renogy selection"} →</Link></div>
      <div className="product-grid">{products.map(product => <ProductCard key={product.id} product={product} dictionary={dictionary} />)}</div>
    </section>
    {categorySection}
    <section className="planning-editorial" aria-labelledby="planning-heading">
      <div><p className="eyebrow">{ro ? "ÎNȚELEGE ÎNAINTE SĂ ALEGI" : "UNDERSTAND BEFORE YOU CHOOSE"}</p><h2 id="planning-heading">{ro ? "De la întrebare la un plan clar." : "From a question to a clearer plan."}</h2><p>{ro ? "Puterea, autonomia și compatibilitatea contează împreună. Instrumentele noastre explică ipotezele, nu înlocuiesc proiectarea de către un specialist." : "Power, runtime and compatibility belong together. Our tools explain the assumptions, not replace professional installation design."}</p><Link href="/learn">{ro ? "Explorează ghidurile" : "Explore the guides"} →</Link></div>
      <div className="planning-links">{[
        ["/backup-calculator", "What needs to stay on?", "Ce trebuie să rămână alimentat?", "Backup planning", "Planificarea rezervei"],
        ["/calculators/battery", "How long will it last?", "Cât va dura autonomia?", "Battery sizing", "Dimensionarea bateriei"],
        ["/calculators/solar", "How much solar do I need?", "De cât solar am nevoie?", "Solar sizing", "Dimensionare solară"],
        ["/compare", "Which option fits better?", "Ce opțiune se potrivește?", "Product comparison", "Comparație de produse"],
      ].map(([href, en, romanian, label, translated]) => <Link key={href} href={href}><span>{ro ? translated : label}</span><strong>{ro ? romanian : en}</strong><span aria-hidden="true">↗</span></Link>)}</div>
    </section>
    <HomeBuyingGuide ro={ro} />
    <RenogyFeature ro={ro} />
    <PublisherTrust ro={ro} />
    <WaterPromo ro={ro} />
    </>}
    <AffiliateDisclosure dictionary={dictionary} />
  </main>;
}

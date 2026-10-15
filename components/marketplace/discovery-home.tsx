import Link from "next/link";
import Image from "next/image";
import { rootCategories } from "@/lib/marketplace/content";
import { catalog } from "@/lib/affiliate/catalog";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
import { EnergySchematic } from "@/components/energy-schematic";
import { visualFamily } from "@/lib/visual-system";
import { ProductCard } from "./product-card";
import { AffiliateDisclosure } from "./affiliate-disclosure";
import { WaterPromo } from "./water-promo";
import { RenogyFeature } from "./renogy-feature";
import { CatalogBrowser } from "./catalog-browser";

const applications = [
  ["home-backup", "Home backup", "Rezervă pentru casă", "Keep essential loads in focus.", "Pornește de la consumatorii esențiali."],
  ["rv-caravan", "RV & camper", "Rulotă și camper", "Energy for the road ahead.", "Energie pentru următoarea călătorie."],
  ["off-grid-cabin", "Off-grid cabin", "Cabană off-grid", "Plan solar, storage and autonomy.", "Planifică solarul, stocarea și autonomia."],
  ["marine", "Marine systems", "Sisteme marine", "Start with your onboard loads.", "Începe cu necesarul de la bord."],
];

export async function DiscoveryHome({ marketplace = false, requirements }: {
  marketplace?: boolean;
  requirements?: Record<string, string | undefined>;
}) {
  const locale = await getRequestLocale();
  const dictionary = await getRequestDictionary();
  const ro = locale === "ro";
  const products = catalog.filter(p => p.provider === "renogy").slice(0, 3);
  return <main className="commerce-page discovery-home">
    <section className={`discovery-hero ${marketplace ? "marketplace-hero" : "brand-hero"}`}>
      <div className="discovery-hero-copy">
        <p className="eyebrow">M Air Electro AI · România / EU</p>
        <h1>{marketplace ? (ro ? "Echipamente.\nAlegeri informate." : "Equipment.\nWithout the guesswork.") : (ro ? "Energia ta.\nAlegerea potrivită." : "Your energy.\nA clearer choice.")}</h1>
        <p>{ro ? "Descoperă panouri solare, baterii și sisteme de rezervă. Compară specificațiile sau găsește echipamentul potrivit pornind de la nevoile tale." : "Discover solar panels, batteries and backup power. Compare the specifications or find equipment around the way you live."}</p>
        <div className="action-row">
          <Link className="button-primary" href={marketplace ? "#equipment-categories" : "/marketplace"}>{ro ? "Alege echipamente" : "Browse Equipment"} <span aria-hidden="true">↗</span></Link>
          <Link className="button-outline" href="/marketplace/find-my-solution">{ro ? "Găsește soluția" : "Find My Solution"} <span aria-hidden="true">→</span></Link>
        </div>
        <form action="/search" className="hero-search" role="search" aria-label={ro ? "Caută echipamente" : "Search equipment"}>
          <label className="sr-only" htmlFor="hero-query">{ro ? "Caută echipamente" : "Search equipment"}</label>
          <input id="hero-query" name="q" type="search" placeholder={ro ? "Renogy, 100 Ah, panouri solare…" : "Renogy, 100 Ah, solar panels…"} maxLength={120} />
          <button type="submit">{ro ? "Caută" : "Search"} →</button>
        </form>
        <p className="hero-assurance">{ro ? "Selecție independentă. Calcule explicabile. Achiziție la furnizor." : "Independent selection. Clear calculations. Buy from the supplier."}</p>
      </div>
      {!marketplace && <figure className="brand-hero-art">
        <Image src="/hero.png" alt={ro ? "M Air Electro AI: litera M verde și profil uman digital" : "M Air Electro AI: lime M and futuristic digital human profile"} width={1254} height={1254} sizes="(max-width: 768px) 90vw, 45vw" preload />
        <figcaption>{ro ? "INTELIGENȚĂ. ENERGIE. VIITOR." : "INTELLIGENCE. ENERGY. FUTURE."}</figcaption>
      </figure>}
    </section>
    {requirements && (requirements.batteryKwh || requirements.inverterKw) && <section className="content-panel">
      <h2>{ro ? "Cerințe primite din calculator" : "Requirements received from calculator"}</h2>
      <p>{ro ? "Baterie" : "Battery"}: {requirements.batteryKwh ?? "—"} kWh · {ro ? "Invertor" : "Inverter"}: {requirements.inverterKw ?? "—"} kW · {ro ? "Vârf" : "Surge"}: {requirements.surgeKw ?? "—"} kW · {requirements.region ?? "EU"}</p>
      <p>{ro ? "Estimări pentru sistem, nu confirmare de compatibilitate a unui produs." : "System estimates, not confirmation of product compatibility."}</p>
      <Link href="/marketplace/batteries">{ro ? "Verifică baterii" : "Review batteries"} →</Link>
    </section>}
    <section id="equipment-categories" className="equipment-explorer" aria-labelledby="equipment-heading">
      <div className="section-line"><div><p className="eyebrow">{ro ? "EXPLORARE DIRECTĂ" : "STRAIGHT TO THE EQUIPMENT"}</p><h2 id="equipment-heading">{ro ? "Ce construiești?" : "What are you building?"}</h2></div><Link href="/search?kind=product">{ro ? "Toate modelele" : "All models"} →</Link></div>
      <div className="category-tiles">{rootCategories.map(category => <Link key={category.path} href={`/marketplace/${category.path}`}>
        <EnergySchematic family={visualFamily(`/marketplace/${category.path}`)} className="category-symbol" />
        <span>{category.title[ro ? "ro" : "en"]}</span><span aria-hidden="true">↗</span>
      </Link>)}</div>
    </section>
    {marketplace ? <CatalogBrowser products={catalog} query={{ kind: "product", ...requirements }} path="/marketplace" facets={["voltage", "capacityAh", "power"]} dictionary={dictionary} ro={ro} /> : <>
    <section className="application-section" aria-labelledby="application-heading">
      <div className="section-line"><div><p className="eyebrow">{ro ? "PORNEȘTE DE LA NEVOIE" : "START WITH YOUR EVERYDAY"}</p><h2 id="application-heading">{ro ? "Un sistem pentru felul tău de a trăi." : "A system for the way you live."}</h2></div><Link href="/solutions">{ro ? "Toate soluțiile" : "All solutions"} →</Link></div>
      <div className="application-grid">{applications.map(([slug, en, romanian, summary, translated]) => <Link key={slug} href={`/marketplace/find-my-solution?application=${slug}`}>
        <EnergySchematic family={slug === "marine" ? "marine" : slug === "off-grid-cabin" ? "solar" : "backup"} className="application-symbol" />
        <h3>{ro ? romanian : en}</h3><p>{ro ? translated : summary}</p><span>{ro ? "Configurează necesarul" : "Find your starting point"} →</span>
      </Link>)}</div>
    </section>
    <RenogyFeature ro={ro} />
    <section aria-labelledby="featured-models">
      <div className="section-line"><div><p className="eyebrow">{ro ? "SELECȚIE RENOGY EU" : "RENOGY EU SELECTION"}</p><h2 id="featured-models">{ro ? "Mai puține presupuneri. Alegeri mai clare." : "Less guesswork. Better-informed choices."}</h2></div><Link href="/renogy#renogy-products">{ro ? "Vezi selecția Renogy" : "View Renogy selection"} →</Link></div>
      <div className="product-grid">{products.map(product => <ProductCard key={product.id} product={product} dictionary={dictionary} />)}</div>
    </section>
    <section className="planning-editorial" aria-labelledby="planning-heading">
      <div><p className="eyebrow">{ro ? "ÎNȚELEGE ÎNAINTE SĂ ALEGI" : "UNDERSTAND BEFORE YOU CHOOSE"}</p><h2 id="planning-heading">{ro ? "De la întrebare la un plan clar." : "From a question to a clearer plan."}</h2><p>{ro ? "Puterea, autonomia și compatibilitatea contează împreună. Instrumentele noastre explică ipotezele, nu înlocuiesc proiectarea de către un specialist." : "Power, runtime and compatibility belong together. Our tools explain the assumptions, not replace professional installation design."}</p><Link href="/learn">{ro ? "Explorează ghidurile" : "Explore the guides"} →</Link></div>
      <div className="planning-links">{[
        ["/backup-calculator", "What needs to stay on?", "Ce trebuie să rămână alimentat?", "Backup planning", "Planificarea rezervei"],
        ["/calculators/battery", "How long will it last?", "Cât va dura autonomia?", "Battery sizing", "Dimensionarea bateriei"],
        ["/calculators/solar", "How much solar do I need?", "De cât solar am nevoie?", "Solar sizing", "Dimensionare solară"],
        ["/compare", "Which option fits better?", "Ce opțiune se potrivește?", "Product comparison", "Comparație de produse"],
      ].map(([href, en, romanian, label, translated]) => <Link key={href} href={href}><span>{ro ? translated : label}</span><strong>{ro ? romanian : en}</strong><span aria-hidden="true">↗</span></Link>)}</div>
    </section>
    <WaterPromo ro={ro} />
    </>}
    <AffiliateDisclosure dictionary={dictionary} />
  </main>;
}

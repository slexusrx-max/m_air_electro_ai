import Link from "next/link";
import { PlatformShell } from "@/components/platform-shell";
import { RenogyFeature } from "@/components/marketplace/renogy-feature";
import { ProductCard } from "@/components/marketplace/product-card";
import { Breadcrumbs } from "@/components/marketplace/shared";
import { ItemListStructuredData } from "@/components/marketplace/structured-data";
import { AffiliateDisclosure } from "@/components/marketplace/affiliate-disclosure";
import { catalog } from "@/lib/affiliate/catalog";
import { supplierLink } from "@/lib/affiliate/providers";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
import styles from "@/components/marketplace/renogy.module.css";

const products = catalog.filter((product) => product.provider === "renogy");
const categories = [
  ["/marketplace/solar/panels", "Solar panels", "Panouri solare"],
  ["/marketplace/batteries/lifepo4", "LiFePO4 batteries", "Acumulatoare LiFePO4"],
  ["/marketplace/inverters/pure-sine", "Pure sine inverters", "Invertoare sinus pur"],
  ["/marketplace/solar/controllers", "MPPT controllers", "Regulatoare MPPT"],
  ["/marketplace/chargers/dc-dc", "DC-DC chargers", "Încărcătoare DC-DC"],
  ["/solutions/off-grid-cabin", "Portable & off-grid", "Portabil și off-grid"],
  ["/marketplace/electrical-components", "System components", "Componente de sistem"],
  ["/compare", "Your comparison", "Comparația ta"],
];

export async function generateMetadata() {
  const locale = await getRequestLocale();
  return buildMetadata({ locale, path: "/renogy",
    title: locale === "ro" ? "Renogy România: solar, LiFePO4 și invertoare | Partener afiliat independent" : "Renogy Romania & EU: solar, LiFePO4 and inverters | Independent affiliate partner",
    description: locale === "ro" ? "Compară 7 modele Renogy EU, verifică limitele și compatibilitatea și dimensionează sistemul cu calculatoare independente. Achiziția se face la comerciant." : "Compare 7 Renogy EU models, check limitations and compatibility, and size your system with independent calculators. Purchase directly from the merchant.",
  });
}

export default async function RenogyPage() {
  const [locale, dictionary] = await Promise.all([getRequestLocale(), getRequestDictionary()]);
  const ro = locale === "ro";
  const active = products.filter((product) => supplierLink(product).tracked).length;
  return <PlatformShell><main className="commerce-page">
    <Breadcrumbs items={[{ name: "Marketplace", path: "/marketplace" }, { name: "Renogy", path: "/renogy" }]} />
    <ItemListStructuredData name="Renogy EU equipment selection" products={products} />
    <RenogyFeature ro={ro} storefront />
    <div className={styles.status} data-testid="renogy-tracking-status">
      <strong>{ro ? "Parteneriat aprobat prin Impact. " : "Partnership approved through Impact. "}</strong>
      {active > 0
        ? (ro ? `${active} linkuri Renogy marcate ca afiliate sunt active. Celelalte linkuri rămân obișnuite.` : `${active} marked Renogy affiliate links are active. Other links remain ordinary.`)
        : (ro ? "Linkurile Renogy sunt momentan obișnuite, fără urmărire afiliată. Activarea necesită adresele emise de rețea și confirmarea campaniei EU." : "Renogy links currently remain ordinary, without affiliate tracking. Activation requires network-issued URLs and EU campaign confirmation.")}
      {" "}{ro ? "Comerciantul stabilește prețul, stocul, plata, livrarea, garanția și retururile. Confirmă livrarea în România înainte de comandă." : "The merchant controls price, stock, payment, shipping, warranty and returns. Confirm Romanian delivery before ordering."}
    </div>
    <section className={styles.section} aria-labelledby="renogy-categories">
      <div className={styles.heading}><div><p className={styles.eyebrow}>01 / {ro ? "COMPONENTE" : "COMPONENTS"}</p><h2 id="renogy-categories">{ro ? "Un sistem. Fiecare piesă contează." : "One system. Every part matters."}</h2></div><p className={styles.intro}>{ro ? "Explorează categoriile complete ale marketplace-ului, inclusiv alternativele altor furnizori. Nicio piesă nu este compatibilă automat." : "Explore the full marketplace categories, including other suppliers' alternatives. No component is automatically compatible."}</p></div>
      <div className={styles.categories}>{categories.map(([href, en, romanian], index) => <Link className={styles.category} href={href} key={href}><span>0{index + 1} <span aria-hidden="true">↗</span></span><strong>{ro ? romanian : en}</strong></Link>)}</div>
    </section>
    <section id="renogy-products" className={styles.section} aria-labelledby="renogy-products-title">
      <div className={styles.heading}><div><p className={styles.eyebrow}>02 / {ro ? "SELECȚIE DOCUMENTATĂ" : "DOCUMENTED SELECTION"}</p><h2 id="renogy-products-title">{ro ? "Compară specificații. Înțelege limitele." : "Compare specifications. Understand limitations."}</h2></div><Link href="/compare" className="text-link">{ro ? "Deschide comparația" : "Open comparison"} →</Link></div>
      <p className={styles.intro}>{ro ? "Șapte modele din catalogul nostru, cu surse oficiale Renogy EU. Specificațiile provin de la producător, nu din teste practice proprii. Imaginile sunt ilustrative, nu fotografii autorizate ale modelelor." : "Seven models from our catalog, with official Renogy EU sources. Specifications are manufacturer-stated, not our hands-on test results. Images are illustrative, not licensed photographs of these models."}</p>
      <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} dictionary={dictionary} extended />)}</div>
    </section>
    <section className={styles.section} aria-labelledby="renogy-planning">
      <div className={styles.heading}><div><p className={styles.eyebrow}>03 / {ro ? "PLANIFICĂ ÎNAINTE DE CUMPĂRARE" : "PLAN BEFORE PURCHASE"}</p><h2 id="renogy-planning">{ro ? "Începe cu energia de care ai nevoie." : "Start with the energy you need."}</h2></div></div>
      <div className={styles.steps}>
        <article><span>01 / Wh</span><h3>{ro ? "Consum și autonomie" : "Load and runtime"}</h3><p>{ro ? "Adună consumatorii, timpul de funcționare și vârfurile de pornire. Puterea în W nu este energia în Wh." : "List your loads, operating hours and startup peaks. Power in W is not energy in Wh."}</p><Link href="/backup-calculator">{ro ? "Calculator rezervă" : "Backup calculator"} →</Link></article>
        <article><span>02 / V · A</span><h3>{ro ? "Baterie și protecție" : "Battery and protection"}</h3><p>{ro ? "Verifică tensiunea, curentul BMS, profilul de încărcare și temperaturile. O baterie cu BMS de 100 A nu susține automat 2 kW continuu la 12,8 V." : "Check voltage, BMS current, charging profile and temperatures. A 100 A BMS battery does not automatically support 2 kW continuously at 12.8 V."}</p><Link href="/calculators/battery">{ro ? "Dimensionare baterie" : "Battery sizing"} →</Link></article>
        <article><span>03 / PV</span><h3>{ro ? "Solar și conversie" : "Solar and conversion"}</h3><p>{ro ? "Verifică tensiunea PV la rece, limitele MPPT, curentul cablurilor și protecțiile. Calculele sunt orientative, nu un proiect de instalație." : "Check cold-weather PV voltage, MPPT limits, cable current and protection. Calculations are planning estimates, not an installation design."}</p><Link href="/calculators/solar">{ro ? "Dimensionare solară" : "Solar sizing"} →</Link></article>
      </div>
      <p className={styles.intro}>{ro ? "Instalațiile fixe și conectarea la rețea necesită verificare de către un specialist calificat. Nu conecta un invertor la instalația casei fără separarea și protecțiile proiectate corespunzător." : "Fixed installations and grid connections require review by a qualified professional. Do not connect an inverter to household wiring without properly designed isolation and protection."}</p>
    </section>
    <section className="content-panel"><h2>{ro ? "Întrebări frecvente" : "Frequently asked questions"}</h2>{[
      { q: ro ? "M Air este dealer Renogy?" : "Is M Air a Renogy dealer?", a: ro ? "Nu. Suntem editor și partener afiliat independent. Comerciantul gestionează achiziția, plata, livrarea și garanția." : "No. We are an independent publisher and affiliate partner. The merchant handles the purchase, payment, shipping and warranty." },
      { q: ro ? "Produsele sunt compatibile între ele?" : "Are these products compatible with each other?", a: ro ? "Nu automat. Verifică tensiunile, limitele de curent, conectorii, profilele de încărcare și manualele modelelor exacte. Compararea nu reprezintă aprobarea unui sistem." : "Not automatically. Check voltages, current limits, connectors, charging profiles and the exact model manuals. Comparison does not approve a system." },
      { q: ro ? "Unde găsesc prețul și livrarea?" : "Where can I find pricing and shipping?", a: ro ? "Pe pagina comerciantului pentru modelul exact. Nu publicăm prețuri sau stocuri neverificate. Eligibilitatea livrării se confirmă la comerciant." : "On the merchant page for the exact model. We do not publish unverified prices or stock. Confirm shipping eligibility with the merchant." },
    ].map(({ q, a }) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
    <AffiliateDisclosure dictionary={dictionary} />
  </main></PlatformShell>;
}

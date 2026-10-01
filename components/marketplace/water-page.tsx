import Link from "next/link";
import Image from "next/image";
import { PlatformShell } from "@/components/platform-shell";
import { Breadcrumbs, Faq } from "./shared";
import { local, type Category } from "@/lib/marketplace/content";
import type { Locale } from "@/lib/i18n/types";
import { waterCategories } from "@/lib/marketplace/water";
import { waterSuppliers } from "@/lib/affiliate/providers/water";
import { catalog } from "@/lib/affiliate/catalog";
import { WaterDiscovery } from "./water-discovery";
import styles from "./water.module.css";

export function WaterPage({ category, locale }: { category: Category; locale: Locale }) {
  const ro = locale === "ro";
  const hub = category.path === "water";
  return <PlatformShell><main className={`commerce-page ${styles.water}`}>
    <Breadcrumbs items={[{ name: "Marketplace", path: "/marketplace" }, { name: ro ? "Apă și reziliență" : "Water & Resilience", path: "/marketplace/water" }, ...(!hub ? [{ name: local(category.title, locale), path: `/marketplace/${category.path}` }] : [])]} />
    <header className={`water-hero ${hub ? "water-hero-with-art" : ""}`}>
      <div className="water-hero-copy"><p className="water-kicker">M AIR ELECTRO AI / {ro ? "APĂ ȘI REZILIENȚĂ" : "WATER & RESILIENCE"}</p>
        <h1>{hub ? (ro ? <>Apă pură.<br /><span>Un viitor mai luminos.</span></> : <>Pure Water.<br /><span>Brighter Tomorrow.</span></>) : local(category.title, locale)}</h1>
        <p>{hub ? (ro ? "Soluții de apă de încredere pentru o viață mai sigură, mai sănătoasă și mai independentă — acasă, în călătorie și off-grid." : "Reliable water solutions for a safer, healthier and more independent life — at home, on the go and off-grid.") : local(category.summary, locale)}</p>
        <div className="water-actions"><a className="water-button" href="#water-categories">{ro ? "Explorează soluțiile de apă" : "Explore Water Solutions"} ↗</a><a className="water-secondary" href="#finder">{ro ? "Găsește sistemul tău de apă" : "Find Your Water System"} →</a></div>
      </div>
      {hub && <figure className="water-hero-art"><Image src="/water/crystal-hero.png" alt={ro ? "M Air Electro AI — cristal strălucitor cu munți în interior, deasupra apei turcoaz. Pure Water. Brighter Tomorrow." : "M Air Electro AI — sparkling crystal with mountains inside, above turquoise water. Pure Water. Brighter Tomorrow."} width={1536} height={1024} sizes="(max-width: 900px) 90vw, 55vw" preload /></figure>}
    </header>
    {!hub && <section className="water-section"><p className="water-kicker">{ro ? "ÎNAINTE DE A ALEGE" : "BEFORE YOU CHOOSE"}</p><h2>{ro ? "Criterii pentru sistemul tău" : "Your system checklist"}</h2><p>{local(category.checks, locale)}</p><p>{ro ? "Nu există încă modele cu performanță verificată în această categorie. Nu presupunem prețuri, disponibilitate sau certificări." : "There are no performance-verified models in this category yet. Prices, availability and certifications are not assumed."}</p><Link href="/learn/choosing-water-system">{ro ? "Citește ghidul de alegere" : "Read the selection guide"} →</Link></section>}
    <section id="water-categories" className="water-section">
      <div className="water-section-heading"><div><p className="water-kicker">{ro ? "ACASĂ / ÎN CĂLĂTORIE / OFF-GRID" : "HOME / ON THE GO / OFF-GRID"}</p><h2>{ro ? "Apa potrivită vieții tale" : "Water for the way you live"}</h2></div><p>{ro ? "Explorează după utilizare și instalare. Verifică performanța separat, pentru fiecare model." : "Explore by use and installation. Verify performance separately for each model."}</p></div>
      <div className="water-category-grid">{waterCategories.map((c, i) => <Link key={c.slug} href={`/marketplace/water/${c.slug}`} aria-current={category.path === `water/${c.slug}` ? "page" : undefined}><span className="water-number">{String(i + 1).padStart(2, "0")} /</span><h3>{local(c.title, locale)} <span aria-hidden="true">↗</span></h3><p>{local(c.summary, locale)}</p></Link>)}</div>
    </section>
    <WaterDiscovery ro={ro} products={catalog.filter(p => p.category === "water" && p.kind === "product")} />
    <section className="water-section water-proof"><p className="water-kicker">{ro ? "MODELUL EXACT. DOVADA EXACTĂ." : "EXACT MODEL. EXACT EVIDENCE."}</p><h2>{ro ? "O alegere informată începe cu documentația" : "An informed choice starts with documentation"}</h2><p>{ro ? "Caută substanța testată, cartușul, capacitatea și condițiile de test. O certificare nu acoperă automat toți contaminanții. Livrarea în România și disponibilitatea filtrelor de schimb se confirmă la furnizor." : "Look for the tested substance, cartridge, capacity and test conditions. A certification does not automatically cover every contaminant. Confirm Romanian delivery and replacement-filter availability with the supplier."}</p><div className="water-actions"><Link href="/learn/choosing-water-system">{ro ? "Ghid de alegere" : "Selection guide"} →</Link><a href="https://info.nsf.org/Certified/DWTU/">{ro ? "Verifică registrul NSF" : "Check the NSF registry"} ↗</a><Link href="/solutions/off-grid-cabin">{ro ? "Planifică energia off-grid" : "Plan off-grid energy"} →</Link></div></section>
    <section className="water-section"><p className="water-kicker">{ro ? "SURSE OFICIALE / EUROPA" : "OFFICIAL SOURCES / EUROPE"}</p><h2>{ro ? "Explorează furnizorii" : "Explore suppliers"}</h2><p>{ro ? "Linkuri obișnuite către site-urile oficiale. Nu afirmăm aprobarea unui parteneriat afiliat. Achiziția, prețul și livrarea sunt gestionate de furnizor." : "Ordinary links to official websites. No affiliate partnership approval is claimed. Purchase, price and delivery are handled by the supplier."}</p><div className="water-suppliers">{waterSuppliers.filter(s => s.phase === "initial").map(s => <a key={s.id} href={s.url!}>{s.name}<span aria-hidden="true">↗</span></a>)}</div><p className="water-small">{ro ? "În evaluare pentru viitor, fără listări active:" : "For future evaluation, with no active listings:"} ZeroWater Europe · Pure Filters · Katadyn</p></section>
    <Faq ro={ro} question={ro ? "Un filtru reduce automat toți contaminanții?" : "Does a filter automatically reduce every contaminant?"} answer={ro ? "Nu. Contează modelul exact, cartușul și substanțele din documentația oficială și din certificarea sau testul independent disponibil. Capacitatea nedocumentată rămâne necunoscută." : "No. The exact model, cartridge and substances covered by the official documentation and available independent certification or test matter. Undocumented capability remains unknown."} />
  </main></PlatformShell>;
}

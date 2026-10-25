import { renogyLink } from "@/lib/affiliate/providers/renogy";
import Link from "@/components/localized-link";
import { PlatformShell } from "@/components/platform-shell";
import { Breadcrumbs } from "@/components/marketplace/shared";
import { AffiliateDisclosure } from "@/components/marketplace/affiliate-disclosure";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
import { renogyFeedProducts } from "@/data/renogy-extra-feed-products";
import styles from "./catalog.module.css";

const categories = [
  ["Batteries", "Acumulatoare"],
  ["Solar panels", "Panouri solare"],
  ["Inverters", "Invertoare"],
  ["Charge controllers", "Regulatoare de încărcare"],
  ["Chargers", "Încărcătoare"],
  ["Systems and kits", "Sisteme și kituri"],
  ["Power stations", "Stații electrice"],
  ["Components", "Componente"],
] as const;

export async function generateMetadata() {
  const locale = await getRequestLocale();
  return buildMetadata({
    locale,
    path: "/renogy/catalog",
    title: locale === "ro" ? "Catalog extins Renogy EU" : "Extended Renogy EU catalog",
    description: locale === "ro"
      ? `Răsfoiește ${renogyFeedProducts.length} de pagini suplimentare de produse Renogy din feed-ul furnizat.`
      : `Browse ${renogyFeedProducts.length} additional Renogy product pages from the supplied feed.`,
  });
}

export default async function RenogyCatalogPage() {
  const [locale, dictionary] = await Promise.all([getRequestLocale(), getRequestDictionary()]);
  const ro = locale === "ro";
  return <PlatformShell><main className="commerce-page">
    <Breadcrumbs items={[
      { name: "Marketplace", path: "/marketplace" },
      { name: "Renogy", path: "/renogy" },
      { name: ro ? "Catalog extins" : "Extended catalog", path: "/renogy/catalog" },
    ]} />
    <header className={styles.header}>
      <p className={styles.eyebrow}>{ro ? "CATALOG EU DIN FEED-UL IMPACT" : "EU CATALOG FROM THE IMPACT FEED"}</p>
      <h1>{ro ? "Mai multe produse Renogy, în același loc." : "More Renogy products, in one place."}</h1>
      <p>{ro
        ? `Explorează ${renogyFeedProducts.length} de pagini suplimentare din feed-ul furnizat. Sunt pagini ale comerciantului, care pot grupa mai multe variante sau pachete; nu sunt modele verificate individual de noi. Denumirile produselor sunt păstrate în limba sursei. Verifică varianta și compatibilitatea la Renogy.`
        : `Explore ${renogyFeedProducts.length} additional pages from the supplied feed. These are merchant pages that may group several variants or packs, not individually verified models. Product names retain the source language. Confirm the variant and compatibility with Renogy.`}</p>
      <p className={styles.note}>{ro
        ? "Numărul SKU-urilor este preluat din feed și descrie variantele listate acolo; nu confirmă stocul actual. Linkurile afiliate marcate ne pot aduce un comision. Linkurile nemarcate rămân obișnuite. Prețurile și disponibilitatea se verifică la comerciant."
        : "SKU counts come from the feed and describe variants listed there; they do not confirm current stock. Marked affiliate links may earn us commission. Unmarked links remain ordinary. Check price and availability with the merchant."}</p>
    </header>
    <nav className={styles.nav} aria-label={ro ? "Categorii de produse" : "Product categories"}>
      {categories.map(([en, romanian]) => {
        const count = renogyFeedProducts.filter((product) => product.category === en).length;
        if (!count) return null;
        return <Link key={en} href={`#${en.toLowerCase().replaceAll(" ", "-")}`}>{ro ? romanian : en} <span>{count}</span></Link>;
      })}
    </nav>
    {categories.map(([en, romanian]) => {
      const items = renogyFeedProducts.filter((product) => product.category === en);
      if (!items.length) return null;
      return <section key={en} id={en.toLowerCase().replaceAll(" ", "-")} className={styles.group}>
        <h2>{ro ? romanian : en}</h2>
        <div className={styles.grid}>
          {items.map((product) => { const link = renogyLink(product.url); return <article key={product.url} className={styles.card}>
            <div className={styles.cardTop}><span aria-hidden="true">RENOGY EU</span><span>{ro ? `${product.skuCount} SKU în feed` : `${product.skuCount} feed SKU`}</span></div>
            <h3>{product.name}</h3>
            <a href={link.href} target="_blank" rel={link.tracked ? "sponsored noopener noreferrer" : "noopener noreferrer"} data-tracking-status={link.tracked ? "active" : "ordinary"}>
              {ro ? "Vezi variantele la Renogy" : "View variants at Renogy"} <span aria-hidden="true">↗</span>
              {link.tracked ? (ro ? " (link afiliat)" : " (affiliate link)") : ""}
            </a>
          </article>; })}
        </div>
      </section>;
    })}
    <p className={styles.back}><Link href="/renogy">← {ro ? "Înapoi la selecția documentată" : "Back to the documented selection"}</Link></p>
    <AffiliateDisclosure dictionary={dictionary} />
  </main></PlatformShell>;
}

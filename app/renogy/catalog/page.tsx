import { RenogyFeedLink } from "@/components/marketplace/renogy-feed-link";
import Link from "@/components/localized-link";
import { PlatformShell } from "@/components/platform-shell";
import { Breadcrumbs } from "@/components/marketplace/shared";
import { AffiliateDisclosure } from "@/components/marketplace/affiliate-disclosure";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
import feed from "@/data/renogy-feed-variants.json";
import { localizedPath } from "@/lib/i18n/routing";
import { supplierEntryName } from "@/lib/marketplace/supplier-discovery";
import styles from "./catalog.module.css";

const PAGE_SIZE = 48;
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim().slice(0, 120) ?? "";
}

export async function generateMetadata({ searchParams }: Props) {
  const locale = await getRequestLocale();
  const params = await searchParams;
  return {
    ...buildMetadata({
    locale,
    path: "/renogy/catalog",
    title: locale === "ro" ? "Catalog Renogy EU cu 365 SKU" : "Renogy EU catalog with 365 SKUs",
    description: locale === "ro"
      ? "Caută toate cele 365 de poziții SKU Renogy EU. Compară denumirile și verifică oferta actuală direct la furnizor."
      : "Search all 365 Renogy EU SKU entries. Find the exact model or variant and check the current offer with the supplier.",
    }),
    ...(first(params.q) || first(params.page) ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function RenogyCatalogPage({ searchParams }: Props) {
  const [locale, dictionary, rawParams] = await Promise.all([
    getRequestLocale(), getRequestDictionary(), searchParams,
  ]);
  const ro = locale === "ro";
  const query = first(rawParams.q);
  const normalized = query.toLocaleLowerCase();
  const filtered = feed.products.filter(product => !normalized ||
    product.name.toLocaleLowerCase().includes(normalized) || product.sku.includes(normalized));
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requestedPage = Number.parseInt(first(rawParams.page), 10);
  const currentPage = Number.isInteger(requestedPage) ? Math.min(Math.max(requestedPage, 1), pageCount) : 1;
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hrefForPage = (page: number) => `/renogy/catalog?${new URLSearchParams({
    ...(query ? { q: query } : {}), ...(page > 1 ? { page: String(page) } : {}),
  })}`.replace(/\?$/, "");

  return <PlatformShell><main className="commerce-page">
    <Breadcrumbs items={[
      { name: "Marketplace", path: "/marketplace" },
      { name: "Renogy", path: "/renogy" },
      { name: ro ? "Catalog 365 SKU" : "365-SKU catalog", path: "/renogy/catalog" },
    ]} />
    <header className={styles.header}>
      <p className={styles.eyebrow}>{ro ? "CATALOG EU DIN FEED-UL IMPACT" : "EU CATALOG FROM THE IMPACT FEED"}</p>
      <h1>{ro ? "Toate cele 365 de poziții Renogy." : "All 365 Renogy catalog entries."}</h1>
      <p>{ro
        ? "Fiecare card reprezintă un SKU din catalogul furnizorului. Variantele rămân separate; verifică modelul, pachetul și compatibilitatea pe pagina furnizorului."
        : "Each card represents a supplier-catalog SKU. Variants remain separate; confirm the exact model, package and compatibility on the supplier page."}</p>
      <p className={styles.note}>{ro
        ? "Nu afișăm prețuri, reduceri sau stoc. Verifică oferta actuală, livrarea și condițiile direct la Renogy EU."
        : "We do not display prices, discounts or stock. Check the current offer, delivery and terms directly at Renogy EU."}</p>
    </header>

    <form className={styles.search} action={localizedPath("/renogy/catalog", locale)}>
      <label htmlFor="renogy-catalog-search">{ro ? "Caută după model, variantă sau SKU" : "Search by model, variant or SKU"}</label>
      <div><input id="renogy-catalog-search" name="q" type="search" defaultValue={query} maxLength={120} /><button className="button-primary" type="submit">{ro ? "Caută" : "Search"}</button>{query && <Link href="/renogy/catalog">{ro ? "Resetează" : "Reset"}</Link>}</div>
    </form>

    <div className={styles.summary} role="status"><strong>{filtered.length}</strong> {ro ? "poziții găsite" : "entries found"} · {ro ? "pagina" : "page"} {currentPage}/{pageCount}</div>
    {visible.length ? <section aria-label={ro ? "Poziții de catalog Renogy" : "Renogy catalog entries"}>
      <div className={styles.grid}>
        {visible.map(product => {
          return <article key={product.sku} className={styles.card} data-feed-sku={product.sku} data-price-status="unavailable">
            <div className={styles.cardTop}><span>RENOGY EU</span><span>SKU {product.sku}</span></div>
            {product.imageUrl && <figure className={styles.photo}>
              <img src={product.imageUrl} alt={supplierEntryName(product)} width="600" height="420" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
            </figure>}
            <h2>{supplierEntryName(product)}</h2>
            <p className={styles.variant}>{product.kind === "variant" ? (ro ? "Variantă feed" : "Feed variant") : product.kind === "parent" ? (ro ? "Poziție principală feed" : "Feed parent entry") : (ro ? "Poziție unică feed" : "Single feed entry")}</p>
            <p className={styles.unavailable}>{ro ? "Prețul se verifică la furnizor" : "Check current price with supplier"}</p>
            <RenogyFeedLink entry={product} ro={ro}>{ro ? "Vezi această poziție la Renogy" : "View this entry at Renogy"}</RenogyFeedLink>
          </article>;
        })}
      </div>
    </section> : <section className="content-panel"><h2>{ro ? "Nicio potrivire" : "No matches"}</h2><p>{ro ? "Verifică denumirea sau introdu SKU-ul numeric." : "Check the name or enter the numeric SKU."}</p></section>}

    {pageCount > 1 && <nav className={styles.pagination} aria-label={ro ? "Pagini catalog" : "Catalog pages"}>
      {currentPage > 1 && <Link href={hrefForPage(currentPage - 1)}>← {ro ? "Anterior" : "Previous"}</Link>}
      {Array.from({ length: pageCount }, (_, index) => index + 1).map(page => <Link key={page} href={hrefForPage(page)} aria-current={page === currentPage ? "page" : undefined}>{page}</Link>)}
      {currentPage < pageCount && <Link href={hrefForPage(currentPage + 1)}>{ro ? "Următor" : "Next"} →</Link>}
    </nav>}
    <p className={styles.back}><Link href="/renogy">← {ro ? "Înapoi la selecția documentată" : "Back to the documented selection"}</Link></p>
    <AffiliateDisclosure dictionary={dictionary} />
  </main></PlatformShell>;
}

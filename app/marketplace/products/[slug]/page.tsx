import Link from "next/link";
import { specificationLabel } from "@/lib/marketplace/specifications";
import { notFound, permanentRedirect } from "next/navigation";
import { PlatformShell } from "@/components/platform-shell";
import { AffiliateDisclosure } from "@/components/marketplace/affiliate-disclosure";
import {
  Breadcrumbs,
  Intro,
  Faq,
  LinkGrid,
} from "@/components/marketplace/shared";
import { CompareControl } from "@/components/marketplace/compare-control";
import { EquipmentVisual } from "@/components/marketplace/equipment-visual";
import { ProductStructuredData } from "@/components/marketplace/structured-data";
import { ProductCard } from "@/components/marketplace/product-card";
import { catalog, productBySlug } from "@/lib/affiliate/catalog";
import { categoryByPath, local } from "@/lib/marketplace/content";
import { guides } from "@/lib/marketplace/guides";
import { renogyLink } from "@/lib/affiliate/providers/renogy";
import { buildMetadata } from "@/lib/metadata";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
import { legacyProducts as oldProducts } from "@/lib/marketplace/legacy";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug;
  if (oldProducts[slug])
    permanentRedirect(`/marketplace/products/${oldProducts[slug]}`);
  const p = productBySlug(slug);
  if (!p) notFound();
  const locale = await getRequestLocale();
  return buildMetadata({
    title: local(p.title, locale),
    description: local(p.summary, locale),
    path: `/marketplace/products/${p.slug}`,
  });
}
export default async function Page({ params }: Props) {
  const slug = (await params).slug;
  if (oldProducts[slug])
    permanentRedirect(`/marketplace/products/${oldProducts[slug]}`);
  const p = productBySlug(slug);
  if (!p) notFound();
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  const t = await getRequestDictionary();
  const c = categoryByPath(p.paths[0])!;
  return (
    <PlatformShell>
      <main className="commerce-page">
        {p.kind === "product" && <ProductStructuredData product={p} />}
        <Breadcrumbs
          items={[
            { name: "Marketplace", path: "/marketplace" },
            { name: local(c.title, locale), path: `/marketplace/${c.path}` },
            {
              name: local(p.title, locale),
              path: `/marketplace/products/${p.slug}`,
            },
          ]}
        />
        <div className="product-detail">
          <div className="product-illustration">
            <EquipmentVisual category={p.category} />
            <p className="small-copy">
              {ro
                ? "Imagine ilustrativă a categoriei; aspectul modelului real poate diferi."
                : "Illustrative category image; the actual model’s appearance may differ."}
            </p>
          </div>
          <article>
            <Intro
              eyebrow={
                p.kind === "product"
                  ? p.brand
                  : ro
                    ? "Clasă de echipament · nu model comercial"
                    : "Equipment class · not a purchasable model"
              }
              title={local(p.title, locale)}
              description={local(p.summary, locale)}
            />
            <p className="small-copy">
              {ro ? "Revizuit" : "Reviewed"}: {p.lastUpdated} · EU
            </p>
            <CompareControl id={p.id} ro={ro} />
            <dl className="spec-grid">
              {Object.entries(p.technicalSpecs).map(([k, v]) => (
                <div key={k}>
                  <dt>{specificationLabel(k, ro)}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            {p.productUrl ? (
              <a
                href={renogyLink(p.productUrl).href}
                target="_blank"
                rel={
                  renogyLink(p.productUrl).tracked
                    ? "sponsored noopener noreferrer"
                    : "noopener noreferrer"
                }
                className="button-primary"
              >
                {ro ? "Vezi modelul la Renogy EU" : "View model at Renogy EU"}{" "}
                ↗{" "}
                {renogyLink(p.productUrl).tracked
                  ? ro
                    ? "(link afiliat)"
                    : "(affiliate link)"
                  : ""}
              </a>
            ) : (
              <Link href={`/marketplace/${c.path}`} className="button-primary">
                {ro
                  ? "Explorează categoria și modelele"
                  : "Explore category and models"}{" "}
                →
              </Link>
            )}
            <p className="small-copy">
              {ro
                ? "Prețul, stocul, livrarea în România și garanția se confirmă la furnizor."
                : "Confirm price, availability, Romania delivery and warranty with the supplier."}
            </p>
          </article>
        </div>
        <div className="two-columns">
          <section className="content-panel">
            <h2>{ro ? "Potrivit de evaluat pentru" : "Best considered for"}</h2>
            <p>{local(p.bestFor, locale)}</p>
          </section>
          <section className="content-panel">
            <h2>
              {ro
                ? "Limite și utilizări nepotrivite"
                : "Limitations and unsuitable uses"}
            </h2>
            <p>{local(p.limitations, locale)}</p>
          </section>
        </div>
        <section className="content-panel">
          <h2>
            {ro
              ? "Compatibilitate și componente asociate"
              : "Compatibility and related components"}
          </h2>
          <p>{local(p.compatibility, locale)}</p>
          <p>{local(c.checks, locale)}</p>
          <div className="action-row">
            <Link href={c.calculator}>
              {ro ? "Verifică prin calcul" : "Check with calculator"} →
            </Link>
            <Link href={`/solutions/${c.solution}`}>
              {ro ? "Soluție de sistem" : "System solution"} →
            </Link>
            <Link href="/marketplace/electrical-components">
              {ro ? "Cabluri și protecție" : "Wiring & protection"} →
            </Link>
          </div>
        </section>
        <h2>
          {ro
            ? "Alternative din aceeași categorie"
            : "Alternatives in this category"}
        </h2>
        <div className="product-grid">
          {catalog
            .filter((n) => n.id !== p.id && n.category === p.category)
            .slice(0, 3)
            .map((n) => (
              <ProductCard key={n.id} product={n} dictionary={t} />
            ))}
        </div>
        <h2>{ro ? "Ghiduri asociate" : "Related guides"}</h2>
        <LinkGrid
          locale={locale}
          items={guides
            .filter((g) => g.category === c.path || g.slug === c.guide)
            .slice(0, 3)
            .map((g) => ({ href: `/learn/${g.slug}`, title: g.title }))}
        />
        <section className="content-panel">
          <h2>{ro ? "Surse și verificare" : "Sources and review"}</h2>
          {p.sourceUrls.length ? (
            p.sourceUrls.map((url) => (
              <p key={url}>
                <a href={url} target="_blank" rel="noreferrer">
                  Renogy EU ·{" "}
                  {ro ? "pagina oficială a modelului" : "official model page"}{" "}
                  ↗
                </a>
              </p>
            ))
          ) : (
            <p>
              {ro
                ? "Această înregistrare descrie un rol tehnic. Nu atribuim specificații unui produs neidentificat. Vezi ghidurile asociate pentru metoda de selecție."
                : "This record describes an equipment role. We do not attribute specifications to an unidentified product. See related guides for the selection method."}
            </p>
          )}
          <p>
            {ro
              ? "Datele lipsă necesită confirmare în manualul exact. Rezumatul este redactat independent; nu reprezintă aprobarea furnizorului."
              : "Missing data requires confirmation in the exact manual. The summary is independently written and does not represent supplier endorsement."}
          </p>
        </section>
        <Faq
          ro={ro}
          question={
            ro
              ? "Este compatibil automat cu sistemul meu?"
              : "Is it automatically compatible with my system?"
          }
          answer={local(p.compatibility, locale)}
        />
        <AffiliateDisclosure dictionary={t} />
      </main>
    </PlatformShell>
  );
}

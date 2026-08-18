import { notFound } from "next/navigation";
import { PlatformShell } from "@/components/platform-shell";
import { AffiliateDisclosure } from "@/components/marketplace/affiliate-disclosure";
import { BreadcrumbStructuredData, ProductStructuredData } from "@/components/marketplace/structured-data";
import { productBySlug } from "@/lib/affiliate/catalog";
import { buildMetadata } from "@/lib/metadata";
import { getRequestDictionary } from "@/lib/i18n/request";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const product = productBySlug((await params).slug);
  return buildMetadata({ title: product?.name ?? "Product", description: product?.description, path: `/marketplace/products/${product?.slug ?? ""}` });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = productBySlug((await params).slug);
  if (!product) notFound();
  const categoryName = product.category.replaceAll("-", " "); const t = await getRequestDictionary();
  return <PlatformShell><main className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[.8fr_1.2fr]"><ProductStructuredData product={product}/><BreadcrumbStructuredData items={[{ name: "Marketplace", path: "/marketplace" }, { name: categoryName, path: `/marketplace/category/${product.category}` }, { name: product.name, path: `/marketplace/products/${product.slug}` }]}/><div className="brand-glass-card grid min-h-80 place-items-center rounded-[2rem] text-8xl text-lime-100" aria-label={t["marketplace.card.placeholder"]}>⌁</div><article><p className="eyebrow">{product.brand} · {categoryName}</p><h1 className="mt-3 text-4xl font-bold text-white">{product.name}</h1><p className="mt-4 text-lg leading-8 text-white/75">{product.description}</p><div className="mt-5 rounded-2xl border border-white/15 bg-white/[.04] p-4 text-sm text-white/72"><p><strong className="text-white">{t["marketplace.product.merchant"]}</strong> {product.merchant} ({product.merchantRegion})</p><p className="mt-2"><strong className="text-white">{t["marketplace.product.price"]}</strong> {product.price === null ? t["marketplace.product.priceUnknown"] : `${product.price} ${product.currency}`}</p><p className="mt-2"><strong className="text-white">{t["marketplace.product.reviewed"]}</strong> {product.lastUpdated}</p></div><dl className="mt-7 grid gap-3 sm:grid-cols-2">{Object.entries(product.technicalSpecs).map(([key, value]) => <div key={key} className="rounded-xl border border-white/15 bg-white/[.05] p-3"><dt className="text-xs uppercase tracking-wide text-white/55">{key}</dt><dd className="mt-1 font-semibold text-white">{value}</dd></div>)}</dl><section className="mt-7 rounded-2xl border border-lime-100/20 bg-lime-100/[.07] p-4 text-sm leading-6 text-white/75"><h2 className="font-semibold text-white">{t["marketplace.product.use"]}</h2><p className="mt-2">{product.recommendedFor.join(" · ")}</p><h2 className="mt-4 font-semibold text-white">{t["marketplace.product.why"]}</h2><p className="mt-2">{product.whyRecommended}</p></section><section className="mt-4 rounded-2xl border border-amber-200/25 bg-amber-200/10 p-4 text-sm leading-6 text-amber-50"><strong>{t["marketplace.product.delivery"]}</strong> {t["marketplace.product.deliveryText"]}</section><section className="mt-4 rounded-2xl border border-amber-200/25 bg-amber-200/10 p-4 text-sm leading-6 text-amber-50"><strong>{t["marketplace.product.limitations"]}</strong> {product.compatibilityNotes} {t["marketplace.product.limitationText"]}</section><a href={product.affiliateUrl} target="_blank" rel="noreferrer sponsored" className="button-primary mt-7">{t["marketplace.product.partner"]}</a><div className="mt-4"><AffiliateDisclosure dictionary={t}/></div></article></main></PlatformShell>;
}

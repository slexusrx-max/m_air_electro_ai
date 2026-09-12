import Link from "next/link";
import { notFound } from "next/navigation";
import { PlatformShell } from "@/components/platform-shell";
import { AffiliateDisclosure } from "@/components/marketplace/affiliate-disclosure";
import { EquipmentIllustration } from "@/components/marketplace/equipment-illustration";
import {
  BreadcrumbStructuredData,
  ProductStructuredData,
} from "@/components/marketplace/structured-data";
import {
  productBySlug,
  localizedProduct,
  marketplaceCategories,
} from "@/lib/affiliate/catalog";
import { supplierLink } from "@/lib/affiliate/providers";
import { buildMetadata } from "@/lib/metadata";
import { getRequestDictionary } from "@/lib/i18n/request";
import { commercialCopy } from "@/lib/marketplace/copy";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = productBySlug((await params).slug);
  return buildMetadata({
    title: p?.name ?? "Echipament",
    description: p?.description,
    path: `/marketplace/products/${p?.slug ?? ""}`,
  });
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const original = productBySlug((await params).slug);
  if (!original) notFound();
  const t = await getRequestDictionary(),
    c = commercialCopy(t),
    p = localizedProduct(original, c.ro),
    cat = marketplaceCategories.find((x) => x.slug === p.category)!,
    link = supplierLink(p);
  return (
    <PlatformShell>
      <main className="mx-auto max-w-5xl space-y-8">
        <ProductStructuredData product={p} />
        <BreadcrumbStructuredData
          items={[
            { name: c.marketplace, path: "/marketplace" },
            {
              name: c.ro ? cat.name : cat.nameEn,
              path: `/marketplace/category/${cat.slug}`,
            },
            { name: p.name, path: `/marketplace/products/${p.slug}` },
          ]}
        />
        <nav
          aria-label={c.ro ? "Traseu de navigare" : "Breadcrumb"}
          className="flex flex-wrap gap-2 text-sm"
        >
          <Link className="underline" href="/marketplace">
            {c.marketplace}
          </Link>
          <span>/</span>
          <Link
            className="underline"
            href={`/marketplace/category/${p.category}`}
          >
            {c.ro ? cat.name : cat.nameEn}
          </Link>
        </nav>
        <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr]">
          <aside className="brand-glass-card self-start rounded-3xl p-5">
            <EquipmentIllustration category={p.category} />
            <p className="mt-3 text-xs leading-5 text-slate-600">
              {c.illustration}
            </p>
          </aside>
          <article>
            <p className="eyebrow">
              {p.kind === "product" ? c.productExample : c.equipmentClass}
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{p.name}</h1>
            <p className="mt-3 text-sm text-slate-600">
              {p.brand} · {c.checked}: {p.lastUpdated}
            </p>
            <p className="mt-5 text-lg leading-8">{p.description}</p>
            <h2 className="mt-7 text-xl font-bold">{c.specs}</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(p.technicalSpecs).map(([key, value]) => (
                <div key={key} className="info-card">
                  <dt className="text-sm text-slate-600">{key}</dt>
                  <dd className="mt-2 font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            [c.use, p.recommendedFor.join(" · ")],
            [c.advantages, p.advantages],
            [c.why, p.whyRecommended],
            [c.limits, p.compatibilityNotes],
          ].map(([title, text]) => (
            <section key={title} className="info-card">
              <h2>{title}</h2>
              <p>{text}</p>
            </section>
          ))}
        </div>
        <section className="brand-glass-card rounded-3xl p-6">
          <h2 className="text-xl font-bold">
            {c.ro
              ? "Consultă sursa înainte de cumpărare"
              : "Check the source before buying"}
          </h2>
          <p className="mt-3 leading-7">
            {c.price}.{" "}
            {c.ro
              ? "Contractul de achiziție este între tine și comerciant. M Air nu deține stoc, nu încasează plata și nu oferă garanția comerciantului."
              : "The purchase contract is between you and the merchant. M Air holds no stock, takes no payment and provides no merchant warranty."}
          </p>
          <a
            href={link.href}
            target="_blank"
            rel={
              link.tracked
                ? "sponsored noopener noreferrer"
                : "noopener noreferrer"
            }
            className="button-primary mt-5"
          >
            {c.visit}
          </a>
          <p className="mt-3 text-xs">
            {link.tracked
              ? c.ro
                ? "Legătură afiliată. "
                : "Affiliate link. "
              : ""}
            {c.ro ? "Se deschide într-o filă nouă." : "Opens in a new tab."}
          </p>
        </section>
        <p className="rounded-2xl bg-amber-50 p-5 text-sm leading-7 text-amber-950">
          {c.safety}
        </p>
        <AffiliateDisclosure dictionary={t} />
        <Link href="/marketplace/find-my-solution" className="button-outline">
          {c.finder}
        </Link>
      </main>
    </PlatformShell>
  );
}

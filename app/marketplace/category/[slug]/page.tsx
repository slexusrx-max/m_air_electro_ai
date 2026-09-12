import Link from "next/link";
import { notFound } from "next/navigation";
import { PlatformShell } from "@/components/platform-shell";
import { ProductCard } from "@/components/marketplace/product-card";
import { AffiliateDisclosure } from "@/components/marketplace/affiliate-disclosure";
import {
  BreadcrumbStructuredData,
  ItemListStructuredData,
} from "@/components/marketplace/structured-data";
import {
  marketplaceCategories,
  productsForCategory,
} from "@/lib/affiliate/catalog";
import { buildMetadata } from "@/lib/metadata";
import { getRequestDictionary } from "@/lib/i18n/request";
import { commercialCopy } from "@/lib/marketplace/copy";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    cat = marketplaceCategories.find((c) => c.slug === slug);
  return buildMetadata({
    title: cat?.name ?? "Categorie",
    description: cat?.summary,
    path: `/marketplace/category/${slug}`,
  });
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    cat = marketplaceCategories.find((c) => c.slug === slug);
  if (!cat) notFound();
  const products = productsForCategory(slug),
    t = await getRequestDictionary(),
    c = commercialCopy(t),
    name = c.ro ? cat.name : cat.nameEn;
  return (
    <PlatformShell>
      <main className="mx-auto max-w-6xl space-y-8">
        <BreadcrumbStructuredData
          items={[
            { name: c.marketplace, path: "/marketplace" },
            { name, path: `/marketplace/category/${slug}` },
          ]}
        />
        <ItemListStructuredData name={name} products={products} />
        <section className="brand-glass-card rounded-3xl p-7">
          <Link href="/marketplace" className="text-sm font-bold underline">
            ← {c.marketplace}
          </Link>
          <h1 className="mt-4 text-4xl font-bold">{name}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8">
            {c.ro ? cat.summary : cat.summaryEn}
          </p>
          <p className="mt-3 max-w-3xl leading-7">
            {c.ro
              ? "Compară reperele de mai jos cu necesarul tău. Verifică tensiunea sistemului, condițiile de instalare și limitele producătorului; aceeași categorie nu înseamnă compatibilitate automată."
              : "Compare these references with your requirements. Check system voltage, installation conditions and manufacturer limits; sharing a category does not guarantee compatibility."}
          </p>
          <Link
            href="/marketplace/find-my-solution"
            className="button-primary mt-5"
          >
            {c.finder}
          </Link>
        </section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} dictionary={t} />
          ))}
        </div>
        <p className="rounded-2xl bg-amber-50 p-5 text-sm leading-7 text-amber-950">
          {c.safety}
        </p>
        <AffiliateDisclosure dictionary={t} />
      </main>
    </PlatformShell>
  );
}

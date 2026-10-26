import type { CatalogProduct } from "@/lib/affiliate/types";
import { absoluteUrl } from "@/lib/site";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizedPath } from "@/lib/i18n/routing";
import type { Equipment } from "@/lib/marketplace/catalog-data";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

// These editorial listings have no verified offer or qualifying review/rating.
// Describe the page without claiming Product rich-result eligibility.
export async function ProductPageStructuredData({
  product,
}: {
  product: CatalogProduct & Partial<Pick<Equipment, "title" | "summary">>;
}) {
  const locale = await getRequestLocale();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: product.title?.[locale === "ro" ? "ro" : "en"] ?? product.name,
        description: `${product.title?.[locale === "ro" ? "ro" : "en"] ?? product.name}. ${product.summary?.[locale === "ro" ? "ro" : "en"] ?? product.description}`,
        url: absoluteUrl(localizedPath(`/marketplace/products/${product.slug}`, locale)),
        inLanguage: locale,
      }}
    />
  );
}

export async function BreadcrumbStructuredData({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const locale = await getRequestLocale();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: absoluteUrl(localizedPath(item.path, locale)),
        })),
      }}
    />
  );
}

export async function ItemListStructuredData({
  name,
  products,
}: {
  name: string;
  products: CatalogProduct[];
}) {
  const locale = await getRequestLocale();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absoluteUrl(localizedPath(`/marketplace/products/${product.slug}`, locale)),
          name: product.name,
        })),
      }}
    />
  );
}

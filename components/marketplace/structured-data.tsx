import type { CatalogProduct } from "@/lib/affiliate/types";
import { absoluteUrl } from "@/lib/site";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function ProductStructuredData({ product }: { product: CatalogProduct }) {
  return <JsonLd data={{ "@context": "https://schema.org", "@type": "Product", name: product.name, brand: { "@type": "Brand", name: product.brand }, description: product.description, category: product.category.replaceAll("-", " "), url: absoluteUrl(`/marketplace/products/${product.slug}`) }} />;
}

export function BreadcrumbStructuredData({ items }: { items: { name: string; path: string }[] }) {
  return <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path) })) }} />;
}

export function ItemListStructuredData({ name, products }: { name: string; products: CatalogProduct[] }) {
  return <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", name, itemListElement: products.map((product, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(`/marketplace/products/${product.slug}`), name: product.name })) }} />;
}

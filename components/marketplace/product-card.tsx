import Link from "next/link";
import type { CatalogProduct } from "@/lib/affiliate/types";
import type { Dictionary } from "@/lib/i18n/types";
import {
  localizedProduct,
  marketplaceCategories,
} from "@/lib/affiliate/catalog";
import { commercialCopy } from "@/lib/marketplace/copy";
import { EquipmentIllustration } from "./equipment-illustration";
export function ProductCard({
  product,
  dictionary: t,
}: {
  product: CatalogProduct;
  dictionary: Dictionary;
}) {
  const c = commercialCopy(t),
    p = localizedProduct(product, c.ro),
    cat = marketplaceCategories.find((x) => x.slug === p.category)!;
  return (
    <article className="brand-glass-card flex flex-col rounded-3xl p-5">
      <EquipmentIllustration category={p.category} />
      <p className="mt-4 text-xs font-bold uppercase text-teal-800">
        {c.ro ? cat.name : cat.nameEn} ·{" "}
        {p.kind === "product"
          ? p.brand
          : c.ro
            ? "Ghid de clasă"
            : "Class guide"}
      </p>
      <h3 className="mt-2 text-xl font-bold">{p.name}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-700">{p.description}</p>
      <div className="mt-auto pt-5">
        <p className="text-xs text-slate-600">{c.price}</p>
        <Link
          className="button-outline mt-3"
          href={`/marketplace/products/${p.slug}`}
          aria-label={`${c.review}: ${p.name}`}
        >
          {c.review} →
        </Link>
      </div>
    </article>
  );
}

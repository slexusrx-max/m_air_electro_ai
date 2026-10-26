import type { CatalogProduct } from "@/lib/affiliate/types";
import Image from "next/image";
import { productPhoto } from "@/lib/marketplace/product-photos";
import { EquipmentVisual } from "./equipment-visual";

export function ProductVisual({ product, ro }: { product: CatalogProduct; ro: boolean }) {
  if (product.kind === "equipment-class") return <EquipmentVisual category={product.category} />;
  const photo = productPhoto(product);
  if (photo) return <>
    <div className="equipment-visual product-model-photo" data-product-photo={product.id}>
      <Image src={photo.src} alt={product.name} width={photo.width} height={photo.height}
        unoptimized={photo.src.startsWith("https://")}
        sizes="(max-width: 768px) 85vw, 420px" />
    </div>
    {photo.multipleViews && <p className="small-copy" data-testid="product-photo-views-note">
      {ro ? "Vedere din fata si din spate a unui singur panou." : "Front and rear views of one panel."}
    </p>}
  </>;
  // Unverified models keep their explicit placeholder; never substitute another model.
  return <div className="equipment-visual product-photo-pending" data-product-photo={product.id}>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="8" y="8" width="32" height="32" rx="8"/><circle cx="19" cy="19" r="3"/><path d="m10 34 10-10 7 7 5-5 7 8"/></svg>
    <span>{ro ? "Imaginea produsului așteaptă verificarea" : "Product image awaiting verification"}</span>
  </div>;
}

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
        sizes="(max-width: 768px) 85vw, 420px" />
    </div>
    {photo.multipleViews && <p className="small-copy" data-testid="product-photo-views-note">
      {ro ? "Vedere din fata si din spate a unui singur panou." : "Front and rear views of one panel."}
    </p>}
  </>;
  // Unverified models keep their explicit placeholder; never substitute another model.
  return <div className="equipment-visual product-photo-pending" data-product-photo={product.id}>
    <span>{ro ? "Fotografie în curs de confirmare" : "Photo pending verification"}</span>
  </div>;
}

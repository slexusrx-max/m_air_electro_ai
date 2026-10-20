import type { CatalogProduct } from "../affiliate/types";
import reviewedRenogy from "@/data/renogy-reviewed-products.json";

// Exact existing variants reviewed in docs/product-photo-provenance-2026-10-18.json.
// Never fall back to a category photograph for an unidentified model.
type ProductPhoto = { src: string; width: number; height: number; multipleViews?: boolean };
export const productPhotos: Record<string, ProductPhoto> = {
  ...Object.fromEntries(reviewedRenogy.map(record => [record.id, {
    src: record.imageUrl, width: record.width, height: record.height,
  }])),
  "renogy-mini-100": { src: "/product-photos/renogy-mini-100.jpg", width: 1280, height: 1280 },
  "renogy-mini-200": { src: "/product-photos/renogy-mini-200.jpg", width: 1280, height: 1280 },
  "renogy-panel-200": { src: "/product-photos/renogy-panel-200.jpg", width: 1280, height: 1280, multipleViews: true },
  "renogy-inverter-1000": { src: "/product-photos/renogy-inverter-1000.jpg", width: 1600, height: 1600 },
  "renogy-dcc50": { src: "/product-photos/renogy-dcc50.jpg", width: 600, height: 600 },
  "mppt-charge-controller": { src: "/product-photos/mppt-charge-controller.jpg", width: 1280, height: 1280 },
  "dc-dc-charger-20a": { src: "/product-photos/dc-dc-charger-20a.jpg", width: 386, height: 386 },
  "waterdrop-g3p800": { src: "/product-photos/waterdrop-g3p800.png", width: 1024, height: 1024 },
  "waterdrop-g3p600": { src: "/product-photos/waterdrop-g3p600.png", width: 1024, height: 1024 },
  "waterdrop-x12": { src: "/product-photos/waterdrop-x12.png", width: 2134, height: 2134 },
};

export function productPhoto(product: Pick<CatalogProduct, "id" | "kind">): ProductPhoto | undefined {
  return product.kind === "product" ? productPhotos[product.id] : undefined;
}

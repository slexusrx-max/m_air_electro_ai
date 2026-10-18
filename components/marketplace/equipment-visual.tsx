import Image from "next/image";
import { EnergySchematic } from "@/components/energy-schematic";
import { categoryPhoto } from "@/lib/marketplace/category-photos";

export function EquipmentVisual({ category }: { category: string }) {
  const photo = categoryPhoto(category);
  if (!photo) return <div className="equipment-visual" aria-hidden="true"><EnergySchematic family="electrical" /></div>;
  return <div className="equipment-visual equipment-visual-photo" aria-hidden="true" data-category-photo={category}>
    <Image src={photo.src} alt="" width={photo.width} height={photo.height}
      sizes="(max-width: 600px) 45vw, (max-width: 1200px) 30vw, 220px" />
  </div>;
}

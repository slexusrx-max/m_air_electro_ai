import Image from "next/image";
import { EnergySchematic } from "@/components/energy-schematic";
import { categoryPhoto } from "@/lib/marketplace/category-photos";
import { visualFamily } from "@/lib/visual-system";
import { legacyCategories } from "@/lib/marketplace/content";
import { CategoryIdentifier } from "./category-identifier";
import styles from "./equipment-visual.module.css";

export function EquipmentVisual({ category }: { category: string }) {
  const photo = categoryPhoto(category);
  if (!photo) return <div className="equipment-visual" aria-hidden="true"><EnergySchematic family={visualFamily(`/marketplace/${legacyCategories[category] ?? category}`)} /></div>;
  return <div className={`equipment-visual equipment-visual-photo ${styles.visual}`} aria-hidden="true" data-category-photo={category}>
    <Image src={photo.src} alt="" width={photo.width} height={photo.height}
      sizes="(max-width: 600px) 45vw, (max-width: 1200px) 30vw, 220px" />
    <span className={styles.badge}><CategoryIdentifier category={category} /></span>
  </div>;
}

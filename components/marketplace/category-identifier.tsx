import { EnergySchematic } from "@/components/energy-schematic";
import { legacyCategories } from "@/lib/marketplace/content";
import { visualFamily } from "@/lib/visual-system";
import styles from "./category-identifier.module.css";

/** One coordinated badge system, using the existing original category vectors. */
export function CategoryIdentifier({ category }: { category: string }) {
  const path = legacyCategories[category] ?? category;
  const family = visualFamily(`/marketplace/${path}`);
  return <span className={styles.identifier} data-category-identifier={path} data-tone={family === "water" ? "water" : "energy"} aria-hidden="true">
    <EnergySchematic family={family} />
  </span>;
}

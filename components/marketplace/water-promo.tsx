import Link from "next/link";
import styles from "./water-promo.module.css";

export function WaterPromo({ ro }: { ro: boolean }) {
  return <section className={styles.promo} aria-labelledby="water-promo-title" data-testid="water-home-promo">
    <div>
      <p className={styles.eyebrow}>{ro ? "APĂ ȘI REZILIENȚĂ" : "WATER & RESILIENCE"}</p>
      <h2 id="water-promo-title">{ro ? "Apă pură. Un viitor mai luminos." : "Pure Water. Brighter Tomorrow."}</h2>
      <p>{ro ? "Descoperă soluții de apă pentru acasă, călătorii și off-grid. Începe cu sursa ta de apă și performanța documentată a modelului." : "Discover water solutions for home, travel and off-grid living. Start with your water source and documented model performance."}</p>
    </div>
    <div className={styles.actions}>
      <Link className={styles.primary} href="/marketplace/water">{ro ? "Explorează soluțiile de apă" : "Explore Water Solutions"} ↗</Link>
      <Link href="/marketplace/water#finder">{ro ? "Găsește sistemul tău de apă" : "Find Your Water System"} →</Link>
    </div>
  </section>;
}

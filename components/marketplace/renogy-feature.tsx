import Image from "next/image";
import reviewedRenogy from "@/data/renogy-reviewed-products.json";
const kitPhoto = reviewedRenogy.find(p => p.id === "renogy-backup-800w-300ah-2000w")!;
import Link from "@/components/localized-link";
import styles from "./renogy.module.css";

export function RenogyFeature({ ro, storefront = false }: { ro: boolean; storefront?: boolean }) {
  const Heading = storefront ? "h1" : "h2";
  return (
    <section className={styles.hero} aria-labelledby="renogy-feature-title" data-testid="renogy-feature">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{ro ? "PARTENER AFILIAT INDEPENDENT" : "INDEPENDENT AFFILIATE PARTNER"}</p>
        <p className={styles.wordmark}>Renogy <span>× M Air Electro AI</span></p>
        <Heading id="renogy-feature-title">{ro ? "Energie bine gândită. Libertate de construit." : "Considered energy. Freedom to build."}</Heading>
        <p className={styles.lead}>{ro
          ? "Solar, stocare și conversie pentru România și Europa. Începe cu necesarul tău, apoi verifică fiecare componentă. Nu doar puterea de pe etichetă."
          : "Solar, storage and conversion for Romania and Europe. Start with your requirements, then check every component. Not just the power on the label."}</p>
        <div className={styles.actions}>
          <Link className={styles.primary} href={storefront ? "#renogy-products" : "/renogy"}>{ro ? "Explorează Renogy" : "Explore Renogy"} <span aria-hidden="true">↗</span></Link>
          <Link className={styles.secondary} href="/calculators/solar">{ro ? "Dimensionează sistemul" : "Size your system"} →</Link>
        </div>
        <p className={styles.fine}>{ro ? "Selecție independentă · Specificații documentate · Achiziție la comerciant" : "Independent selection · Documented specifications · Merchant checkout"}</p>
      </div>
      <figure className={styles.visual}>
        <Image src={kitPhoto.imageUrl} alt={ro ? "Kit Renogy: două valize solare de 400 W, baterie Core 300 Ah, invertor 2000 W și regulator" : "Renogy kit: two 400 W solar suitcases, Core 300 Ah battery, 2000 W inverter and controller"} width={kitPhoto.width} height={kitPhoto.height} sizes="(max-width: 800px) 90vw, 48vw" unoptimized preload={storefront} />
        <div className={styles.flow} aria-hidden="true"><span>SOLAR</span><span>→</span><span>{ro ? "STOCARE" : "STORAGE"}</span><span>→</span><span>AC</span></div>
        <figcaption>{ro ? "Fotografie oficială Renogy · Kit 3840 Wh / 800 W / 2000 W" : "Official Renogy photograph · 3840 Wh / 800 W / 2000 W kit"}</figcaption>
      </figure>
    </section>
  );
}

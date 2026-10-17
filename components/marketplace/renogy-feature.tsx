import Image from "next/image";
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
        <Image src="/equipment/solar-panel-studio.png" alt={ro ? "Ilustrație de categorie: panou solar, nu fotografie de produs Renogy" : "Category illustration: solar panel, not a Renogy product photograph"} width={1536} height={1024} sizes="(max-width: 800px) 90vw, 48vw" preload={storefront} />
        <div className={styles.flow} aria-hidden="true"><span>SOLAR</span><span>→</span><span>{ro ? "STOCARE" : "STORAGE"}</span><span>→</span><span>AC</span></div>
        <figcaption>{ro ? "Vizual ilustrativ M Air. Modelul real poate diferi." : "M Air illustrative visual. Actual models may differ."}</figcaption>
      </figure>
    </section>
  );
}

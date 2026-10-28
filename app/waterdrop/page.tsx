import Image from "next/image";
import Link from "@/components/localized-link";
import { AffiliateDisclosure } from "@/components/marketplace/affiliate-disclosure";
import { ProductCard } from "@/components/marketplace/product-card";
import { SupplierLink } from "@/components/marketplace/supplier-link";
import { PlatformShell } from "@/components/platform-shell";
import { catalog } from "@/lib/affiliate/catalog";
import { supplierLink } from "@/lib/affiliate/providers";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
import type { Equipment } from "@/lib/marketplace/catalog-data";
import styles from "./waterdrop.module.css";

const waterdropProducts = catalog.filter(
  (product) => product.provider === "waterdrop-eu",
) as Equipment[];

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return buildMetadata({
    locale,
    title: ro ? "Waterdrop - compară sisteme de apă, magazin DE" : "Waterdrop - compare water systems, DE store",
    description: ro ? "Compară modele Waterdrop documentate. Linkurile actuale duc la magazinul german, pentru Germania. Pentru România este necesar magazinul EU separat." : "Compare documented Waterdrop models. Current links lead to the German store for Germany. Romania requires the separate EU store.",
    path: "/waterdrop",
  });
}

export default async function WaterdropPage() {
  const [locale, dictionary] = await Promise.all([
    getRequestLocale(),
    getRequestDictionary(),
  ]);
  const ro = locale === "ro";
  const trackingActive = waterdropProducts.some((product) => supplierLink(product).tracked);

  return (
    <PlatformShell>
      <main className={styles.page}>
        <nav className={styles.breadcrumbs} aria-label={ro ? "Navigare" : "Breadcrumb"}>
          <Link href="/marketplace">Marketplace</Link>
          <span aria-hidden="true">/</span>
          <Link href="/marketplace/water">{ro ? "Apă și reziliență" : "Water & Resilience"}</Link>
          <span aria-hidden="true">/</span>
          <span>Waterdrop</span>
        </nav>

        <header className={styles.hero}>
          <div>
            <p className={styles.kicker}>WATERDROP · {ro ? "MAGAZIN GERMANIA" : "GERMANY STORE"}</p>
            <h1>
              {ro
                ? "Alege sistemul Waterdrop potrivit pentru bucătăria ta"
                : "Choose the right Waterdrop system for your kitchen"}
            </h1>
            <p className={styles.lead}>
              {ro
                ? "Compară modele Waterdrop pentru locuință. Instalarea diferă; specificațiile lipsă rămân necunoscute. Nu sunt sisteme verificate pentru urgențe."
                : "Compare documented domestic Waterdrop models. Installation types differ; missing specifications remain unknown. These are not verified emergency-water systems."}
            </p>
            <div className={styles.actions}>
              <a href="#waterdrop-models" className={styles.primary}>
                {ro ? `Compara ${waterdropProducts.length} modele` : `Compare ${waterdropProducts.length} models`} ↓
              </a>
              <Link href="/learn/choosing-water-system">
                {ro ? "Ghid de alegere" : "Selection guide"} →
              </Link>
            </div>
          </div>
          <Image
            src="/water/crystal-hero-v2.png"
            alt={ro ? "Ilustrație M Air Electro AI pentru apă pură" : "M Air Electro AI pure-water illustration"}
            width={1536}
            height={1024}
            sizes="(max-width: 900px) 90vw, 42vw"
            priority
          />
        </header>

        <section className={styles.notice} aria-label={ro ? "Transparență comercială" : "Commercial transparency"}>
          <p data-waterdrop-region-notice>
            <strong>{ro ? "Linkurile actuale duc la magazinul DE, doar pentru Germania." : "Current links lead to the DE store, for Germany only."}</strong>{" "}
            {ro ? "Pentru România este necesar magazinul EU și un program afiliat separat. Nu avem încă linkuri afiliate EU verificate pentru România. Nu folosi magazinul DE pentru o comandă cu livrare în România." : "Romania requires the EU store and a separate affiliate programme. We do not yet have verified EU affiliate links for Romania. Do not use the DE store for an order delivered to Romania."}
          </p>
          <strong>
            {trackingActive
              ? (ro ? "Linkuri afiliate Waterdrop active" : "Active Waterdrop affiliate links")
              : (ro ? "Program Waterdrop (DE) aprobat" : "Waterdrop (DE) program approved")}
          </strong>
          <p>
            {trackingActive
              ? (ro
                ? "M Air Electro AI este editor independent. Linkurile Waterdrop marcate ca afiliate pot genera un comision pentru achizițiile eligibile, fără cost suplimentar pentru cumpărător."
                : "M Air Electro AI is an independent publisher. Marked Waterdrop affiliate links may earn us a commission on qualifying purchases at no extra cost to the buyer.")
              : (ro
                ? "Relația afiliată este confirmată, iar linkurile rămân obișnuite până la activarea tehnică a adreselor emise de Impact."
                : "The affiliate relationship is confirmed; links remain ordinary until the Impact-issued URLs are technically activated.")} {ro ? "Magazinul german stabilește prețul, țările de livrare, garanția și retururile." : "The German store controls pricing, delivery countries, warranty and returns."}
          </p>
        </section>


        <section id="waterdrop-models" className={styles.section} aria-labelledby="waterdrop-models-title">
          <p className={styles.kicker}>{ro ? "MODELE DOCUMENTATE" : "DOCUMENTED MODELS"}</p>
          <h2 id="waterdrop-models-title">{ro ? "Compară înainte să ajungi la magazin" : "Compare before visiting the store"}</h2>
          <p className={styles.sectionIntro}>
            {ro
              ? "Valorile sunt cele declarate pe paginile oficiale europene ale producătorului. Nu sunt rezultate ale testelor noastre și nu confirmă automat reducerea unui contaminant specific."
              : "Values are manufacturer-stated on the official European product pages. They are not our test results and do not automatically confirm reduction of a specific contaminant."}
          </p>
          <div className="product-grid">
            {waterdropProducts.map((product) => (
              <ProductCard key={product.id} product={product} dictionary={dictionary} />
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="waterdrop-table-title">
          <h2 id="waterdrop-table-title">{ro ? "Comparație directă" : "Side-by-side comparison"}</h2>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>{ro ? "Model" : "Model"}</th>
                  <th>{ro ? "Producție nominală" : "Nominal output"}</th>
                  <th>{ro ? "Apă purificată : evacuată" : "Purified : drain water"}</th>
                  <th>{ro ? "Tip" : "Type"}</th>
                  <th>{ro ? "Magazin" : "Store"}</th>
                </tr>
              </thead>
              <tbody>
                {waterdropProducts.map((product) => (
                  <tr key={product.id}>
                    <th scope="row"><Link href={`/marketplace/products/${product.slug}`}>{product.name}</Link></th>
                    <td>{product.technicalSpecs["Nominal production"] ?? (ro ? "Necunoscut" : "Unknown")}</td>
                    <td>{product.technicalSpecs["Purified water to drain"] ?? (ro ? "Necunoscut" : "Unknown")}</td>
                    <td>{product.technicalSpecs["Installation"] ?? (ro ? "Sub chiuvetă" : "Under-sink")}</td>
                    <td><SupplierLink product={product} ro={ro}>{ro ? "Vezi modelul" : "View model"}</SupplierLink></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.checklist} aria-labelledby="waterdrop-checklist-title">
          <div>
            <p className={styles.kicker}>{ro ? "ÎNAINTE DE COMANDĂ" : "BEFORE ORDERING"}</p>
            <h2 id="waterdrop-checklist-title">{ro ? "Verificări care evită o alegere greșită" : "Checks that prevent a poor fit"}</h2>
          </div>
          <ol>
            <li>{ro ? "Alege magazinul pentru țara de livrare. Linkurile DE de aici sunt doar pentru Germania; pentru România verifică separat magazinul EU și varianta exactă." : "Choose the store for the delivery country. These DE links are for Germany only; for Romania, check the separate EU store and exact variant."}</li>
            <li>{ro ? "Măsoară spațiul de sub chiuvetă și verifică accesul la priză și evacuare." : "Measure under-sink space and verify access to power and a drain connection."}</li>
            <li>{ro ? "Compară presiunea și temperatura apei cu limitele din manual." : "Compare inlet pressure and temperature with the manual limits."}</li>
            <li>{ro ? "Confirmă codurile, prețul și disponibilitatea cartușelor de schimb." : "Confirm replacement-cartridge codes, price and availability."}</li>
            <li>{ro ? "Pentru contaminanți specifici, caută modelul exact în documentația și registrele de certificare relevante." : "For specific contaminants, verify the exact model in applicable documentation and certification registries."}</li>
          </ol>
        </section>

        <AffiliateDisclosure dictionary={dictionary} />
      </main>
    </PlatformShell>
  );
}

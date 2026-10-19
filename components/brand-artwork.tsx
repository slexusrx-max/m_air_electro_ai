import Image from "next/image";
import { brandArtwork } from "@/lib/brand";
import styles from "./brand-artwork.module.css";

export function BrandMark() {
  return <span className={styles.mark} data-brand-mark aria-hidden="true">
    <Image className={styles.image} src={brandArtwork.src} alt="" width={1254} height={1254} sizes="96px" />
  </span>;
}

export function BrandArtwork({ footer = false }: { footer?: boolean }) {
  return <div className={footer ? styles.footerArtwork : styles.artwork} data-brand-artwork>
    <Image src={brandArtwork.src} alt="M Air Electro AI — Intelligence. Energy. Future." width={brandArtwork.width} height={brandArtwork.height} sizes={footer ? "240px" : "(max-width: 540px) 85vw, 480px"} />
  </div>;
}

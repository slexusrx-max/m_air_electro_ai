import Link from "@/components/localized-link";
import { siteConfig } from "@/lib/site";

export function PublisherTrust({ ro, compact = false }: { ro: boolean; compact?: boolean }) {
  if (compact) return <div className="trust-strip" aria-label={ro ? "Cum te ajutăm" : "How we help"}>
    <span>{ro ? "Cercetare independentă" : "Independent research"}</span>
    <span>{ro ? "Surse oficiale și ipoteze vizibile" : "Official sources and visible assumptions"}</span>
    <span>{ro ? "Cumpărare la furnizor" : "Purchase at the supplier"}</span>
  </div>;
  return <section className="publisher-trust content-panel" aria-labelledby="publisher-trust-title">
    <div><p className="eyebrow">{ro ? "CINE PUBLICĂ" : "WHO PUBLISHES"}</p>
      <h2 id="publisher-trust-title">Stanislav Zavizion</h2>
      <p>{ro ? "Editor independent · România / Uniunea Europeană" : "Independent publisher · Romania / European Union"}</p>
      <p>{ro ? "M Air Electro AI este marca platformei, nu o societate înregistrată. Proprietatea nu reprezintă o calificare profesională sau testarea produselor." : "M Air Electro AI is the platform brand, not an incorporated company. Ownership does not establish professional credentials or product testing."}</p>
    </div>
    <div><h3>{ro ? "Cum poți verifica recomandările" : "How to check our recommendations"}</h3>
      <p>{ro ? "Cercetarea între mărci folosește sursele furnizorilor. Paginile modelelor indică sursele exacte și data verificării asistate AI; calculele afișează ipotezele și limitele." : "Cross-brand research uses supplier sources. Model pages show exact sources and AI-assisted verification dates; calculations disclose assumptions and limitations."}</p>
      <div className="action-row"><Link href="/methodology">{ro ? "Metodologie" : "Methodology"}</Link><Link href="/corrections-policy">{ro ? "Corecții" : "Corrections"}</Link><Link href="/contact">Contact</Link></div>
      <p className="small-copy">{siteConfig.operatorName} · <Link href="/about">{ro ? "Despre editor" : "About the publisher"}</Link></p>
    </div>
  </section>;
}

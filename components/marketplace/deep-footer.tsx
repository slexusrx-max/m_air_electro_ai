import Link from "@/components/localized-link";
import { BrandArtwork } from "@/components/brand-artwork";
import type { Locale } from "@/lib/i18n/types";
import { siteConfig } from "@/lib/site";
export function DeepFooter({ locale }: { locale: Locale }) {
  const ro = locale === "ro";
  const groups = [
    { label: ro ? "Explorează" : "Explore", href: "/marketplace", children: [
      { label: "Marketplace", href: "/marketplace" },
      { label: ro ? "Găsește soluția" : "Find My Solution", href: "/marketplace/find-my-solution" },
      { label: ro ? "Compară" : "Compare", href: "/compare" },
      { label: ro ? "Soluții" : "Solutions", href: "/solutions" },
      { label: ro ? "Calculatoare" : "Calculators", href: "/calculators" },
      { label: ro ? "Ghiduri" : "Learn", href: "/learn" },
      { label: ro ? "Apă și reziliență" : "Water & Resilience", href: "/marketplace/water" },
    ] },
    {
      label: ro ? "Despre platformă" : "About the platform",
      href: "/about",
      children: [
        { label: ro ? "Despre noi" : "About", href: "/about" },
        { label: ro ? "Pentru afaceri" : "For business", href: "/business" },
        { label: ro ? "Experți" : "Experts", href: "/experts" },
        { label: "Contact", href: "/contact" },
        { label: "Renogy", href: "/renogy" },
        { label: "Waterdrop", href: "/waterdrop" },
        { label: ro ? "Media kit și parteneriate" : "Media kit & partnerships", href: "/partnerships" },
      ],
    },
    {
      label: ro ? "Legal și transparență" : "Legal & transparency",
      href: "/terms",
      children: [
        { label: ro ? "Confidențialitate" : "Privacy", href: "/privacy" },
        { label: ro ? "Termeni" : "Terms", href: "/terms" },
        {
          label: ro ? "Afiliere și furnizori" : "Affiliate disclosure",
          href: "/affiliate-disclosure",
        },
        { label: ro ? "Metodologie" : "Methodology", href: "/methodology" },
        { label: ro ? "Surse foto" : "Photo credits", href: "/photo-credits" },
        { label: ro ? "Politica editorială" : "Editorial policy", href: "/editorial-policy" },
        { label: ro ? "Autori" : "Author policy", href: "/author-policy" },
        { label: ro ? "Corecții" : "Corrections", href: "/corrections-policy" },
        { label: ro ? "Utilizarea AI" : "AI use", href: "/ai-use-policy" },
        { label: "FAQ", href: "/faq" },
      ],
    },
  ];
  return (
    <footer className="deep-footer">
      <div className="footer-heading">
        <Link href="/" className="brand-name">
          <BrandArtwork footer />
        </Link>
        <p>
          {ro
            ? "Echipamente energetice. Calcule explicabile. Alegeri informate."
            : "Energy equipment. Transparent calculations. Informed choices."}
        </p>
      </div>
      <div className="footer-columns">
        {groups.map((g) => (
          <div key={g.href}>
            <h2>
              <Link href={g.href}>{g.label}</Link>
            </h2>
            <ul>
              {g.children.map((i) => (
                <li key={i.href}>
                  <Link href={i.href}>{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="footer-disclosure">
        {ro
          ? "România / UE · Descoperire independentă de echipamente. Nu vindem și nu deținem stoc. Linkurile obișnuite nemarcate nu au urmărire afiliată. Numai linkurile marcate, după aprobarea și activarea programului, pot genera comision. Comerciantul gestionează prețul, stocul, plata, livrarea, garanția și retururile."
          : "Romania / EU · Independent equipment discovery. We do not sell or hold inventory. Ordinary unmarked links are not affiliate tracked. Only marked links, after program approval and activation, may generate commission. The merchant controls price, stock, payment, shipping, warranty and returns."}
      </p>
      <p className="small-copy">© 2026 M Air Electro AI</p>
      <p className="small-copy">{ro ? "Proprietar și editor independent" : "Owner and independent publisher"}: {siteConfig.operatorName} · {ro ? "România" : siteConfig.operatingCountry}. <Link href="/about">{ro ? "Despre editor" : "About the publisher"}</Link></p>
      <p className="small-copy"><a href={`mailto:${siteConfig.publicEmailAddresses.contact}`}>{siteConfig.publicEmailAddresses.contact}</a></p>
    </footer>
  );
}

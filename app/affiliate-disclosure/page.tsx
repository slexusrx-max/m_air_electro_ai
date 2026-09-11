import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";
import { glassPanelClassName } from "@/components/ui/glass";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Affiliate disclosure",
  description: "How M Air Electro AI presents independent equipment guidance and external supplier links.",
  path: "/affiliate-disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8">
        <PageHero eyebrow="Affiliate disclosure" title="Clear guidance first. Supplier choice second." description="M Air Electro AI helps visitors understand energy requirements before they visit an external suppliers. We do not sell, fulfil, or process orders on this website." />
        <div className={`${glassPanelClassName} space-y-7 p-6 text-sm leading-7 text-white/80 sm:p-8 sm:text-base`}>
          <section><h2 className="text-xl font-semibold text-white">Current status</h2><p className="mt-3">M Air Electro AI is preparing an application to the Renogy Affiliate Program through Impact. Until that application is approved, external Renogy EU links on this site are ordinary supplier links and are not affiliate links.</p></section>
          <section><h2 className="text-xl font-semibold text-white">Independent planning</h2><p className="mt-3">Recommendations are planning guidance based on stated loads and backup-time assumptions. Verify compatibility, installation requirements, current stock, price, delivery, warranty, returns and local electrical requirements directly with the supplier and a qualified installer.</p></section>
          <section><h2 className="text-xl font-semibold text-white">If the programme is approved</h2><p className="mt-3">This page will be updated before any tracked links are activated. The disclosure will state that qualifying purchases may generate a commission, while the supplier remains responsible for its products, checkout, delivery, returns and customer service.</p></section>
          <section><h2 className="text-xl font-semibold text-white">Pentru vizitatori din România</h2><p className="mt-3">Platforma te ajută să dimensionezi sistemul înainte să alegi un furnizor. Nu procesăm comenzi sau plăți. Verifică direct la furnizor prețul, stocul, livrarea, garanția și compatibilitatea finală.</p></section>
        </div>
      </section>
    </PlatformShell>
  );
}

import { DeepFooter } from "@/components/marketplace/deep-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentProfile, getCurrentUser } from "@/lib/supabase/auth";
import { getRequestLocale } from "@/lib/i18n/request";
import { navigation } from "@/lib/marketplace/navigation";
import { SupplierLinksProvider } from "@/components/marketplace/supplier-link";
import { supplierLink } from "@/lib/affiliate/providers";
import { catalog } from "@/lib/affiliate/catalog";
import { CommercialNotice } from "@/components/marketplace/commercial-notice";
import { ComparisonProvider, ComparisonTray } from "@/components/marketplace/compare-control";
import { getPublicSupplierPrices } from "@/lib/affiliate/price-feed";
import { PointerTiltController } from "@/components/pointer-tilt-controller";
type PlatformShellProps = {
  children: React.ReactNode;
  contentClassName?: string;
  mobileBrandIntro?: boolean;
};
export async function PlatformShell({
  children,
  contentClassName = "flex-1 px-4 pb-12 pt-8 sm:px-6 lg:px-8",
  mobileBrandIntro = false,
}: PlatformShellProps) {
  const [profile, user, locale, supplierPrices] = await Promise.all([
    getCurrentProfile(),
    getCurrentUser(),
    getRequestLocale(),
    getPublicSupplierPrices(),
  ]);
  const supplierLinks = Object.fromEntries(catalog.filter(p => p.productUrl).map(p => {
    const { href, tracked } = supplierLink(p);
    return [p.id, { href, tracked }];
  }));
  return (
    <div className={mobileBrandIntro ? "platform-root home-brand-first" : "platform-root"}>
      <PointerTiltController />
      <a className="skip-link" href="#main-content">
        {locale === "ro" ? "Salt la conținut" : "Skip to content"}
      </a>
      <SiteHeader
        profile={
          user
            ? {
                email: profile?.email ?? user.email ?? "",
                role: profile?.role ?? "client",
              }
            : null
        }
        dashboardHref="/dashboard"
        locale={locale}
        groups={navigation(locale)}
      />
      <CommercialNotice ro={locale === "ro"} />
      <div id="main-content" tabIndex={-1} className={contentClassName}>
        <SupplierLinksProvider links={supplierLinks} prices={supplierPrices}>
          <ComparisonProvider products={Object.fromEntries(catalog.filter(p => p.kind === "product").map(p => [p.id, { name: locale === "ro" ? p.title.ro : p.name, category: p.category }]))}>
          {children}
          <ComparisonTray ro={locale === "ro"} />
          </ComparisonProvider>
        </SupplierLinksProvider>
      </div>
      <DeepFooter locale={locale} />
    </div>
  );
}

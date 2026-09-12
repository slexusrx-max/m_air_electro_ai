import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";

type PlatformShellProps = {
  children: React.ReactNode;
  contentClassName?: string;
};
export async function PlatformShell({
  children,
  contentClassName = "flex-1 px-4 pb-16 pt-10 sm:px-6 lg:px-8",
}: PlatformShellProps) {
  const locale = await getRequestLocale();
  const dictionary = await getRequestDictionary();
  return (
    <div className="relative min-h-screen bg-transparent text-slate-900">
      <div className="relative flex min-h-screen flex-col">
        <a href="#content" className="skip-link">
          {locale === "ro" ? "Sari la conținut" : "Skip to content"}
        </a>
        <SiteHeader
          profile={null}
          dashboardHref="/dashboard"
          dictionary={dictionary}
          locale={locale}
        />
        <div id="content" tabIndex={-1} className={contentClassName}>
          {children}
        </div>
        <SiteFooter dictionary={dictionary} />
      </div>
    </div>
  );
}

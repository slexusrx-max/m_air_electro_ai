"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { glassPanelClassName, liquidGlassButtonClassName } from "@/components/ui/glass";
import { moreNavItems, primaryNavItems, siteNavItems } from "@/lib/site-navigation";
import type { MarketplaceRole } from "@/lib/i18n/types";
import type { Dictionary } from "@/lib/i18n/types";
import type { Locale } from "@/lib/i18n/types";
import { signOut } from "@/app/(auth)/actions";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

const navKeys: Record<string, string> = { Home: "nav.home", "Ukraine Energy Live": "nav.energy", "My Home": "nav.myHome", "Energy AI": "nav.energyAi", "Energy Marketplace": "nav.marketplace", "Energy Map": "nav.map", "For Business": "nav.business", "Backup Calculator": "nav.backup", "Find Installer": "nav.installers", Buildings: "nav.buildings", Professionals: "nav.professionals", Calculators: "nav.calculators" };

export function SiteHeader({ profile, dashboardHref = "/dashboard", dictionary: t, locale }: { profile: { email: string; role: MarketplaceRole } | null; dashboardHref?: string; dictionary: Dictionary; locale: Locale }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const switchLocale = async (nextLocale: Locale) => { if (nextLocale === locale) return; await fetch("/api/locale", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale: nextLocale }) }); window.location.reload(); };
  const languageControl = <div className="flex rounded-full border border-white/20 p-1 text-xs font-bold text-white"><button type="button" onClick={() => switchLocale("en")} aria-pressed={locale === "en"} className={`rounded-full px-2 py-1 ${locale === "en" ? "bg-white text-teal-950" : "text-white/75"}`}>EN</button><button type="button" onClick={() => switchLocale("uk")} aria-pressed={locale === "uk"} className={`rounded-full px-2 py-1 ${locale === "uk" ? "bg-white text-teal-950" : "text-white/75"}`}>UA</button></div>;

  return (
    <div className="mx-4 mt-4 sm:mx-6 lg:mx-8">
      <header
        className={`${glassPanelClassName} flex items-center justify-between gap-3 rounded-[2rem] bg-teal-950/95 px-4 py-3 sm:rounded-full sm:px-6 lg:px-8`}
      >
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            EA
          </div>
          <div className="min-w-0">
            <span className="block max-w-[11rem] text-sm font-semibold leading-tight tracking-[0.16em] text-white/95 sm:max-w-none sm:text-lg sm:tracking-[0.2em]">
              Electro-AI
            </span>
            <span className="mt-1 hidden text-[0.68rem] uppercase tracking-[0.24em] text-white/46 lg:block">
              {t["header.tagline"]}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 xl:flex">
          {primaryNavItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`${liquidGlassButtonClassName} px-4 py-2 text-sm font-medium ${
                  isActive
                    ? "border-lime-100/80 bg-[linear-gradient(135deg,rgba(246,255,235,0.28),rgba(163,230,53,0.16))] text-lime-50 shadow-[0_0_26px_rgba(163,230,53,0.28),0_10px_30px_rgba(0,0,0,0.12)]"
                    : ""
                }`}
              >
                {t[navKeys[item.label]] ?? item.label}
              </Link>
            );
          })}
          <div className="relative">
            <button type="button" onClick={() => setIsMoreOpen((open) => !open)} aria-expanded={isMoreOpen} className={`${liquidGlassButtonClassName} px-4 py-2 text-sm font-medium`}>{t["nav.more"] ?? "More"}</button>
            {isMoreOpen ? <div className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-white/20 bg-teal-950/95 p-2 shadow-xl backdrop-blur-xl">{moreNavItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setIsMoreOpen(false)} className="block rounded-xl px-3 py-2 text-sm text-white/85 hover:bg-white/10"><span className="font-semibold">{t[navKeys[item.label]] ?? item.label}</span></Link>)}</div> : null}
          </div>
          <Link href="/pro" className="rounded-full bg-lime-300 px-4 py-2 text-sm font-bold text-slate-950 shadow-sm">PRO</Link>
        </nav>

        <div className="flex items-center gap-2">{languageControl}
          {profile ? <><span className="hidden h-9 w-9 items-center justify-center rounded-full border border-lime-100/40 bg-lime-100/15 text-sm font-semibold text-lime-50 xl:inline-flex" title={profile.email}>{profile.email.slice(0, 1).toUpperCase()}</span><Link href={dashboardHref} className={`${liquidGlassButtonClassName} hidden px-4 py-2 text-sm font-semibold xl:inline-flex`}>{t["auth.dashboard"]}</Link><form action={signOut} className="hidden xl:block"><button className={`${liquidGlassButtonClassName} px-4 py-2 text-sm font-semibold`}>{t["auth.logout"]}</button></form></> : <><Link href="/login" className={`${liquidGlassButtonClassName} hidden px-4 py-2 text-sm font-semibold xl:inline-flex`}>{t["auth.login"]}</Link><Link href="/register" className="hidden rounded-full bg-lime-300 px-4 py-2 text-sm font-semibold text-slate-950 xl:inline-flex">{t["auth.register"]}</Link></>}
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? t["header.closeMenu"] : t["header.openMenu"]}
            className={`${liquidGlassButtonClassName} px-3 py-2 text-sm font-semibold xl:hidden`}
            onClick={() => setIsMobileMenuOpen((currentState) => !currentState)}
          >
            <span className="sr-only">{isMobileMenuOpen ? t["header.closeMenu"] : t["header.openMenu"]}</span>
            <span className="block h-5 w-5">
              <span className="flex h-full flex-col items-center justify-center gap-[3px]">
                <span
                  className={`block h-[1.5px] w-4 rounded-full bg-white transition ${
                    isMobileMenuOpen ? "translate-y-[4.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-4 rounded-full bg-white transition ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-4 rounded-full bg-white transition ${
                    isMobileMenuOpen ? "-translate-y-[4.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </span>
          </button>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div className={`${glassPanelClassName} mt-3 rounded-[1.75rem] p-3 xl:hidden`}>
          <nav className="flex flex-col gap-2">
            {siteNavItems.map((item) => {
              const isActive = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "border-lime-100/60 bg-lime-100/10 text-lime-50"
                      : "border-white/12 bg-white/[0.04] text-white/88 hover:border-white/20 hover:bg-white/[0.08]"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="block">{t[navKeys[item.label]] ?? item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2">{languageControl}</div>{profile ? <><Link href={dashboardHref} className="rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/88" onClick={() => setIsMobileMenuOpen(false)}>{t["auth.dashboard"]}</Link><form action={signOut}><button className="w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-white/88">{t["auth.logout"]}</button></form></> : <div className="grid grid-cols-2 gap-2"><Link href="/login" className="rounded-2xl border border-white/12 px-4 py-3 text-center text-sm font-semibold" onClick={() => setIsMobileMenuOpen(false)}>{t["auth.login"]}</Link><Link href="/register" className="rounded-2xl bg-lime-300 px-4 py-3 text-center text-sm font-semibold text-slate-950" onClick={() => setIsMobileMenuOpen(false)}>{t["auth.register"]}</Link></div>}
          </nav>
        </div>
      ) : null}
    </div>
  );
}

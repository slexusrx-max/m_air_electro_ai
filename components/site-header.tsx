"use client";
import { BrandMark } from "./brand-artwork";
import Link from "@/components/localized-link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { isLocalizedPublicPath, localizedPath, stripLocale } from "@/lib/i18n/routing";
import type { Locale, MarketplaceRole } from "@/lib/i18n/types";
import { currentNavigationSection } from "@/lib/marketplace/navigation-current";
import type { NavigationGroup } from "@/lib/marketplace/navigation";
import { signOut } from "@/app/(auth)/actions";
import { EnergySchematic } from "./energy-schematic";
import { visualFamily } from "@/lib/visual-system";
const subscribeHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
export function SiteHeader({
  profile,
  dashboardHref = "/dashboard",
  locale,
  groups,
}: {
  profile: { email: string; role: MarketplaceRole } | null;
  dashboardHref?: string;
  locale: Locale;
  groups: NavigationGroup[];
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [error, setError] = useState("");
  const [switching, setSwitching] = useState(false);
  const hydrated = useSyncExternalStore(subscribeHydration, clientReady, serverReady);
  const ref = useRef<HTMLElement>(null);
  const currentPath = usePathname();
  const pathname = stripLocale(currentPath);
  const currentSection = currentNavigationSection(pathname, groups);
  const search = useSearchParams().toString();
  const ro = locale === "ro";
  useEffect(() => {
    function close(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(null);
        setMobile(false);
        const account = ref.current.querySelector<HTMLDetailsElement>('.account-menu');
        if (account) account.open = false;
      }
    }
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        const account = ref.current?.querySelector<HTMLDetailsElement>('.account-menu[open]');
        if (account) { account.open = false; account.querySelector<HTMLElement>('summary')?.focus(); }
        setOpen(null);
        setMobile(false);
        ref.current
          ?.querySelector<HTMLButtonElement>('[data-menu-trigger][aria-expanded="true"]')
          ?.focus();
      }
    }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  async function language(next: Locale) {
    if (next === locale) return;
    setSwitching(true);
    try {
      const response = await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      if (!response.ok) throw Error();
      window.location.reload();
    } catch {
      setError(
        ro
          ? "Schimbarea limbii a eșuat. Încearcă din nou."
          : "Language switch failed. Please retry.",
      );
      setSwitching(false);
    }
  }
  const languages = (
    <div className="language-control" aria-label={ro ? "Limbă" : "Language"}>
      {(["ro", "en"] as const).map((l) => isLocalizedPublicPath(currentPath) ? (
        <a key={l} href={localizedPath(`${currentPath}${search ? `?${search}` : ""}`, l)}
          hrefLang={l} lang={l} aria-current={locale === l ? "page" : undefined}
          onClick={event => {
            document.cookie = `mr-electro-locale=${l}; Path=/; Max-Age=31536000; SameSite=Lax`;
            event.currentTarget.href = localizedPath(`${window.location.pathname}${window.location.search}${window.location.hash}`, l);
          }}>{l.toUpperCase()}</a>
      ) : (
        <button
          key={l}
          disabled={!hydrated || switching}
          aria-pressed={locale === l}
          onClick={() => language(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
  const active = groups.find((g) => g.href === open);
  return (
    <header ref={ref} className="commerce-header">
      <div className="header-bar">
        <Link
          href="/"
          className="brand-name"
          onClick={() => {
            setOpen(null);
            setMobile(false);
          }}
        >
          <BrandMark />
          <span>
            M Air <small>Electro AI</small>
          </span>
        </Link>
        <nav
          className="desktop-nav"
          aria-label={ro ? "Navigație principală" : "Primary navigation"}
        >
          {groups.map((g) => (
            <div key={g.href} className="nav-pair">
              <Link
                href={g.href}
                className={g.href === "/marketplace/water" ? "water-nav-link" : undefined}
                aria-current={currentSection === g.href ? (pathname === g.href ? "page" : "location") : undefined}
                onClick={() => setOpen(null)}
              >
                {g.label}
              </Link>
              {g.children.length > 0 && (
                <button
                  data-menu-trigger
                  disabled={!hydrated}
                  aria-label={`${g.label} menu`}
                  aria-expanded={open === g.href}
                  aria-controls="mega-menu"
                  onClick={() => setOpen(open === g.href ? null : g.href)}
                >
                  ⌄
                </button>
              )}
            </div>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            href="/search"
            aria-label={ro ? "Caută" : "Search"}
            className="search-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><span>{ro ? "Caută" : "Search"}</span>
          </Link>
          {languages}
          <details className="desktop-account-actions account-menu"><summary>{ro ? "Cont" : "Account"}</summary><div>
            {profile ? <><Link href={dashboardHref}>{ro ? "Cont" : "Account"}</Link><form action={signOut}><button>{ro ? "Deconectare" : "Sign out"}</button></form></> : <><Link href="/login">{ro ? "Autentificare" : "Log in"}</Link><Link className="register-link" href="/register">{ro ? "Creează cont" : "Create account"}</Link></>}
          </div></details>
          <button
            className="mobile-menu-toggle"
            disabled={!hydrated}
            aria-label={ro ? "Meniu" : "Menu"}
            data-menu-trigger
            aria-expanded={mobile}
            aria-controls="mobile-menu"
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? "✕" : "☰"} <span>{ro ? "Meniu" : "Menu"}</span>
          </button>
        </div>
      </div>
      {error && <p role="alert">{error}</p>}
      {active && (
        <nav
          id="mega-menu"
          className="mega-menu"
          aria-label={`${active.label} menu`}
        >
          <div className="mega-heading">
            <Link href={active.href} onClick={() => setOpen(null)}>
              {ro ? "Explorează" : "Explore"} {active.label} →
            </Link>
            <button
              onClick={() => {
                ref.current?.querySelector<HTMLButtonElement>('[data-menu-trigger][aria-expanded="true"]')?.focus();
                setOpen(null);
              }}
              aria-label={ro ? "Închide meniul" : "Close menu"}
            >
              ✕
            </button>
          </div>
          <div className="mega-columns">
            {[active].map((group) => (
              <section className="mega-section" key={group.href} aria-label={group.label}>
                <Link className="mega-section-title" href={group.href} onClick={() => setOpen(null)}>{group.label} <span aria-hidden="true">↗</span></Link>
                {group.children.filter((item) => item.href !== "/marketplace/water").map((item) => item.children?.length ? (
                  <details className="mega-subcategory" name="marketplace-category" key={item.href}>
                    <summary><EnergySchematic family={visualFamily(item.href)} className="category-symbol" />{item.label}</summary>
                    <div className="mega-subcategory-links">
                      <Link href={item.href} onClick={() => setOpen(null)}>{ro ? "Vezi categoria" : "View category"} →</Link>
                      {item.children.map((child) => <Link key={child.href} href={child.href} onClick={() => setOpen(null)}>{child.label}</Link>)}
                    </div>
                  </details>
                ) : <Link key={item.href} href={item.href} onClick={() => setOpen(null)}>{item.label}</Link>)}
              </section>
            ))}
            <Link className="mega-renogy" href="/renogy" onClick={() => setOpen(null)}><span>{ro ? "PARTENER AFILIAT INDEPENDENT" : "INDEPENDENT AFFILIATE PARTNER"}</span><strong>Renogy</strong><p>{ro ? "Solar. Stocare. Libertate de construit." : "Solar. Storage. Freedom to build."}</p><span>{ro ? "Explorează selecția" : "Explore the selection"} ↗</span></Link>
            <Link className="mega-water" href="/marketplace/water" onClick={() => setOpen(null)}>
              <span className="mega-water-icon" aria-hidden="true">◇</span>
              <span className="mega-water-eyebrow">{ro ? "Apă și reziliență" : "Water & Resilience"}</span>
              <strong>{ro ? "Apă pură. Un viitor mai luminos." : "Pure Water. Brighter Tomorrow."}</strong>
              <span>{ro ? "Soluții pentru acasă, călătorii și viața off-grid." : "Solutions for home, travel and off-grid living."}</span>
              <span className="mega-water-cta">{ro ? "Explorează soluțiile" : "Explore water solutions"} ↗</span>
            </Link>
          </div>
        </nav>
      )}
      {mobile && (
        <nav
          id="mobile-menu"
          className="mobile-nav"
          aria-label={ro ? "Navigație mobilă" : "Mobile navigation"}
        >
          {groups.map((g) =>
            g.children.length ? (
              <details name="mobile-section" key={g.href}>
                <summary data-primary-section={g.href} aria-current={currentSection === g.href ? "location" : undefined}>{g.label}</summary>
                <Link href={g.href} onClick={() => setMobile(false)}>
                  {ro ? "Explorează" : "Explore"} {g.label} →
                </Link>
                {g.children.filter((c) => c.href !== "/marketplace/water").map((c) =>
                  c.children?.length ? (
                    <details name={`mobile-category-${g.href}`} key={c.href}>
                      <summary>{c.label}</summary>
                      <Link href={c.href} onClick={() => setMobile(false)}>
                        {ro ? "Explorează:" : "Explore:"} {c.label}
                      </Link>
                      {c.children.map((n) => (
                        <Link
                          key={n.href}
                          href={n.href}
                          onClick={() => setMobile(false)}
                        >
                          {n.label}
                        </Link>
                      ))}
                    </details>
                  ) : (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setMobile(false)}
                    >
                      {c.label}
                    </Link>
                  ),
                )}
              </details>
            ) : (
              <Link key={g.href} href={g.href} data-primary-section={g.href} aria-current={currentSection === g.href ? (pathname === g.href ? "page" : "location") : undefined} className={`mobile-primary-link${g.href === "/marketplace/water" ? " water-nav-link" : ""}`} onClick={() => setMobile(false)}>
                {g.label}
              </Link>
            ),
          )}
          <Link href="/compare" onClick={() => setMobile(false)}>
            {ro ? "Compară echipamente" : "Compare equipment"}
          </Link>
          <Link href="/marketplace/water" className="water-nav-link" onClick={() => setMobile(false)}>
            {ro ? "Apă și reziliență" : "Water & Resilience"}
          </Link>
          <div className="mobile-account-actions">
            {profile ? <Link href={dashboardHref} onClick={() => setMobile(false)}>{ro ? "Contul meu" : "My account"}</Link> : <><Link href="/login" onClick={() => setMobile(false)}>{ro ? "Autentificare" : "Log in"}</Link><Link href="/register" onClick={() => setMobile(false)}>{ro ? "Creează cont" : "Create account"}</Link></>}
          </div>
          {profile && (
            <form action={signOut}>
              <button>{ro ? "Deconectare" : "Sign out"}</button>
            </form>
          )}
        </nav>
      )}
    </header>
  );
}

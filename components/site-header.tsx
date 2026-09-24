"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale, MarketplaceRole } from "@/lib/i18n/types";
import type { NavigationGroup } from "@/lib/marketplace/navigation";
import { signOut } from "@/app/(auth)/actions";
import { EnergySchematic } from "./energy-schematic";
import { visualFamily } from "@/lib/visual-system";
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
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const ro = locale === "ro";
  useEffect(() => {
    function close(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(null);
        setMobile(false);
      }
    }
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
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
      {(["ro", "en"] as const).map((l) => (
        <button
          key={l}
          disabled={switching}
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
          <span className="brand-mark">M</span>
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
                aria-current={pathname === g.href ? "page" : undefined}
                onClick={() => setOpen(null)}
              >
                {g.label}
              </Link>
              {g.children.length > 0 && (
                <button
                  data-menu-trigger
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
            ⌕
          </Link>
          {languages}
          <div className="desktop-account-actions">
            {profile ? <><Link href={dashboardHref}>{ro ? "Cont" : "Account"}</Link><form action={signOut}><button>{ro ? "Deconectare" : "Sign out"}</button></form></> : <><Link href="/login">{ro ? "Autentificare" : "Log in"}</Link><Link className="register-link" href="/register">{ro ? "Creează cont" : "Create account"}</Link></>}
          </div>
          <button
            className="mobile-menu-toggle"
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
              onClick={() => setOpen(null)}
              aria-label={ro ? "Închide meniul" : "Close menu"}
            >
              ✕
            </button>
          </div>
          <div className="mega-columns">
            {active.children.map((g) => (
              <div key={g.href}>
                <Link
                  className="mega-category"
                  href={g.href}
                  onClick={() => setOpen(null)}
                >
                  {active.href === "/marketplace" && <EnergySchematic family={visualFamily(g.href)} className="category-symbol" />}
                  {g.label} →
                </Link>
                {g.children?.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    onClick={() => setOpen(null)}
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </nav>
      )}
      {mobile && (
        <nav
          id="mobile-menu"
          className="mobile-nav"
          aria-label={ro ? "Navigație mobilă" : "Mobile navigation"}
        >
          <div className="mobile-account-actions">
            {profile ? <Link href={dashboardHref} onClick={() => setMobile(false)}>{ro ? "Contul meu" : "My account"}</Link> : <><Link href="/login" onClick={() => setMobile(false)}>{ro ? "Autentificare" : "Log in"}</Link><Link href="/register" onClick={() => setMobile(false)}>{ro ? "Creează cont" : "Create account"}</Link></>}
          </div>
          {groups.map((g) =>
            g.children.length ? (
              <details key={g.href}>
                <summary>{g.label}</summary>
                <Link href={g.href} onClick={() => setMobile(false)}>
                  {ro ? "Explorează" : "Explore"} {g.label} →
                </Link>
                {g.children.map((c) =>
                  c.children?.length ? (
                    <details key={c.href}>
                      <summary>{c.label}</summary>
                      <Link href={c.href} onClick={() => setMobile(false)}>
                        {ro ? "Toate" : "All"} {c.label}
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
              <Link key={g.href} href={g.href} onClick={() => setMobile(false)}>
                {g.label}
              </Link>
            ),
          )}
          <Link href="/compare" onClick={() => setMobile(false)}>
            {ro ? "Compară echipamente" : "Compare equipment"}
          </Link>
          <Link href="/about" onClick={() => setMobile(false)}>
            {ro ? "Despre noi" : "About"}
          </Link>
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

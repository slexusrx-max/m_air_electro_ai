"use client";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import type { Dictionary, Locale, MarketplaceRole } from "@/lib/i18n/types";
import { commercialCopy } from "@/lib/marketplace/copy";
const subscribe = () => () => {};
export function SiteHeader({
  dictionary: t,
  locale,
}: {
  profile: { email: string; role: MarketplaceRole } | null;
  dashboardHref?: string;
  dictionary: Dictionary;
  locale: Locale;
}) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const c = commercialCopy(t),
    path = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false),
    [error, setError] = useState("");
  const links = [
    ["/marketplace/find-my-solution", c.finder],
    ["/marketplace", c.marketplace],
    ["/backup-calculator", c.backup],
    ["/about", c.about],
    ["/contact", c.contact],
  ];
  async function language(next: string) {
    try {
      const r = await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      if (!r.ok) throw Error();
      window.location.reload();
    } catch {
      setError(
        c.ro
          ? "Limba nu a putut fi schimbată. Încearcă din nou."
          : "Could not change language. Try again.",
      );
    }
  }
  return (
    <header className="site-header mx-4 mt-4 rounded-3xl border border-teal-900/15 bg-white/95 px-4 py-4 shadow-sm sm:mx-6 lg:mx-8">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-900 text-sm font-bold text-white">
            MA
          </span>
          <span className="text-sm font-extrabold tracking-tight sm:text-lg">
            M Air Electro AI
          </span>
        </Link>
        <nav
          aria-label={c.ro ? "Navigare principală" : "Main navigation"}
          className="hidden items-center gap-5 xl:flex"
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              className="text-sm font-semibold hover:underline"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="site-language">
            {c.ro ? "Limba" : "Language"}
          </label>
          <select
            disabled={!hydrated}
            id="site-language"
            value={locale === "en" ? "en" : "ro"}
            onChange={(e) => language(e.target.value)}
            className="rounded-lg border border-teal-900/20 bg-white px-1 py-2 text-sm"
          >
            <option value="ro">RO</option>
            <option value="en">EN</option>
          </select>
          <button
            disabled={!hydrated}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={
              open
                ? c.ro
                  ? "Închide meniul"
                  : "Close menu"
                : c.ro
                  ? "Deschide meniul"
                  : "Open menu"
            }
            ref={menuButton}
            className="rounded-lg border border-teal-900/20 px-3 py-2 xl:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
      {error ? <p role="alert">{error}</p> : null}
      {open ? (
        <nav
          id="mobile-navigation"
          aria-label={c.ro ? "Navigare mobilă" : "Mobile navigation"}
          className="mt-4 grid gap-1 border-t border-teal-900/15 pt-3 xl:hidden"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              menuButton.current?.focus();
            }
          }}
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 font-semibold hover:bg-teal-50"
            >
              {label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

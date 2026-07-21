"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { glassPanelClassName, liquidGlassButtonClassName } from "@/components/ui/glass";
import { siteNavItems } from "@/lib/site-navigation";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="mx-4 mt-4 sm:mx-6 lg:mx-8">
      <header
        className={`${glassPanelClassName} flex items-center justify-between gap-3 rounded-[2rem] px-4 py-3 sm:rounded-full sm:px-6 lg:px-8`}
      >
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl">
            MA
          </div>
          <div className="min-w-0">
            <span className="block max-w-[11rem] text-sm font-semibold leading-tight tracking-[0.16em] text-white/95 sm:max-w-none sm:text-lg sm:tracking-[0.2em]">
              M Air Electro AI
            </span>
            <span className="mt-1 hidden text-[0.68rem] uppercase tracking-[0.24em] text-white/46 lg:block">
              Diagnostics - Calculators - Experts - Protected marketplace
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {siteNavItems.map((item) => {
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
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className={`${liquidGlassButtonClassName} hidden px-4 py-2 text-sm font-semibold sm:inline-flex`}
          >
            Contact
          </Link>
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className={`${liquidGlassButtonClassName} px-3 py-2 text-sm font-semibold md:hidden`}
            onClick={() => setIsMobileMenuOpen((currentState) => !currentState)}
          >
            <span className="sr-only">{isMobileMenuOpen ? "Close menu" : "Open menu"}</span>
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
        <div className={`${glassPanelClassName} mt-3 rounded-[1.75rem] p-3 md:hidden`}>
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
                  <span className="block">{item.label}</span>
                  <span className="mt-1 block text-xs leading-6 text-white/58">{item.description}</span>
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/88 transition hover:border-white/20 hover:bg-white/[0.08] sm:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}

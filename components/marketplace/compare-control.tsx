"use client";
import Link from "@/components/localized-link";
import { createContext, useContext, useSyncExternalStore, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/lib/i18n/routing";
const Products = createContext<Record<string, string>>({});
export function ComparisonProvider({ products, children }: { products: Record<string, string>; children: ReactNode }) {
  return <Products.Provider value={products}>{children}</Products.Provider>;
}
const key = "mair-compare";
function snapshot() {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}
function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener("mair-compare", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("mair-compare", cb);
  };
}
function save(ids: string[]) {
  localStorage.setItem(key, ids.join(","));
  window.dispatchEvent(new Event("mair-compare"));
}
function useSelection() {
  const saved = useSyncExternalStore(subscribe, snapshot, () => "");
  const products = useContext(Products);
  const ids = [...new Set(saved.split(","))].filter(id => Object.hasOwn(products, id)).slice(0, 4);
  return { ids, products };
}
export function ComparisonTray({ ro }: { ro: boolean }) {
  const { ids, products } = useSelection();
  const [error, setError] = useState("");
  const pathname = stripLocale(usePathname());
  if (!ids.length || pathname === "/compare" || /^(\/login|\/register|\/dashboard|\/account)/.test(pathname)) return null;
  function remove(id: string) {
    try { save(ids.filter(value => value !== id)); setError(""); }
    catch { setError(ro ? "Selecția nu poate fi actualizată în acest browser." : "Your selection could not be updated in this browser."); }
  }
  return <aside className="comparison-tray" aria-label={ro ? "Produse pentru comparație" : "Products to compare"}>
    <div className="comparison-tray-heading"><strong aria-live="polite">{ro ? "Comparația ta" : "Your comparison"} <span>{ids.length}/4</span></strong><Link href={`/compare?ids=${encodeURIComponent(ids.join(","))}`}>{ro ? "Compară" : "Compare"} →</Link></div>
    <ul>{ids.map(id => <li key={id}><span>{products[id]}</span><button onClick={() => remove(id)} aria-label={`${ro ? "Elimină" : "Remove"} ${products[id]}`}>×</button></li>)}</ul>
    {ids.length === 1 && <p>{ro ? "Adaugă încă un produs pentru comparație." : "Add one more product to compare."}</p>}
    {error && <p role="alert">{error}</p>}
  </aside>;
}
export function SavedComparison({ ro }: { ro: boolean }) {
  const saved = useSelection().ids.join(",");
  return <><p>{ro ? "Selecția este păstrată doar în acest browser, pe acest dispozitiv, și poate fi accesată de alți utilizatori ai browserului. Nu este sincronizată cu contul." : "The selection is stored only in this browser on this device and may be accessed by other browser users. It is not synced to your account."}</p>{saved ? <Link className="button-outline" href={`/compare?ids=${encodeURIComponent(saved)}`}>{ro ? "Continuă comparația" : "Continue comparison"} →</Link> : <p>{ro ? "Nu există o selecție de comparat în acest browser." : "There is no comparison selection in this browser."}</p>}</>;
}
export function CompareControl({
  id,
  ro = false,
}: {
  id: string;
  ro?: boolean;
}) {
  const { ids } = useSelection();
  const saved = ids.join(",");
  const active = ids.includes(id);
  const [message, setMessage] = useState("");
  function toggle() {
    const next = active ? ids.filter((v) => v !== id) : [...ids, id];
    if (next.length > 4) {
      setMessage(
        ro
          ? "Maximum 4. Elimină un produs din comparație."
          : "Maximum 4. Remove an item from comparison.",
      );
      return;
    }
    try {
      save(next);
      setMessage("");
    } catch {
      setMessage(
        ro
          ? "Stocarea locală nu este disponibilă. Folosește pagina Compară."
          : "Local storage unavailable. Use the Compare page.",
      );
    }
  }
  return (
    <div className="compare-control">
      <button type="button" aria-pressed={active} onClick={toggle}>
        {active ? "✓ " : "+ "}
        {ro ? "Compară" : "Compare"}
      </button>
      {ids.length > 0 && (
        <Link href={`/compare?ids=${encodeURIComponent(saved)}`}>
          {ro ? "Vezi" : "View"} ({ids.length}) →
        </Link>
      )}
      {message && <p role="status">{message}</p>}
    </div>
  );
}

export function RemoveComparison({ ids, ro }: { ids: string[]; ro: boolean }) {
  return <Link className="remove-compare" href={`/compare?ids=${encodeURIComponent(ids.join(","))}`} onClick={() => {
    try {
      localStorage.setItem(key, ids.join(","));
      window.dispatchEvent(new Event("mair-compare"));
    } catch { /* URL-based comparison remains usable without browser storage. */ }
  }}>{ro ? "Elimină" : "Remove"}</Link>;
}

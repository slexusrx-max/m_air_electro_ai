"use client";
import { trackEvent, type AnalyticsProperties } from "@/lib/analytics";
import Link from "@/components/localized-link";
import { createContext, useContext, useSyncExternalStore, useState, useId, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/lib/i18n/routing";
type ComparisonProduct = { name: string; category: string; catalogCategory?: string; supplier?: string; brand?: string; sku?: string };
const Products = createContext<Record<string, ComparisonProduct>>({});
function comparisonProperties(id: string, products: Record<string, ComparisonProduct>, ro: boolean): AnalyticsProperties {
  const product = products[id];
  return { product: id, language: ro ? "ro" : "en", kind: "product", category: product?.catalogCategory,
    supplier: product?.supplier, brand: product?.brand, sku: product?.sku };
}
export function ComparisonProvider({ products, children }: { products: Record<string, ComparisonProduct>; children: ReactNode }) {
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
function restoreCardFocus(id: string) {
  const target = document.querySelector<HTMLElement>(`button[data-compare-product="${CSS.escape(id)}"]`)
    ?? document.getElementById("main-content");
  if (target) {
    if (!target.hasAttribute("tabindex") && target.tagName !== "BUTTON") target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
}
function useSelection() {
  const saved = useSyncExternalStore(subscribe, snapshot, () => "");
  const products = useContext(Products);
  const valid = [...new Set(saved.split(","))].filter(id => Object.hasOwn(products, id));
  const ids = valid.filter(id => products[id].category === products[valid[0]]?.category).slice(0, 4);
  return { ids, products };
}
export function ComparisonTray({ ro }: { ro: boolean }) {
  const { ids, products } = useSelection();
  const [error, setError] = useState("");
  // Expansion is deliberate and temporary. Saved selections always hydrate compact.
  const [expandedSelection, setExpandedSelection] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = stripLocale(usePathname());
  const selectionKey = `${pathname}:${ids.join(",")}`;
  const expanded = expandedSelection === selectionKey;
  if (!ids.length || pathname === "/compare" || /^(\/login|\/register|\/dashboard|\/account)/.test(pathname)) return null;
  function remove(id: string) {
    const next = ids.filter(value => value !== id);
    try {
      save(next);
      trackEvent("product_compare_remove", comparisonProperties(id, products, ro));
      setExpandedSelection(next.length ? `${pathname}:${next.join(",")}` : null);
      setError("");
      if (next.length) toggleRef.current?.focus();
      else restoreCardFocus(id);
    }
    catch { setError(ro ? "Selecția nu poate fi actualizată în acest browser." : "Your selection could not be updated in this browser."); }
  }
  function clear() {
    try {
      save([]);
      ids.forEach(id => trackEvent("product_compare_remove", comparisonProperties(id, products, ro)));
      restoreCardFocus(ids[0]);
      setExpandedSelection(null);
      setError("");
    }
    catch { setError(ro ? "Selecția nu poate fi actualizată în acest browser." : "Your selection could not be updated in this browser."); }
  }
  return <aside className="comparison-tray" data-expanded={expanded} data-count={ids.length} aria-label={ro ? "Produse pentru comparație" : "Products to compare"} onKeyDown={event => {
    if (event.key === "Escape" && expanded) {
      setExpandedSelection(null);
      toggleRef.current?.focus();
    }
  }}>
    <div className="comparison-tray-heading">
      <button type="button" ref={toggleRef} className="comparison-tray-toggle" aria-controls={panelId} aria-expanded={expanded} onClick={() => setExpandedSelection(expanded ? null : selectionKey)}>
        <strong>{ro ? "Comparație" : "Compare"} <span aria-live="polite">{ids.length}/4</span></strong>
        <span className="comparison-tray-toggle-label">{expanded ? (ro ? "Minimizează" : "Minimize") : (ro ? "Extinde" : "Expand")} <span aria-hidden="true">{expanded ? "⌄" : "⌃"}</span></span>
      </button>
      {ids.length >= 2 && <Link href={`/compare?ids=${encodeURIComponent(ids.join(","))}`}>{ro ? "Compară" : "Compare"} →</Link>}
    </div>
    <div id={panelId} className="comparison-tray-panel" hidden={!expanded}>
      <ul>{ids.map(id => <li key={id}><span>{products[id].name}</span><button type="button" onClick={() => remove(id)} aria-label={`${ro ? "Elimină" : "Remove"} ${products[id].name}`}>×</button></li>)}</ul>
      <div className="comparison-tray-footer">
        {ids.length === 1 && <p>{ro ? "Adaugă încă un produs pentru comparație." : "Add one more product to compare."}</p>}
        <button type="button" className="comparison-tray-clear" onClick={clear}>{ro ? "Șterge tot" : "Clear all"}</button>
      </div>
    </div>
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
  const { ids, products } = useSelection();
  const active = ids.includes(id);
  const [message, setMessage] = useState("");
  function toggle() {
    if (!products[id]) return;
    if (!active && ids.length && products[ids[0]].category !== products[id].category) {
      setMessage(ro ? "Compară aceeași categorie. Elimină selecția curentă din bara de comparație pentru a începe alta." : "Compare within one category. Remove the current tray selection to start another.");
      return;
    }
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
      trackEvent(active ? "product_compare_remove" : "product_compare_add", comparisonProperties(id, products, ro));
      setMessage("");
    } catch {
      setMessage(
        ro
          ? "Stocarea locală nu este disponibilă. Folosește pagina Compară."
          : "Local storage unavailable. Use the Compare page.",
      );
    }
  }
  if (!products[id]) return null;
  return (
    <div className="compare-control">
      <button type="button" data-compare-product={id} aria-pressed={active} onClick={toggle}>
        {active ? "✓ " : "+ "}
        {ro ? "Compară" : "Compare"}
      </button>
      {message && <p role="status">{message}</p>}
    </div>
  );
}

export function RemoveComparison({ ids, ro }: { ids: string[]; ro: boolean }) {
  const { ids: saved, products } = useSelection();
  return <Link className="remove-compare" href={`/compare?ids=${encodeURIComponent(ids.join(","))}`} onClick={() => {
    try {
      save(ids);
      saved.filter(id => !ids.includes(id)).forEach(id => trackEvent("product_compare_remove", comparisonProperties(id, products, ro)));
    } catch { /* URL-based comparison remains usable without browser storage. */ }
  }}>{ro ? "Elimină" : "Remove"}</Link>;
}

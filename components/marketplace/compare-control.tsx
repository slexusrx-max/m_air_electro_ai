"use client";
import Link from "next/link";
import { useSyncExternalStore, useState } from "react";
const key = "mair-compare";
function snapshot() { try { return localStorage.getItem(key) ?? ""; } catch { return ""; } }
function subscribe(cb: () => void) { window.addEventListener("storage", cb); window.addEventListener("mair-compare", cb); return () => { window.removeEventListener("storage", cb); window.removeEventListener("mair-compare", cb); }; }
export function CompareControl({ id, ro = false }: { id: string; ro?: boolean }) {
 const saved = useSyncExternalStore(subscribe, snapshot, () => ""); const ids = saved.split(",").filter(Boolean); const active = ids.includes(id); const [message, setMessage] = useState("");
 function toggle() { const next = active ? ids.filter(v => v !== id) : [...ids,id]; if (next.length > 4) { setMessage(ro ? "Maximum 4. Elimină un produs din comparație." : "Maximum 4. Remove an item from comparison."); return; } try { localStorage.setItem(key, next.join(",")); window.dispatchEvent(new Event("mair-compare")); setMessage(""); } catch { setMessage(ro ? "Stocarea locală nu este disponibilă. Folosește pagina Compară." : "Local storage unavailable. Use the Compare page."); } }
 return <div className="compare-control"><button type="button" aria-pressed={active} onClick={toggle}>{active ? "✓ " : "+ "}{ro ? "Compară" : "Compare"}</button>{ids.length > 0 && <Link href={`/compare?ids=${encodeURIComponent(saved)}`}>{ro ? "Vezi" : "View"} ({ids.length}) →</Link>}{message && <p role="status">{message}</p>}</div>;
}

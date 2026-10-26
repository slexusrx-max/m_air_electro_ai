"use client";
import { useState } from "react";
import Link from "@/components/localized-link";
import { localizedPath } from "@/lib/i18n/routing";
import { comparisonLabels } from "@/lib/marketplace/comparison";

type Choice = { id: string; name: string; category: string };
export function ComparisonForm({ products, selected, initialCategory = "", ro }: { products: Choice[]; selected: string[]; initialCategory?: string; ro: boolean }) {
  const [category, setCategory] = useState(products.find(p => p.id === selected[0])?.category ?? (products.some(p => p.category === initialCategory) ? initialCategory : ""));
  const [ids, setIds] = useState(selected);
  const categories = [...new Set(products.map(p => p.category))];
  const options = products.filter(p => p.category === category);
  function updateDraft(nextCategory: string, nextIds: string[]) {
    setCategory(nextCategory);
    setIds(nextIds);
    const query = new URLSearchParams({ category: nextCategory, ids: nextIds.filter(Boolean).join(",") });
    window.history.replaceState(null, "", `${window.location.pathname}?${query}`);
  }
  return <form action={localizedPath("/compare", ro ? "ro" : "en")} className="content-panel comparison-form">
    <label>{ro ? "Categoria de comparat" : "Category to compare"}<select name="category" value={category} onChange={event => updateDraft(event.target.value, [])}>
      <option value="">{ro ? "Alege categoria" : "Choose a category"}</option>
      {categories.map(value => <option key={value} value={value}>{comparisonLabels[value]?.[ro ? 1 : 0] ?? value}</option>)}
    </select></label>
    <p>{ro ? "Alege 2–4 modele din aceeași categorie. Comparația nu confirmă compatibilitatea instalației." : "Choose 2–4 models in the same category. Comparison does not confirm installation compatibility."}</p>
    {category && <div className="compare-selectors">{[0, 1, 2, 3].map(index => <label key={index}>{ro ? "Echipament" : "Equipment"} {index + 1}
      <select name={`item${index + 1}`} value={ids[index] ?? ""} onChange={event => updateDraft(category, Array.from({ length: 4 }, (_, i) => i === index ? event.target.value : ids[i] ?? ""))}>
        <option value="">{ro ? "Selectează" : "Select"}</option>
        {options.map(p => <option key={p.id} value={p.id} disabled={ids.includes(p.id) && ids[index] !== p.id}>{p.name}</option>)}
      </select>
    </label>)}</div>}
    <div className="action-row"><button type="submit" className="button-primary" disabled={new Set(ids.filter(Boolean)).size < 2}>{ro ? "Compară selecția" : "Compare selection"}</button><Link href="/compare" onClick={() => { setCategory(""); setIds([]); }}>{ro ? "Resetează" : "Reset"}</Link></div>
  </form>;
}

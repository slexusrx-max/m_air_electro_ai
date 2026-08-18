"use client";

import { useEffect, useId, useState } from "react";
import type { Dictionary } from "@/lib/i18n/types";

type Field = "city" | "street" | "building";
type Item = { id: string; name?: string; number?: string; region?: string; source?: "ukrposhta" | "nominatim"; settlementId?: string; settlementName?: string };

function itemLabel(item: Item) {
  return item.name ?? item.number ?? "";
}

export function AddressSelector({ dictionary: t, onAddressChange }: { dictionary: Dictionary; onAddressChange?: (address: { city: string; street: string; house: string; apartment: string }) => void }) {
  const [city, setCity] = useState<Item | null>(null);
  const [street, setStreet] = useState<Item | null>(null);
  const [building, setBuilding] = useState<Item | null>(null);
  const [cityQuery, setCityQuery] = useState("");
  const [streetQuery, setStreetQuery] = useState("");
  const [buildingQuery, setBuildingQuery] = useState("");
  const [apartment, setApartment] = useState("");
  const [activeField, setActiveField] = useState<Field | null>(null);
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [retry, setRetry] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [result, setResult] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const listId = useId();

  const query = activeField === "city" ? cityQuery : activeField === "street" ? streetQuery : buildingQuery;
  const selectedBuilding = building ?? ((street || manualMode) && buildingQuery.trim() ? { id: `manual:${buildingQuery.trim()}`, number: buildingQuery.trim() } : null);

  useEffect(() => {
    const minimumLength = activeField === "building" ? 1 : 2;
    if (manualMode || !activeField || query.trim().length < minimumLength) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      const params = new URLSearchParams({
        mode: activeField === "city" ? "settlements" : activeField === "street" ? "streets" : "buildings",
        q: query.trim(),
      });
      if (activeField === "street" && city) { params.set("settlementId", city.id); params.set("settlementName", city.name ?? ""); params.set("settlementSource", city.source ?? "nominatim"); }
      if (activeField === "building" && street) { params.set("streetId", street.id); params.set("streetName", street.name ?? ""); params.set("streetSource", street.source ?? "nominatim"); params.set("settlementId", street.settlementId ?? city?.id ?? ""); params.set("settlementName", street.settlementName ?? city?.name ?? ""); }

      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/address?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Address provider unavailable");
        const data: Item[] = await response.json();
        setSuggestions(data);
        setHighlightedIndex(0);
        setHasSearched(true);
      } catch (requestError) {
        if (!(requestError instanceof DOMException && requestError.name === "AbortError")) {
          setSuggestions([]);
          setError(t["address.providerUnavailable"]);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [activeField, city, manualMode, query, retry, street, t]);

  const choose = (item: Item) => {
    if (activeField === "city") {
      setCity(item);
      setStreet(null);
      setBuilding(null);
      setStreetQuery("");
      setBuildingQuery("");
    }
    if (activeField === "street") {
      setStreet(item);
      setBuilding(null);
      setBuildingQuery("");
    }
    if (activeField === "building") setBuilding(item);
    setActiveField(null);
    setSuggestions([]);
    setHasSearched(false);
    setResult("");
    setNotice("");
  };

  const changeField = (field: Field, value: string) => {
    setActiveField(field);
    setSuggestions([]);
    setHasSearched(false);
    setError("");
    setResult("");
    setNotice("");
    if (field === "city") {
      setCity(null);
      setStreet(null);
      setBuilding(null);
      setCityQuery(value);
      setStreetQuery("");
      setBuildingQuery("");
    }
    if (field === "street") {
      setStreet(null);
      setBuilding(null);
      setStreetQuery(value);
      setBuildingQuery("");
    }
    if (field === "building") {
      setBuilding(null);
      setBuildingQuery(value);
    }
  };

  const handleKeys = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setActiveField(null);
      setSuggestions([]);
      return;
    }
    if (event.key === "ArrowDown" && suggestions.length) {
      event.preventDefault();
      setHighlightedIndex((index) => Math.min(index + 1, suggestions.length - 1));
    }
    if (event.key === "ArrowUp" && suggestions.length) {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Enter" && suggestions[highlightedIndex]) {
      event.preventDefault();
      choose(suggestions[highlightedIndex]);
    }
  };

  const showSuggestions = (field: Field) => activeField === field && suggestions.length > 0;
  const inputClass = "mt-1 w-full rounded-xl border border-slate-200 bg-white/90 p-3 text-slate-900 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100";
  const enterManualMode = () => {
    setCityQuery(city?.name ?? cityQuery); setStreetQuery(street?.name ?? streetQuery); setBuildingQuery(building?.number ?? buildingQuery);
    setCity(null); setStreet(null); setBuilding(null); setManualMode(true); setActiveField(null); setSuggestions([]); setError(""); setNotice(""); setResult("");
  };

  return <form onSubmit={async (event) => {
    event.preventDefault();
    if (manualMode) { if (!cityQuery.trim() || !streetQuery.trim() || !buildingQuery.trim()) return; setResult(`${cityQuery.trim()}, ${streetQuery.trim()}, ${buildingQuery.trim()}${apartment.trim() ? `, ${t["home.apartment"]}: ${apartment.trim()}` : ""}`); onAddressChange?.({ city: cityQuery.trim(), street: streetQuery.trim(), house: buildingQuery.trim(), apartment: apartment.trim() }); return; }
    if (!city || !street || !selectedBuilding) return;
    let verifiedBuilding = building;
    if (!verifiedBuilding) {
      setIsLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ mode: "validate", streetId: street.id, streetName: street.name ?? "", streetSource: street.source ?? "nominatim", settlementId: street.settlementId ?? city.id, settlementName: street.settlementName ?? city.name ?? "", q: selectedBuilding.number ?? "" });
        const response = await fetch(`/api/address?${params}`);
        if (!response.ok) throw new Error("Address provider unavailable");
        const validation: { valid: boolean; building?: Item } = await response.json();
        if (validation.valid && validation.building) { verifiedBuilding = validation.building; setBuilding(validation.building); }
        else setNotice(t["address.unverified"]);
      } catch {
        setNotice(t["address.unverified"]);
      } finally {
        setIsLoading(false);
      }
    }
    const finalBuilding = verifiedBuilding ?? selectedBuilding;
    if (!finalBuilding) return;
    setResult(`${city.name}, ${street.name}, ${finalBuilding.number}${apartment.trim() ? `, ${t["home.apartment"]}: ${apartment.trim()}` : ""}`);
    onAddressChange?.({ city: city.name ?? "", street: street.name ?? "", house: finalBuilding.number ?? "", apartment: apartment.trim() });
    setActiveField(null);
  }} className="grid gap-3 rounded-3xl border border-teal-100 bg-white/80 p-5 shadow-sm sm:grid-cols-2">
    <label className="relative">{t["home.city"]}
      <input value={city?.name ?? cityQuery} onFocus={() => setActiveField("city")} onChange={(event) => changeField("city", event.target.value)} onKeyDown={handleKeys} placeholder={t["address.selectCity"]} aria-autocomplete="list" aria-controls={showSuggestions("city") ? listId : undefined} className={inputClass} />
      {showSuggestions("city") ? <Options items={suggestions} highlightedIndex={highlightedIndex} listId={listId} onChoose={choose} /> : null}
    </label>
    <label className="relative">{t["home.street"]}
      <input disabled={!city && !manualMode} value={street?.name ?? streetQuery} onFocus={() => (city || manualMode) && setActiveField("street")} onChange={(event) => changeField("street", event.target.value)} onKeyDown={handleKeys} placeholder={city || manualMode ? t["address.selectStreet"] : t["address.selectCityFirst"]} aria-autocomplete="list" aria-controls={showSuggestions("street") ? listId : undefined} className={inputClass} />
      {showSuggestions("street") ? <Options items={suggestions} highlightedIndex={highlightedIndex} listId={listId} onChoose={choose} /> : null}
    </label>
    <label className="relative">{t["home.building"]}
      <input disabled={!street && !manualMode} value={building?.number ?? buildingQuery} onFocus={() => (street || manualMode) && setActiveField("building")} onChange={(event) => changeField("building", event.target.value)} onKeyDown={handleKeys} placeholder={street || manualMode ? t["address.selectBuilding"] : t["address.selectStreetFirst"]} aria-autocomplete="list" aria-controls={showSuggestions("building") ? listId : undefined} className={inputClass} />
      {showSuggestions("building") ? <Options items={suggestions} highlightedIndex={highlightedIndex} listId={listId} onChoose={choose} /> : null}
      {activeField === "building" && hasSearched && !isLoading && !suggestions.length ? <span className="mt-1 block text-xs text-slate-500">{t["address.manualBuilding"]}</span> : null}
    </label>
    <label>{t["home.apartment"]}<input value={apartment} onChange={(event) => { setApartment(event.target.value); setResult(""); }} className={inputClass} /></label>
    {isLoading ? <p className="sm:col-span-2 text-sm text-slate-600" role="status">{t["address.searching"]}</p> : null}
    {activeField !== "building" && hasSearched && !isLoading && !suggestions.length ? <p className="sm:col-span-2 text-sm text-slate-600">{t["address.noResults"]}</p> : null}
    {error ? <p className="sm:col-span-2 text-sm text-amber-800" role="alert">{error} <button type="button" onClick={() => { setError(""); setRetry((value) => value + 1); }} className="underline">{t["address.retry"]}</button> <button type="button" onClick={enterManualMode} className="ml-2 underline">{t["address.manual"]}</button></p> : null}
    {notice ? <p className="sm:col-span-2 text-sm text-amber-800" role="status">{notice}</p> : null}
    {manualMode ? <p className="sm:col-span-2 text-xs text-slate-600">{t["address.manualDescription"]} <button type="button" onClick={() => setManualMode(false)} className="underline">{t["address.useAutomatic"]}</button></p> : <p className="sm:col-span-2 text-xs text-slate-600"><button type="button" onClick={enterManualMode} className="underline">{t["address.manual"]}</button></p>}
    <button disabled={manualMode ? !cityQuery.trim() || !streetQuery.trim() || !buildingQuery.trim() : !city || !street || !selectedBuilding} className="button-primary sm:col-span-2">{t["home.checkAddress"]}</button>
    {result ? <p className="sm:col-span-2 text-sm text-slate-700" role="status"><strong>{t["address.selected"]}</strong><br />{result}<br />{t["home.statusUnknown"]}</p> : null}
  </form>;
}

function Options({ items, highlightedIndex, listId, onChoose }: { items: Item[]; highlightedIndex: number; listId: string; onChoose: (item: Item) => void }) {
  return <div id={listId} role="listbox" className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
    {items.map((item, index) => <button type="button" role="option" aria-selected={index === highlightedIndex} onMouseDown={(event) => event.preventDefault()} onClick={() => onChoose(item)} className={`block w-full px-3 py-2 text-left text-sm ${index === highlightedIndex ? "bg-teal-50" : "hover:bg-slate-50"}`} key={item.id}>{itemLabel(item)}{item.region ? ` — ${item.region}` : ""}</button>)}
  </div>;
}

export const AddressChecker = AddressSelector;

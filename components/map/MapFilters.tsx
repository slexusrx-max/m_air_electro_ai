"use client";

import type { EnergySource, PowerFilters, PowerPlantStatus } from "@/types/power";

const statuses: PowerPlantStatus[] = ["operating", "partial", "planned_outage", "unplanned_outage", "construction", "decommissioned", "unknown"];
const sources: EnergySource[] = ["nuclear", "gas", "coal", "hydro", "solar", "wind", "oil", "geothermal", "biomass", "storage", "other"];
const capacityOptions = [
  ["any", "Any capacity"],
  ["under-100", "Under 100 MW"],
  ["100-500", "100–500 MW"],
  ["500-1000", "500–1,000 MW"],
  ["over-1000", "Over 1,000 MW"],
] as const;

type ToggleKey = "statuses" | "sources" | "countries" | "regions";

export function MapFilters({ filters, onChange, visibleCount, countries, regions }: {
  filters: PowerFilters;
  onChange: (filters: PowerFilters) => void;
  visibleCount: number;
  countries: Array<{ code: string; name: string }>;
  regions: string[];
}) {
  const toggle = <T extends string>(key: ToggleKey, value: T) => {
    const current = (filters[key] ?? []) as T[];
    onChange({ ...filters, [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value] });
  };
  const tagClass = (active: boolean) => `rounded-full border px-2 py-1 text-xs capitalize ${active ? "border-teal-600 bg-teal-600 text-white" : "border-slate-200 bg-white text-slate-600"}`;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Filters</h2>
        <button type="button" onClick={() => onChange({})} className="text-xs font-semibold text-teal-700 hover:underline">Clear all</button>
      </div>
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">{statuses.map((status) => <button type="button" key={status} onClick={() => toggle("statuses", status)} aria-pressed={filters.statuses?.includes(status)} className={tagClass(Boolean(filters.statuses?.includes(status)))}>{status.replaceAll("_", " ")}</button>)}</div>
      </fieldset>
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-slate-500">Energy source</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">{sources.map((source) => <button type="button" key={source} onClick={() => toggle("sources", source)} aria-pressed={filters.sources?.includes(source)} className={tagClass(Boolean(filters.sources?.includes(source)))}>{source}</button>)}</div>
      </fieldset>
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-slate-500">Country</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">{countries.map((country) => <button type="button" key={country.code} onClick={() => toggle("countries", country.code)} aria-pressed={filters.countries?.includes(country.code)} className={tagClass(Boolean(filters.countries?.includes(country.code)))}>{country.name}</button>)}</div>
      </fieldset>
      {regions.length ? <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wider text-slate-500">Region</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">{regions.map((region) => <button type="button" key={region} onClick={() => toggle("regions", region)} aria-pressed={filters.regions?.includes(region)} className={tagClass(Boolean(filters.regions?.includes(region)))}>{region}</button>)}</div>
      </fieldset> : null}
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Capacity
        <select value={filters.capacity ?? "any"} onChange={(event) => onChange({ ...filters, capacity: event.target.value as PowerFilters["capacity"] })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-700">
          {capacityOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <p className="text-xs text-slate-600" aria-live="polite">{visibleCount} demonstration facilities visible</p>
    </section>
  );
}

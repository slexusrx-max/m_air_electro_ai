"use client";
import { useCallback, useMemo, useState } from "react";
import { MapFallback } from "@/components/map/MapFallback";
import { MapFilters } from "@/components/map/MapFilters";
import { MapLibreCanvas } from "@/components/map/MapLibreCanvas";
import { MapSearch } from "@/components/map/MapSearch";
import { PlantDetailsPanel } from "@/components/map/PlantDetailsPanel";
import { RegionDetailsPanel } from "@/components/map/RegionDetailsPanel";
import { mockRegions } from "@/data/mock-regions";
import type { PowerFilters, PowerPlant, SearchResult } from "@/types/power";

export function PowerMap({ plants }: { plants: PowerPlant[] }) {
  const [filters, setFilters] = useState<PowerFilters>({}); const [selected, setSelected] = useState<PowerPlant | null>(null); const [region, setRegion] = useState<(typeof mockRegions)[number] | null>(null); const [mapFailed, setMapFailed] = useState(false);
  const visible = useMemo(() => plants.filter((plant) => (!filters.statuses?.length || filters.statuses.includes(plant.status)) && (!filters.sources?.length || filters.sources.includes(plant.source))), [filters, plants]);
  const select = useCallback((result: SearchResult) => { if (result.type === "plant") setSelected(plants.find((plant) => plant.id === result.id) ?? null); else setRegion(mockRegions.find((item) => item.id === result.id) ?? null); }, [plants]);
  const selectPlant = useCallback((plant: PowerPlant) => setSelected(plant), []); const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL;
  return <div className="relative min-h-[calc(100vh-5rem)]"><div className="map-grid absolute inset-0 rounded-[2rem] border border-white/70"/><div className="relative grid gap-4 p-3 lg:grid-cols-[20rem_minmax(0,1fr)_24rem] lg:p-5"><div className="glass-panel order-1 rounded-3xl p-4 lg:sticky lg:top-4 lg:h-fit"><MapSearch onSelect={select}/><div className="mt-5"><MapFilters filters={filters} onChange={setFilters} visibleCount={visible.length}/></div></div>{styleUrl && !mapFailed ? <MapLibreCanvas plants={visible} onSelect={selectPlant} onError={() => setMapFailed(true)}/> : <MapFallback plants={visible} onSelect={selectPlant}/>}<div className="order-3 lg:sticky lg:top-4 lg:h-fit">{selected ? <PlantDetailsPanel plant={selected} onClose={() => setSelected(null)}/> : region ? <RegionDetailsPanel region={region} onClose={() => setRegion(null)}/> : <div className="glass-panel rounded-3xl p-5 text-sm text-slate-600"><strong className="text-slate-950">Explore a facility</strong><p className="mt-2">{mapFailed ? "The configured map style could not be loaded. The demonstration list remains available." : "Search or choose a demonstration facility to inspect available infrastructure data."}</p><button onClick={() => setRegion(mockRegions[0])} className="mt-4 text-sm font-semibold text-teal-700 hover:underline">Open Constanța summary</button></div>}</div></div></div>;
}

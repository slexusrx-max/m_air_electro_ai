"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { MapFallback } from "@/components/map/MapFallback";
import { MapFilters } from "@/components/map/MapFilters";
import { MapLibreCanvas } from "@/components/map/MapLibreCanvas";
import { MapSearch } from "@/components/map/MapSearch";
import { PlantDetailsPanel } from "@/components/map/PlantDetailsPanel";
import { RegionDetailsPanel } from "@/components/map/RegionDetailsPanel";
import { mockRegions } from "@/data/mock-regions";
import type { PowerFilters, PowerPlant, SearchResult } from "@/types/power";
const demoMapStyleUrl = "https://tiles.openfreemap.org/styles/liberty";

export function PowerMap({ plants }: { plants: PowerPlant[] }) {
  const mapRef = useRef<MapLibreMap | null>(null); const selectedPlantRef = useRef<PowerPlant | null>(null); const [filters, setFilters] = useState<PowerFilters>({}); const [selectedPlant, setSelectedPlant] = useState<PowerPlant | null>(null); const [region, setRegion] = useState<(typeof mockRegions)[number] | null>(null); const [mapFailed, setMapFailed] = useState(false);
  useEffect(() => { selectedPlantRef.current = selectedPlant; }, [selectedPlant]);
  const visible = useMemo(() => plants.filter((plant) => (!filters.statuses?.length || filters.statuses.includes(plant.status)) && (!filters.sources?.length || filters.sources.includes(plant.source))), [filters, plants]);
  const selectPlant = useCallback((plant: PowerPlant) => { setSelectedPlant(plant); setRegion(null); const map = mapRef.current; if (!map) return; if (!Number.isFinite(plant.longitude) || !Number.isFinite(plant.latitude) || plant.longitude < -180 || plant.longitude > 180 || plant.latitude < -90 || plant.latitude > 90) return; map.flyTo({ center: [plant.longitude, plant.latitude], zoom: 9, speed: 1.2, curve: 1.4, essential: true }); }, []);
  const select = useCallback((result: SearchResult) => { if (result.type === "plant") { const plant = plants.find((item) => item.id === result.id); if (plant) selectPlant(plant); } else { setSelectedPlant(null); setRegion(mockRegions.find((item) => item.id === result.id) ?? null); } }, [plants, selectPlant]);
  const handleReady = useCallback((map: MapLibreMap) => { mapRef.current = map; if (selectedPlantRef.current) selectPlant(selectedPlantRef.current); }, [selectPlant]);
  const handleError = useCallback(() => setMapFailed(true), []); const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? demoMapStyleUrl;
  return <div className="relative min-h-[calc(100vh-5rem)]"><div className="map-grid absolute inset-0 rounded-[2rem] border border-white/70"/><div className="relative grid gap-4 p-3 lg:grid-cols-[20rem_minmax(0,1fr)_24rem] lg:p-5"><div className="glass-panel order-1 rounded-3xl p-4 lg:sticky lg:top-4 lg:h-fit"><MapSearch onSelect={select}/><div className="mt-5"><MapFilters filters={filters} onChange={setFilters} visibleCount={visible.length}/></div></div>{styleUrl && !mapFailed ? <MapLibreCanvas mapRef={mapRef} plants={visible} selectedPlant={selectedPlant} onSelect={selectPlant} onReady={handleReady} onError={handleError}/> : <MapFallback plants={visible} onSelect={selectPlant}/>}<div className="order-3 lg:sticky lg:top-4 lg:h-fit">{selectedPlant ? <PlantDetailsPanel plant={selectedPlant} onClose={() => setSelectedPlant(null)}/> : region ? <RegionDetailsPanel region={region} onClose={() => setRegion(null)}/> : <div className="glass-panel rounded-3xl p-5 text-sm text-slate-600"><strong className="text-slate-950">Explore a facility</strong><p className="mt-2">{mapFailed ? "The configured map style could not be loaded. The demonstration list remains available." : "Search or choose a demonstration facility to inspect available infrastructure data."}</p></div>}</div></div></div>;
}

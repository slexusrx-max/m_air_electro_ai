"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { useSearchParams } from "next/navigation";

import { MapFallback } from "@/components/map/MapFallback";
import { MapFilters } from "@/components/map/MapFilters";
import { MapLibreCanvas } from "@/components/map/MapLibreCanvas";
import { MapSearch } from "@/components/map/MapSearch";
import { PlantDetailsPanel } from "@/components/map/PlantDetailsPanel";
import { RegionDetailsPanel } from "@/components/map/RegionDetailsPanel";
import { mockRegions } from "@/data/mock-regions";
import { normalizePowerPlants } from "@/lib/map/power-plants-to-geojson";
import type { PowerFilters, PowerPlant, SearchResult } from "@/types/power";

const demoMapStyleUrl = "https://tiles.openfreemap.org/styles/liberty";

const legend = [
  ["#7c3aed", "Nuclear"], ["#334155", "Coal"], ["#f97316", "Gas"], ["#0284c7", "Hydro"],
  ["#eab308", "Solar"], ["#06b6d4", "Wind"], ["#65a30d", "Biomass"], ["#db2777", "Storage"],
];

export function PowerMap({ plants }: { plants: PowerPlant[] }) {
  const mapRef = useRef<MapLibreMap | null>(null);
  const selectedPlantRef = useRef<PowerPlant | null>(null);
  const searchParams = useSearchParams();
  const normalized = useMemo(() => normalizePowerPlants(plants), [plants]);
  const [filters, setFilters] = useState<PowerFilters>(() => searchParams.get("country") === "UA" ? { countries: ["UA"] } : {});
  const [selectedPlant, setSelectedPlant] = useState<PowerPlant | null>(null);
  const [region, setRegion] = useState<(typeof mockRegions)[number] | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);

  const countries = useMemo(() => Array.from(new Map(normalized.plants.map((plant) => [plant.countryCode, plant.country])).entries())
    .map(([code, name]) => ({ code, name })).sort((a, b) => a.name.localeCompare(b.name)), [normalized.plants]);
  const regions = useMemo(() => Array.from(new Set(normalized.plants.flatMap((plant) => plant.region ? [plant.region] : []))).sort(), [normalized.plants]);

  useEffect(() => { selectedPlantRef.current = selectedPlant; }, [selectedPlant]);

  const visible = useMemo(() => normalized.plants.filter((plant) => (
    (!filters.statuses?.length || filters.statuses.includes(plant.status)) &&
    (!filters.sources?.length || filters.sources.includes(plant.source)) &&
    (!filters.countries?.length || filters.countries.includes(plant.countryCode)) &&
    (!filters.regions?.length || (plant.region !== undefined && filters.regions.includes(plant.region))) &&
    (!filters.confidence?.length || filters.confidence.includes(plant.confidence)) &&
    (!filters.capacity || filters.capacity === "any" ||
      (filters.capacity === "under-100" && (plant.installedCapacityMw ?? 0) < 100) ||
      (filters.capacity === "100-500" && (plant.installedCapacityMw ?? 0) >= 100 && (plant.installedCapacityMw ?? 0) <= 500) ||
      (filters.capacity === "500-1000" && (plant.installedCapacityMw ?? 0) >= 500 && (plant.installedCapacityMw ?? 0) <= 1000) ||
      (filters.capacity === "over-1000" && (plant.installedCapacityMw ?? 0) > 1000))
  )), [filters, normalized.plants]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[power-map] station diagnostics", {
        received: plants.length,
        validCoordinates: normalized.plants.length,
        excludedCoordinates: normalized.invalidCount,
        visibleAfterFilters: visible.length,
      });
    }
  }, [normalized.invalidCount, normalized.plants.length, plants.length, visible.length]);

  const selectPlant = useCallback((plant: PowerPlant) => {
    setSelectedPlant(plant);
    setRegion(null);
    mapRef.current?.flyTo({ center: [plant.longitude, plant.latitude], zoom: 8.5, speed: 1.2, essential: true });
  }, []);

  const select = useCallback((result: SearchResult) => {
    if (result.type === "plant") {
      const plant = normalized.plants.find((item) => item.id === result.id);
      if (plant) selectPlant(plant);
      return;
    }
    setSelectedPlant(null);
    setRegion(mockRegions.find((item) => item.id === result.id) ?? null);
  }, [normalized.plants, selectPlant]);

  const focusUkraine = useCallback(() => {
    const ukrainePlants = normalized.plants.filter((plant) => plant.countryCode === "UA");
    if (ukrainePlants.length) {
      mapRef.current?.fitBounds([[22.1, 44.1], [40.3, 52.5]], { padding: 48, maxZoom: 7, duration: 700 });
    }
  }, [normalized.plants]);

  const handleReady = useCallback((map: MapLibreMap) => {
    mapRef.current = map;
    const selectedId = searchParams.get("plant");
    const plantFromUrl = selectedId ? normalized.plants.find((item) => item.id === selectedId) : null;
    if (plantFromUrl) selectPlant(plantFromUrl);
    else if (selectedPlantRef.current) selectPlant(selectedPlantRef.current);
    else if (searchParams.get("country") === "UA") focusUkraine();
  }, [focusUkraine, normalized.plants, searchParams, selectPlant]);

  const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? demoMapStyleUrl;
  const retry = useCallback(() => setMapError(null), []);

  return (
    <section className="relative min-h-[calc(100vh-5rem)]" aria-label="Power infrastructure map">
      <div className="map-grid absolute inset-0 rounded-[2rem] border border-white/70" />
      <div className="relative grid min-w-0 gap-4 p-3 lg:grid-cols-[minmax(17.5rem,20rem)_minmax(0,1fr)_minmax(17.5rem,21rem)] lg:p-5">
        <aside className={`info-card order-1 min-w-0 rounded-3xl p-4 lg:sticky lg:top-4 lg:h-fit ${isFilterPanelOpen ? "" : "hidden lg:block"}`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-900">Map controls</h2>
            <button type="button" onClick={() => setIsFilterPanelOpen(false)} className="text-xs font-semibold text-teal-700 lg:inline">Hide</button>
          </div>
          <MapSearch onSelect={select} />
          <div className="mt-5"><MapFilters filters={filters} onChange={setFilters} visibleCount={visible.length} countries={countries} regions={regions} /></div>
          <div className="mt-5 border-t border-teal-950/10 pt-4">
            <button type="button" onClick={focusUkraine} className="button-outline w-full">Focus Ukraine</button>
          </div>
        </aside>

        <div className="order-2 min-w-0">
          {!isFilterPanelOpen ? <button type="button" onClick={() => setIsFilterPanelOpen(true)} className="button-outline mb-3">Show filters</button> : null}
          {mapError ? (
            <div className="info-card flex min-h-[460px] flex-col items-center justify-center text-center">
              <h2>Unable to load station data.</h2>
              <p>{mapError}</p>
              <button type="button" onClick={retry} className="button-primary mt-5">Retry</button>
            </div>
          ) : styleUrl ? (
            <MapLibreCanvas mapRef={mapRef} plants={visible} selectedPlant={selectedPlant} onSelect={selectPlant} onReady={handleReady} onError={setMapError} />
          ) : <MapFallback plants={visible} onSelect={selectPlant} />}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 rounded-2xl bg-white/70 px-4 py-3 text-xs text-slate-700" aria-label="Energy source legend">
            {legend.map(([color, label]) => <span key={label} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full ring-1 ring-white" style={{ backgroundColor: color }} />{label}</span>)}
            <span className="ml-auto text-slate-500">Border: station status</span>
          </div>
          {normalized.invalidCount ? <p className="mt-3 text-sm text-amber-800">{normalized.invalidCount} station record(s) were not mapped because their coordinates are invalid.</p> : null}
          {!visible.length ? <p className="mt-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">No stations match the selected filters.</p> : null}
        </div>

        <aside className="order-3 min-w-0 lg:sticky lg:top-4 lg:h-fit">
          {selectedPlant ? <PlantDetailsPanel plant={selectedPlant} onClose={() => setSelectedPlant(null)} /> : region ? <RegionDetailsPanel region={region} onClose={() => setRegion(null)} /> : (
            <div className="info-card rounded-3xl p-5 text-sm text-slate-600"><strong className="text-slate-950">Explore a facility</strong><p className="mt-2">Select a visible marker or search for a station, city, region, or country.</p></div>
          )}
        </aside>
      </div>
    </section>
  );
}

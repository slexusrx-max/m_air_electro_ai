"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";

import { powerPlantsToGeoJson } from "@/lib/map/power-plants-to-geojson";
import type { PowerPlant } from "@/types/power";

const sourceId = "power-plants";
const selectedSourceId = "selected-plant";
const demoMapStyleUrl = "https://tiles.openfreemap.org/styles/liberty";

const sourceColors = [
  "match", ["get", "source"],
  "nuclear", "#7c3aed",
  "coal", "#334155",
  "gas", "#f97316",
  "hydro", "#0284c7",
  "solar", "#eab308",
  "wind", "#06b6d4",
  "biomass", "#65a30d",
  "storage", "#db2777",
  "#0f766e",
];

const statusColors = [
  "match", ["get", "status"],
  "operating", "#166534",
  "construction", "#d97706",
  "planned_outage", "#d97706",
  "unplanned_outage", "#dc2626",
  "decommissioned", "#64748b",
  "#475569",
];

function emptyCollection() {
  return { type: "FeatureCollection" as const, features: [] };
}

function boundsFor(plants: PowerPlant[]) {
  if (!plants.length) return null;
  let west = plants[0].longitude;
  let east = plants[0].longitude;
  let south = plants[0].latitude;
  let north = plants[0].latitude;
  for (const plant of plants.slice(1)) {
    west = Math.min(west, plant.longitude);
    east = Math.max(east, plant.longitude);
    south = Math.min(south, plant.latitude);
    north = Math.max(north, plant.latitude);
  }
  if (west === east) { west -= 0.18; east += 0.18; }
  if (south === north) { south -= 0.12; north += 0.12; }
  return [[west, south], [east, north]] as [[number, number], [number, number]];
}

export function MapLibreCanvas({ mapRef, plants, selectedPlant, onSelect, onReady, onError }: {
  mapRef: MutableRefObject<MapLibreMap | null>;
  plants: PowerPlant[];
  selectedPlant: PowerPlant | null;
  onSelect: (plant: PowerPlant) => void;
  onReady: (map: MapLibreMap) => void;
  onError: (message: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const plantsRef = useRef(plants);
  const fittedSignatureRef = useRef("");

  useEffect(() => { plantsRef.current = plants; }, [plants]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let map: MapLibreMap | null = null;
    let disposed = false;

    void import("maplibre-gl").then((maplibregl) => {
      if (!containerRef.current || disposed) return;
      const instance = new maplibregl.Map({
        container: containerRef.current,
        style: process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? demoMapStyleUrl,
        center: [20, 30],
        zoom: 1.4,
      });
      map = instance;
      mapRef.current = instance;
      instance.addControl(new maplibregl.NavigationControl(), "bottom-right");
      instance.addControl(new maplibregl.ScaleControl(), "bottom-left");
      instance.on("error", (event) => {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[power-map] MapLibre resource error", event.error?.message ?? event);
        }
      });
      instance.once("load", () => {
        const geoJson = powerPlantsToGeoJson(plantsRef.current);
        instance.addSource(sourceId, { type: "geojson", data: geoJson, cluster: true, clusterRadius: 54, clusterMaxZoom: 9 });
        instance.addLayer({ id: "clusters", type: "circle", source: sourceId, filter: ["has", "point_count"], paint: { "circle-color": "#0f766e", "circle-radius": ["step", ["get", "point_count"], 20, 10, 26, 30, 32], "circle-stroke-color": "#ecfeff", "circle-stroke-width": 3 } });
        instance.addLayer({ id: "cluster-count", type: "symbol", source: sourceId, filter: ["has", "point_count"], layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 13, "text-font": ["Open Sans Bold"] }, paint: { "text-color": "#ffffff" } });
        instance.addLayer({ id: "plants", type: "circle", source: sourceId, filter: ["!", ["has", "point_count"]], paint: { "circle-color": sourceColors as never, "circle-radius": ["interpolate", ["linear"], ["coalesce", ["get", "capacity"], 0], 0, 8, 1000, 11, 10000, 15], "circle-stroke-color": statusColors as never, "circle-stroke-width": 3, "circle-opacity": 1 } });
        instance.addLayer({ id: "plant-symbols", type: "symbol", source: sourceId, filter: ["!", ["has", "point_count"]], layout: { "text-field": "⚡", "text-size": 11, "text-allow-overlap": true }, paint: { "text-color": "#ffffff" } });
        instance.addSource(selectedSourceId, { type: "geojson", data: emptyCollection() });
        instance.addLayer({ id: "selected-plant", type: "circle", source: selectedSourceId, paint: { "circle-color": "#ffffff", "circle-radius": 18, "circle-stroke-color": "#0f766e", "circle-stroke-width": 4 } });
        instance.addLayer({ id: "selected-plant-label", type: "symbol", source: selectedSourceId, layout: { "text-field": ["get", "name"], "text-offset": [0, 2.1], "text-size": 13, "text-max-width": 16 }, paint: { "text-color": "#092b35", "text-halo-color": "#ffffff", "text-halo-width": 2 } });
        const initialBounds = boundsFor(plantsRef.current);
        if (initialBounds) {
          fittedSignatureRef.current = plantsRef.current.map((plant) => plant.id).sort().join(",");
          instance.fitBounds(initialBounds, { padding: 64, maxZoom: plantsRef.current.length === 1 ? 9 : 4.5, duration: 0 });
        }
        instance.on("click", "plants", (event) => {
          const id = event.features?.[0]?.properties?.id;
          const plant = plantsRef.current.find((item) => item.id === id);
          if (plant) onSelect(plant);
        });
        instance.on("click", "clusters", (event) => {
          const feature = event.features?.[0];
          const clusterId = feature?.properties?.cluster_id;
          const coordinates = feature?.geometry.type === "Point" ? feature.geometry.coordinates as [number, number] : null;
          const source = instance.getSource(sourceId) as import("maplibre-gl").GeoJSONSource | undefined;
          if (typeof clusterId === "number" && coordinates && source) {
            void source.getClusterExpansionZoom(clusterId).then((zoom) => instance.easeTo({ center: coordinates, zoom }));
          }
        });
        instance.on("mouseenter", "plants", () => { instance.getCanvas().style.cursor = "pointer"; });
        instance.on("mouseleave", "plants", () => { instance.getCanvas().style.cursor = ""; });
        onReady(instance);
      });
    }).catch((error: unknown) => onError(error instanceof Error ? error.message : "Unable to initialize the map."));

    return () => { disposed = true; map?.remove(); mapRef.current = null; };
  }, [mapRef, onError, onReady, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    const source = map?.getSource(sourceId) as import("maplibre-gl").GeoJSONSource | undefined;
    if (!map || !source) return;
    source.setData(powerPlantsToGeoJson(plants));
    const signature = plants.map((plant) => plant.id).sort().join(",");
    const bounds = boundsFor(plants);
    if (bounds && fittedSignatureRef.current !== signature) {
      fittedSignatureRef.current = signature;
      map.fitBounds(bounds, { padding: 64, maxZoom: plants.length === 1 ? 9 : 4.5, duration: 700 });
    }
  }, [mapRef, plants]);

  useEffect(() => {
    const source = mapRef.current?.getSource(selectedSourceId) as import("maplibre-gl").GeoJSONSource | undefined;
    if (source) source.setData(selectedPlant ? powerPlantsToGeoJson([selectedPlant]) : emptyCollection());
  }, [mapRef, selectedPlant]);

  return <div ref={containerRef} className="h-[min(70vh,700px)] min-h-[460px] min-w-0 overflow-hidden rounded-[1.75rem] border border-white/80 shadow-[0_18px_45px_rgba(10,66,75,0.14)]" aria-label="Interactive world power infrastructure map" />;
}

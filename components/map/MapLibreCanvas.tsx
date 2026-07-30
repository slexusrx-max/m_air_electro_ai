"use client";

import { useEffect, useRef } from "react";
import { powerPlantsToGeoJson } from "@/lib/map/power-plants-to-geojson";
import type { PowerPlant } from "@/types/power";

const sourceId = "power-plants";
const demoMapStyleUrl = "https://tiles.openfreemap.org/styles/liberty";

export function MapLibreCanvas({ plants, onSelect, onError }: { plants: PowerPlant[]; onSelect: (plant: PowerPlant) => void; onError: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const plantsRef = useRef(plants);
  useEffect(() => { plantsRef.current = plants; }, [plants]);

  useEffect(() => {
    const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? demoMapStyleUrl;
    if (!styleUrl || !containerRef.current || mapRef.current) return;
    let cancelled = false;
    let map: import("maplibre-gl").Map | null = null;

    void import("maplibre-gl").then((maplibregl) => {
      if (cancelled || !containerRef.current) return;
      const instance = new maplibregl.Map({ container: containerRef.current, style: styleUrl, center: [16, 30], zoom: 1.35 });
      map = instance;
      mapRef.current = instance;
      instance.addControl(new maplibregl.NavigationControl(), "bottom-right");
      instance.addControl(new maplibregl.ScaleControl(), "bottom-left");
      instance.on("error", onError);
      instance.on("load", () => {
        instance.addSource(sourceId, { type: "geojson", data: powerPlantsToGeoJson(plantsRef.current), cluster: true, clusterRadius: 48 });
        instance.addLayer({ id: "clusters", type: "circle", source: sourceId, filter: ["has", "point_count"], paint: { "circle-color": "#16b8b1", "circle-radius": ["step", ["get", "point_count"], 18, 10, 24, 30, 30], "circle-stroke-color": "#ffffff", "circle-stroke-width": 2 } });
        instance.addLayer({ id: "cluster-count", type: "symbol", source: sourceId, filter: ["has", "point_count"], layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 }, paint: { "text-color": "#ffffff" } });
        instance.addLayer({ id: "plants", type: "circle", source: sourceId, filter: ["!", ["has", "point_count"]], paint: { "circle-color": ["match", ["get", "status"], "operating", "#2da87b", "partial", "#e3a42d", "unplanned_outage", "#dc5a64", "construction", "#368fd8", "#718096"], "circle-radius": ["interpolate", ["linear"], ["get", "capacity"], 0, 6, 1000, 10, 10000, 15], "circle-stroke-color": "#ffffff", "circle-stroke-width": 2 } });
        instance.on("click", "plants", (event) => { const id = event.features?.[0]?.properties?.id; const plant = plantsRef.current.find((item) => item.id === id); if (plant) { onSelect(plant); instance.flyTo({ center: [plant.longitude, plant.latitude], zoom: Math.max(instance.getZoom(), 5), essential: true }); } });
        instance.on("click", "clusters", (event) => { const feature = event.features?.[0]; const clusterId = feature?.properties?.cluster_id; const coordinates = feature?.geometry.type === "Point" ? feature.geometry.coordinates as [number, number] : null; const source = instance.getSource(sourceId) as import("maplibre-gl").GeoJSONSource | undefined; if (typeof clusterId === "number" && coordinates && source) source.getClusterExpansionZoom(clusterId).then((zoom) => instance.easeTo({ center: coordinates, zoom })); });
        instance.on("mouseenter", "plants", () => { instance.getCanvas().style.cursor = "pointer"; });
        instance.on("mouseleave", "plants", () => { instance.getCanvas().style.cursor = ""; });
      });
    }).catch(onError);
    return () => { cancelled = true; map?.remove(); mapRef.current = null; };
  }, [onError, onSelect]);

  useEffect(() => { const source = mapRef.current?.getSource(sourceId) as import("maplibre-gl").GeoJSONSource | undefined; source?.setData(powerPlantsToGeoJson(plants)); mapRef.current?.resize(); }, [plants]);
  return <div ref={containerRef} className="h-[min(70vh,700px)] min-h-[420px] overflow-hidden rounded-[1.75rem] border border-white/80 shadow-[0_18px_45px_rgba(10,66,75,0.14)]" aria-label="Interactive world power infrastructure map" />;
}

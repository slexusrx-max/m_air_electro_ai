import type { PowerPlant } from "@/types/power";
export type PowerPlantFeatureCollection = { type: "FeatureCollection"; features: Array<{ type: "Feature"; id: string; geometry: { type: "Point"; coordinates: [number, number] }; properties: Record<string, string | number | boolean | null> }> };

export type NormalizedPowerPlants = {
  invalidCount: number;
  plants: PowerPlant[];
};

/** Safely discards malformed runtime records before they reach MapLibre. */
export function normalizePowerPlants(plants: PowerPlant[]): NormalizedPowerPlants {
  const valid: PowerPlant[] = [];
  let invalidCount = 0;

  for (const plant of plants) {
    const latitude = Number(plant.latitude);
    const longitude = Number(plant.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      invalidCount += 1;
      continue;
    }
    valid.push({ ...plant, latitude, longitude });
  }

  return { plants: valid, invalidCount };
}

export function powerPlantsToGeoJson(plants: PowerPlant[]): PowerPlantFeatureCollection {
  return {
    type: "FeatureCollection",
    features: normalizePowerPlants(plants).plants.map((plant) => ({
      type: "Feature",
      id: plant.id,
      geometry: { type: "Point", coordinates: [plant.longitude, plant.latitude] },
      properties: {
        id: plant.id,
        name: plant.name,
        source: plant.source,
        status: plant.status,
        capacity: plant.installedCapacityMw ?? 0,
        demo: Boolean(plant.isDemo),
      },
    })),
  };
}

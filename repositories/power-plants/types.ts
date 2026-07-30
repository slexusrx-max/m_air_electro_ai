import type { PowerFilters, PowerPlant, SearchResult } from "@/types/power";
export interface PowerPlantsRepository { getPowerPlants(filters?: PowerFilters): Promise<PowerPlant[]>; getPowerPlantById(id: string): Promise<PowerPlant | null>; search(query: string): Promise<SearchResult[]> }

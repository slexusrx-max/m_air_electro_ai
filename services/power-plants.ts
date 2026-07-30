import { mockPowerPlantsRepository } from "@/repositories/power-plants/mock";
import type { PowerFilters } from "@/types/power";
export const getPowerPlants = (filters?: PowerFilters) => mockPowerPlantsRepository.getPowerPlants(filters);
export const getPowerPlantById = (id: string) => mockPowerPlantsRepository.getPowerPlantById(id);
export const searchPowerInfrastructure = (query: string) => mockPowerPlantsRepository.search(query);

export type PowerPlantStatus = "operating" | "partial" | "planned_outage" | "unplanned_outage" | "construction" | "decommissioned" | "unknown";
export type EnergySource = "nuclear" | "gas" | "coal" | "hydro" | "solar" | "wind" | "oil" | "geothermal" | "biomass" | "storage" | "other";
export type DataConfidence = "high" | "medium" | "low";
export type GridStatus = "normal" | "strained" | "shortage" | "rolling_blackouts" | "major_outage" | "unknown";
export interface DataSourceReference { id: string; name: string; url?: string; retrievedAt?: string; isOfficial?: boolean }
export interface PowerPlant { id: string; name: string; country: string; countryCode: string; region?: string; city?: string; latitude: number; longitude: number; source: EnergySource; primaryFuel?: string; status: PowerPlantStatus; installedCapacityMw?: number; currentGenerationMw?: number | null; units?: number; operator?: string; commissioningYear?: number; lastUpdatedAt?: string; confidence: DataConfidence; isDemo?: boolean; dataSources: DataSourceReference[] }
export interface GenerationMixItem { source: EnergySource; percentage?: number; capacityMw?: number }
export interface RegionPowerSummary { id: string; name: string; type: "city" | "region" | "country"; countryCode: string; stabilityScore?: number | null; gridStatus: GridStatus; installedCapacityMw?: number; activePlants?: number; plantsOnOutage?: number; renewableShare?: number; generationMix: GenerationMixItem[]; confidence: DataConfidence; lastUpdatedAt?: string; isDemo?: boolean }
export interface PowerFilters { statuses?: PowerPlantStatus[]; sources?: EnergySource[]; capacity?: "any" | "under-100" | "100-500" | "500-1000" | "over-1000"; confidence?: DataConfidence[] }
export interface SearchResult { type: "plant" | "region"; id: string; label: string; detail: string }
export interface SavedLocation { id: string; locationId: string; type: "plant" | "region"; createdAt: string }
export interface PowerAlert { id: string; locationId: string; type: string; threshold?: number; createdAt: string }

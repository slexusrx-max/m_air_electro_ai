export type DataQualityStatus = "live" | "recent" | "delayed" | "historical" | "unavailable" | "demo";
export type GenerationStatus = "operating" | "damaged" | "destroyed" | "occupied" | "maintenance" | "offline" | "heat_only" | "unverified" | "decommissioned";

export interface DataSourceMetadata { sourceName: string; sourceUrl: string; fetchedAt?: string; publishedAt?: string; validFrom?: string; validTo?: string; status: DataQualityStatus; confidence: "high" | "medium" | "low"; isOfficial: boolean; isHistorical: boolean; error?: string }
export interface GenerationFacility { id: string; name: string; oblast: string; technology: string; installedMw?: number; availableMw?: number; status: GenerationStatus; source: DataSourceMetadata }
export interface CapacityAssessment { date: string; operatingMw?: number; damagedMw?: number; offlineMw?: number; source: DataSourceMetadata; method: string; verification: "verified" | "estimated" | "unconfirmed" }
export interface CrossBorderFlow { timestamp: string; counterparty: "Hungary" | "Slovakia" | "Poland" | "Romania" | "Moldova"; valueMw?: number; kind: "commercial" | "physical"; source: DataSourceMetadata }
export interface GasStoragePoint { date: string; volumeMcm?: number; fillPercent?: number; direction?: "injection" | "withdrawal"; source: DataSourceMetadata }
export interface MarketPricePoint { timestamp: string; uahPerMwh?: number; eurPerMwh?: number; source: DataSourceMetadata }
export interface OutageEvent { id: string; country: "UA"; oblast: string; locality?: string; street?: string; building?: string; operator: string; type: "planned" | "hourly" | "emergency" | "actual"; status: "scheduled" | "active" | "cancelled" | "completed" | "unknown"; startAt?: string; endAt?: string; queue?: string; subqueue?: string; source: DataSourceMetadata }
export interface OutageSchedule { operator: string; oblast: string; locality?: string; queue?: string; subqueue?: string; windows: Array<{ startAt: string; endAt: string }>; source: DataSourceMetadata }
export interface OutageRegionSummary { oblast: string; plannedHours?: number; actualHours?: number; emergencyHours?: number; coverage?: string; source: DataSourceMetadata }
export interface UkraineEnergySnapshot { generatedAt: string; sourceStatus: DataQualityStatus; sources: DataSourceMetadata[]; flows: CrossBorderFlow[]; capacity: CapacityAssessment[]; gas: GasStoragePoint[]; prices: MarketPricePoint[]; outages: OutageRegionSummary[]; schedules: OutageSchedule[] }

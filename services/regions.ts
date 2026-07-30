import { mockRegions } from "@/data/mock-regions";
export async function getRegionPowerSummary(id: string) { return mockRegions.find((region) => region.id === id) ?? null; }
export function getStabilityLabel(score?: number | null) { if (score == null) return "Not enough data"; if (score >= 85) return "Very stable"; if (score >= 70) return "Stable"; if (score >= 50) return "Moderate"; if (score >= 30) return "At risk"; return "Critical"; }

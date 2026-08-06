import type { DataSourceMetadata } from "@/types/ukraine-energy";

export const ukraineEnergyAdapterCatalog: DataSourceMetadata[] = [
  { sourceName: "Energy Charts", sourceUrl: "https://energy-charts.info/", status: "unavailable", confidence: "high", isOfficial: false, isHistorical: false, error: "Adapter awaiting permitted integration." },
  { sourceName: "ENTSO-E Transparency Platform", sourceUrl: "https://transparency.entsoe.eu/", status: "unavailable", confidence: "high", isOfficial: true, isHistorical: false, error: "Adapter awaiting permitted integration." },
  { sourceName: "Ukrenergo", sourceUrl: "https://ua.energy/", status: "unavailable", confidence: "high", isOfficial: true, isHistorical: false, error: "Adapter awaiting a public, permitted feed." },
  { sourceName: "Market Operator OREE", sourceUrl: "https://www.oree.com.ua/", status: "unavailable", confidence: "high", isOfficial: true, isHistorical: false, error: "Adapter awaiting permitted integration." },
  { sourceName: "AGSI", sourceUrl: "https://agsi.gie.eu/", status: "unavailable", confidence: "high", isOfficial: false, isHistorical: false, error: "Adapter awaiting permitted integration." },
];

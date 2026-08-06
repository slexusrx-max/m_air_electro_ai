import type { DataSourceMetadata, UkraineEnergySnapshot } from "@/types/ukraine-energy";

const source = (sourceName: string, sourceUrl: string): DataSourceMetadata => ({ sourceName, sourceUrl, status: "demo", confidence: "low", isOfficial: false, isHistorical: false });
const reference = source("MR Electro AI local demo fixture", "/methodology");

export const ukraineEnergyDemo: UkraineEnergySnapshot = {
  generatedAt: "2026-08-06T09:00:00+03:00", sourceStatus: "demo", sources: [reference, source("ENTSO-E Transparency Platform", "https://transparency.entsoe.eu/"), source("AGSI", "https://agsi.gie.eu/"), source("Market Operator OREE", "https://www.oree.com.ua/")],
  flows: [
    { timestamp: "2026-08-06T06:00:00+03:00", counterparty: "Hungary", kind: "commercial", source: reference },
    { timestamp: "2026-08-06T06:00:00+03:00", counterparty: "Slovakia", kind: "commercial", source: reference },
    { timestamp: "2026-08-06T06:00:00+03:00", counterparty: "Poland", kind: "commercial", source: reference },
    { timestamp: "2026-08-06T06:00:00+03:00", counterparty: "Romania", kind: "commercial", source: reference },
    { timestamp: "2026-08-06T06:00:00+03:00", counterparty: "Moldova", kind: "commercial", source: reference },
  ],
  capacity: [{ date: "2026-08-06", source: reference, method: "No verified feed connected", verification: "unconfirmed" }],
  gas: [{ date: "2026-08-06", source: reference }], prices: [{ timestamp: "2026-08-06T00:00:00+03:00", source: reference }],
  outages: ["Kyiv", "Lviv", "Odesa", "Dnipro", "Kharkiv", "Vinnytsia"].map((oblast) => ({ oblast, coverage: "No current DSO feed connected", source: reference })),
  schedules: [],
};

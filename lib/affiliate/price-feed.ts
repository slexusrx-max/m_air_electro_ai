import "server-only";

import { gunzipSync } from "node:zlib";
import { catalog } from "./catalog";
import {
  pricesFromSnapshots,
  pricesBySkuFromSnapshots,
  type PriceFeedProvider,
  type PublicSupplierPrice,
  type SupplierPriceSnapshot,
} from "./pricing";

type CacheEntry = { expiresAt: number; snapshot: SupplierPriceSnapshot };
const runtimeCache = new Map<PriceFeedProvider, CacheEntry>();
const inFlight = new Map<PriceFeedProvider, Promise<SupplierPriceSnapshot | null>>();
const CACHE_MS = 60 * 60 * 1000;
const feedConfiguration: Array<{
  provider: PriceFeedProvider;
  catalogId: string;
  environmentVariable: string;
}> = [
  { provider: "renogy", catalogId: "28907", environmentVariable: "RENOGY_IMPACT_PRODUCT_FEED_URL" },
  { provider: "waterdrop-eu", catalogId: "18289", environmentVariable: "WATERDROP_IMPACT_PRODUCT_FEED_URL" },
];

function parseTsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (char === '"') {
      if (quoted && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else quoted = !quoted;
    } else if (char === "\t" && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && input[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else field += char;
  }
  if (field || row.length) {
    row.push(field);
    if (row.some(Boolean)) rows.push(row);
  }
  return rows;
}

function parseOfficialFeed(
  bytes: Uint8Array,
  provider: PriceFeedProvider,
  catalogId: string,
  retrievedAt: string,
): SupplierPriceSnapshot | null {
  const decoded = bytes[0] === 0x1f && bytes[1] === 0x8b
    ? gunzipSync(bytes).toString("utf8")
    : Buffer.from(bytes).toString("utf8");
  const rows = parseTsv(decoded.replace(/^\uFEFF/, ""));
  const headers = rows.shift();
  if (!headers) return null;
  const skuIndex = headers.indexOf("Unique Merchant SKU");
  const priceIndex = headers.indexOf("Current Price");
  const currencyIndex = headers.indexOf("Currency");
  if ([skuIndex, priceIndex, currencyIndex].some(index => index < 0)) return null;

  const records = rows.flatMap((row) => {
    const merchantSku = row[skuIndex]?.trim();
    const rawAmount = row[priceIndex]?.trim();
    const currency = row[currencyIndex]?.trim();
    if (!/^\d+$/.test(merchantSku ?? "") || !/^\d+(?:\.\d{1,2})?$/.test(rawAmount ?? "")) return [];
    return [{ merchantSku, amount: Number(rawAmount), currency }];
  });
  return records.length ? { provider, catalogId, retrievedAt, records } : null;
}

function inlineSnapshots(): SupplierPriceSnapshot[] {
  const raw = process.env.SUPPLIER_PRICE_SNAPSHOTS_JSON;
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as SupplierPriceSnapshot[] : [];
  } catch {
    return [];
  }
}

async function downloadSnapshot(config: typeof feedConfiguration[number]): Promise<SupplierPriceSnapshot | null> {
  const now = Date.now();
  const cached = runtimeCache.get(config.provider);
  if (cached && cached.expiresAt > now) return cached.snapshot;
  const feedUrl = process.env[config.environmentVariable];
  if (!feedUrl) return null;
  try {
    const parsedUrl = new URL(feedUrl);
    if (parsedUrl.protocol !== "https:") return null;
    const response = await fetch(parsedUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
      headers: { Accept: "application/gzip, text/tab-separated-values, text/plain" },
    });
    if (!response.ok) return null;
    const snapshot = parseOfficialFeed(
      new Uint8Array(await response.arrayBuffer()),
      config.provider,
      config.catalogId,
      new Date().toISOString(),
    );
    if (snapshot) runtimeCache.set(config.provider, { snapshot, expiresAt: now + CACHE_MS });
    return snapshot;
  } catch {
    return null;
  }
}

async function fetchSnapshot(config: typeof feedConfiguration[number]): Promise<SupplierPriceSnapshot | null> {
  const cached = runtimeCache.get(config.provider);
  if (cached && cached.expiresAt > Date.now()) return cached.snapshot;
  const pending = inFlight.get(config.provider);
  if (pending) return pending;
  const request = downloadSnapshot(config).finally(() => inFlight.delete(config.provider));
  inFlight.set(config.provider, request);
  return request;
}

async function freshSnapshots(): Promise<SupplierPriceSnapshot[]> {
  const remote = await Promise.all(feedConfiguration.map(fetchSnapshot));
  return [...inlineSnapshots(), ...remote.filter((item): item is SupplierPriceSnapshot => Boolean(item))];
}

export async function getPublicSupplierPrices(): Promise<Record<string, PublicSupplierPrice>> {
  return pricesFromSnapshots(catalog, await freshSnapshots());
}

export async function getPublicRenogyFeedPrices(): Promise<Record<string, PublicSupplierPrice>> {
  return pricesBySkuFromSnapshots(await freshSnapshots(), "renogy");
}


import "server-only";

import type { AddressBuilding, AddressProvider, AddressSettlement, AddressStreet, AddressValidation } from "./types";
import { AddressProviderError } from "./ukrposhta";

type NominatimPlace = { place_id: number; osm_type?: string; osm_id?: number; address?: Record<string, string>; display_name?: string };

export class NominatimAddressProvider implements AddressProvider {
  private async search(params: Record<string, string>) {
    const query = new URLSearchParams({ format: "jsonv2", addressdetails: "1", countrycodes: "ua", limit: "10", "accept-language": "uk", ...params });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`, { cache: "no-store", signal: controller.signal, headers: { Accept: "application/json", "User-Agent": "Electro-AI address lookup (+https://m-air-electro-ai.vercel.app)" } });
      if (!response.ok) throw new AddressProviderError(response.status === 401 || response.status === 403 ? "upstream_rejected" : "upstream_unavailable", "Address fallback request failed", response.status);
      const data: unknown = await response.json().catch(() => null);
      if (!Array.isArray(data)) throw new AddressProviderError("invalid_response", "Address fallback returned an invalid response");
      return data as NominatimPlace[];
    } catch (error) {
      if (error instanceof AddressProviderError) throw error;
      throw new AddressProviderError("upstream_unavailable", "Address fallback is unavailable");
    } finally { clearTimeout(timeout); }
  }

  async searchSettlements(query: string): Promise<AddressSettlement[]> {
    const places = await this.search({ q: `${query}, Україна`, featureType: "city" });
    const results: AddressSettlement[] = [];
    for (const place of places) { const address = place.address ?? {}; const name = address.city ?? address.town ?? address.village ?? address.municipality; if (name) results.push({ id: `nominatim:${place.place_id}`, name, region: address.state, source: "nominatim" }); }
    return unique(results, (place) => place.id);
  }

  async getStreets(settlement: AddressSettlement, query: string): Promise<AddressStreet[]> {
    const places = await this.search({ street: query, city: settlement.name, country: "Україна" });
    const results: AddressStreet[] = [];
    for (const place of places) { const name = place.address?.road; if (name && matchesStreetQuery(name, query)) results.push({ id: `nominatim:${place.place_id}`, name, settlementId: settlement.id, settlementName: settlement.name, source: "nominatim" }); }
    if (results.length) return unique(results, (place) => place.name.toLocaleLowerCase("uk-UA"));

    // Nominatim may resolve a former street name to a current street through a
    // real address record. Keep this separate from exact matching and only
    // accept results whose returned city is the selected city.
    const aliases = await this.search({ q: `${query}, ${settlement.name}, Україна` });
    for (const place of aliases) {
      const name = place.address?.road;
      const city = place.address?.city ?? place.address?.town ?? place.address?.village;
      if (name && city && normal(city) === normal(settlement.name)) results.push({ id: `nominatim:${place.place_id}`, name, settlementId: settlement.id, settlementName: settlement.name, source: "nominatim", matchedBy: "alternate_name" });
    }
    return unique(results, (place) => place.name.toLocaleLowerCase("uk-UA"));
  }

  async getBuildings(street: AddressStreet, query: string): Promise<AddressBuilding[]> {
    const places = await this.search({ q: `${query} ${street.name}, ${street.settlementName}, Україна` });
    const results: AddressBuilding[] = [];
    for (const place of places) { const number = place.address?.house_number; if (number && normal(number).startsWith(normal(query))) results.push({ id: `nominatim:${place.place_id}`, number, streetId: street.id, postalCode: place.address?.postcode, source: "nominatim" }); }
    return unique(results, (place) => place.number.toLocaleLowerCase("uk-UA"));
  }

  async validateAddress(street: AddressStreet, buildingNumber: string): Promise<AddressValidation> {
    const normalized = buildingNumber.trim().toLocaleLowerCase("uk-UA");
    const building = (await this.getBuildings(street, buildingNumber)).find((candidate) => candidate.number.trim().toLocaleLowerCase("uk-UA") === normalized);
    return building ? { valid: true, building } : { valid: false };
  }
}

function unique<T>(items: T[], key: (item: T) => string) { return [...new Map(items.map((item) => [key(item), item])).values()]; }

function normal(value: string) { return value.toLocaleLowerCase("uk-UA").replace(/и/g, "і").replace(/[^\p{L}\p{N}]+/gu, " ").trim(); }
function matchesStreetQuery(name: string, query: string) {
  const streetName = normal(name).replace(/^(вулиця|вул|проспект|просп|провулок|пров|бульвар|бул)\s+/, "");
  const requested = normal(query).replace(/^(вулиця|вул|проспект|просп|провулок|пров|бульвар|бул)\s+/, "");
  return requested.length > 0 && streetName.includes(requested);
}

import "server-only";
import type { AddressBuilding, AddressProvider, AddressSettlement, AddressStreet, AddressValidation } from "./types";

export class AddressProviderError extends Error {
  constructor(public readonly code: "not_configured" | "upstream_rejected" | "upstream_unavailable" | "invalid_response", message: string, public readonly status?: number) { super(message); }
}

export class UkrposhtaAddressProvider implements AddressProvider {
  private token = process.env.UKRPOSHTA_ADDRESS_API_TOKEN?.trim();

  private async get(path: string) {
    if (!this.token) throw new AddressProviderError("not_configured", "Ukrposhta address API token is not configured");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    try {
      const response = await fetch(`https://www.ukrposhta.ua/address-classifier-ws/${path}`, { headers: { Authorization: `Bearer ${this.token}`, Accept: "application/json" }, cache: "no-store", signal: controller.signal });
      if (!response.ok) {
        console.error("Ukrposhta address request failed", { status: response.status, path: path.split("?")[0] });
        throw new AddressProviderError(response.status === 401 || response.status === 403 ? "upstream_rejected" : "upstream_unavailable", "Ukrposhta address API request failed", response.status);
      }
      const data: unknown = await response.json().catch(() => null);
      if (!data || typeof data !== "object") throw new AddressProviderError("invalid_response", "Ukrposhta returned an invalid response");
      return data as { Entries?: { Entry?: Record<string, string>[] } };
    } catch (error) {
      if (error instanceof AddressProviderError) throw error;
      console.error("Ukrposhta address request failed", { reason: error instanceof Error ? error.name : "unknown", path: path.split("?")[0] });
      throw new AddressProviderError("upstream_unavailable", "Ukrposhta address API is unavailable");
    } finally { clearTimeout(timeout); }
  }

  async searchSettlements(query: string): Promise<AddressSettlement[]> { const data = await this.get(`get_city_by_name?city_name=${encodeURIComponent(query)}&lang=UA`); return (data.Entries?.Entry ?? []).map((item) => ({ id: item.CITY_ID, name: item.CITY_UA ?? item.CITY_NAME, region: item.REGION_UA ?? item.REGION_NAME, source: "ukrposhta" as const })).filter((item) => item.id && item.name); }
  async getStreets(settlement: AddressSettlement, query: string): Promise<AddressStreet[]> { const data = await this.get(`get_street_by_region_id_and_district_id_and_city_id_and_street_ua?city_id=${encodeURIComponent(settlement.id)}&street_ua=${encodeURIComponent(query)}`); return (data.Entries?.Entry ?? []).map((item) => ({ id: item.STREET_ID, name: `${item.SHORTSTREETTYPE_UA ?? ""} ${item.STREET_UA ?? ""}`.trim(), settlementId: settlement.id, settlementName: settlement.name, source: "ukrposhta" as const })).filter((item) => item.id && item.name); }
  async getBuildings(street: AddressStreet, query: string): Promise<AddressBuilding[]> { const data = await this.get(`get_addr_house_by_street_id?street_id=${encodeURIComponent(street.id)}&housenumber=${encodeURIComponent(query)}`); return (data.Entries?.Entry ?? []).map((item) => ({ id: item.HOUSE_ID ?? item.HOUSENUMBER_UA, number: item.HOUSENUMBER_UA, streetId: street.id, postalCode: item.POSTCODE, source: "ukrposhta" as const })).filter((item) => item.id && item.number); }
  async validateAddress(street: AddressStreet, buildingNumber: string): Promise<AddressValidation> { const normalized = buildingNumber.trim().toLocaleLowerCase("uk-UA"); const building = (await this.getBuildings(street, buildingNumber)).find((candidate) => candidate.number.trim().toLocaleLowerCase("uk-UA") === normalized); return building ? { valid: true, building } : { valid: false }; }
}

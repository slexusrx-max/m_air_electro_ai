import "server-only";

import { NominatimAddressProvider } from "./nominatim";
import type { AddressBuilding, AddressProvider, AddressSettlement, AddressStreet, AddressValidation } from "./types";
import { UkrposhtaAddressProvider } from "./ukrposhta";

const ukrposhta = new UkrposhtaAddressProvider();
const nominatim = new NominatimAddressProvider();

function configured() { return Boolean(process.env.UKRPOSHTA_ADDRESS_API_TOKEN?.trim()); }
function providerFor(source: AddressSettlement["source"] | AddressStreet["source"]): AddressProvider { return source === "ukrposhta" ? ukrposhta : nominatim; }

export const addressProvider = {
  async searchSettlements(query: string): Promise<AddressSettlement[]> {
    if (configured()) { try { return await ukrposhta.searchSettlements(query); } catch { /* fall back to independently sourced address data */ } }
    return nominatim.searchSettlements(query);
  },
  async getStreets(settlement: AddressSettlement, query: string): Promise<AddressStreet[]> {
    try { return await providerFor(settlement.source).getStreets(settlement, query); } catch { return nominatim.getStreets({ ...settlement, source: "nominatim" }, query); }
  },
  async getBuildings(street: AddressStreet, query: string): Promise<AddressBuilding[]> {
    try { return await providerFor(street.source).getBuildings(street, query); } catch { return nominatim.getBuildings({ ...street, source: "nominatim" }, query); }
  },
  async validateAddress(street: AddressStreet, buildingNumber: string): Promise<AddressValidation> {
    try { return await providerFor(street.source).validateAddress(street, buildingNumber); } catch { return nominatim.validateAddress({ ...street, source: "nominatim" }, buildingNumber); }
  },
};

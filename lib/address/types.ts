export type AddressSource = "ukrposhta" | "nominatim";
export type AddressSettlement = { id: string; name: string; region?: string; source: AddressSource };
export type AddressStreet = { id: string; name: string; settlementId: string; settlementName: string; source: AddressSource };
export type AddressBuilding = { id: string; number: string; streetId: string; postalCode?: string; source: AddressSource };
export type AddressValidation = { valid: boolean; building?: AddressBuilding };
export interface AddressProvider { searchSettlements(query: string): Promise<AddressSettlement[]>; getStreets(settlement: AddressSettlement, query: string): Promise<AddressStreet[]>; getBuildings(street: AddressStreet, query: string): Promise<AddressBuilding[]>; validateAddress(street: AddressStreet, buildingNumber: string): Promise<AddressValidation>; }

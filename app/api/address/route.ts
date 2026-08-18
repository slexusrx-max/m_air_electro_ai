import { addressProvider } from "@/lib/address/provider";
import { AddressProviderError } from "@/lib/address/ukrposhta";
import type { AddressSettlement, AddressStreet } from "@/lib/address/types";

function errorResponse(error: unknown) {
  const known = error instanceof AddressProviderError ? error : new AddressProviderError("upstream_unavailable", "Address provider unavailable");
  const status = known.code === "not_configured" ? 503 : known.code === "upstream_rejected" ? 502 : 503;
  return Response.json({ error: "Address lookup is temporarily unavailable", code: known.code }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode");
  if (mode === "status") return Response.json({ primary: { provider: "ukrposhta", configured: Boolean(process.env.UKRPOSHTA_ADDRESS_API_TOKEN?.trim()) }, fallback: { provider: "nominatim", enabled: true } }, { headers: { "Cache-Control": "no-store" } });
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 120);
  const settlementId = url.searchParams.get("settlementId") ?? "";
  const settlementName = url.searchParams.get("settlementName") ?? "";
  const settlementSource = url.searchParams.get("settlementSource") === "ukrposhta" ? "ukrposhta" : "nominatim";
  const streetId = url.searchParams.get("streetId") ?? "";
  const streetName = url.searchParams.get("streetName") ?? "";
  const streetSource = url.searchParams.get("streetSource") === "ukrposhta" ? "ukrposhta" : "nominatim";
  const minimumLength = mode === "buildings" || mode === "validate" ? 1 : 2;
  if (query.length < minimumLength) return Response.json([]);
  try {
    if (mode === "settlements") return Response.json(await addressProvider.searchSettlements(query));
    const settlement: AddressSettlement = { id: settlementId, name: settlementName, source: settlementSource };
    const street: AddressStreet = { id: streetId, name: streetName, settlementId, settlementName, source: streetSource };
    if (mode === "streets" && settlementId && settlementName) return Response.json(await addressProvider.getStreets(settlement, query));
    if (mode === "buildings" && streetId && streetName && settlementName) return Response.json(await addressProvider.getBuildings(street, query));
    if (mode === "validate" && streetId && streetName && settlementName) return Response.json(await addressProvider.validateAddress(street, query));
    return Response.json({ error: "Invalid address query" }, { status: 400 });
  } catch (error) { return errorResponse(error); }
}

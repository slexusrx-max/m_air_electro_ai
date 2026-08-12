import { AddressProviderError, UkrposhtaAddressProvider } from "@/lib/address/ukrposhta";

function errorResponse(error: unknown) {
  const known = error instanceof AddressProviderError ? error : new AddressProviderError("upstream_unavailable", "Address provider unavailable");
  const status = known.code === "not_configured" ? 503 : known.code === "upstream_rejected" ? 502 : 503;
  return Response.json({ error: "Address lookup is temporarily unavailable", code: known.code }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode");
  if (mode === "status") return Response.json({ configured: Boolean(process.env.UKRPOSHTA_ADDRESS_API_TOKEN?.trim()), provider: "ukrposhta" }, { headers: { "Cache-Control": "no-store" } });
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 120);
  const settlementId = url.searchParams.get("settlementId") ?? "";
  const streetId = url.searchParams.get("streetId") ?? "";
  const minimumLength = mode === "buildings" || mode === "validate" ? 1 : 2;
  if (query.length < minimumLength) return Response.json([]);
  try {
    const provider = new UkrposhtaAddressProvider();
    if (mode === "settlements") return Response.json(await provider.searchSettlements(query));
    if (mode === "streets" && settlementId) return Response.json(await provider.getStreets(settlementId, query));
    if (mode === "buildings" && streetId) return Response.json(await provider.getBuildings(streetId, query));
    if (mode === "validate" && streetId) return Response.json(await provider.validateAddress(streetId, query));
    return Response.json({ error: "Invalid address query" }, { status: 400 });
  } catch (error) { return errorResponse(error); }
}

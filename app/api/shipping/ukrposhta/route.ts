import { getUkrposhtaSandboxConfiguration } from "@/lib/ukrposhta/sandbox";
import { validateUkrposhtaDeliveryDraft, type UkrposhtaDeliveryDraft, type UkrposhtaRecipient } from "@/lib/ukrposhta/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isRecipient(value: unknown): value is UkrposhtaRecipient {
  return isRecord(value) && isString(value.firstName) && isString(value.lastName) && isString(value.phone) && (value.email === undefined || isString(value.email));
}

function isDeliveryDraft(value: unknown): value is UkrposhtaDeliveryDraft {
  return isRecord(value) && (value.kind === "branch" || value.kind === "address") && isString(value.region) && isString(value.city) && isString(value.postcode)
    && (value.postOfficeId === undefined || isString(value.postOfficeId)) && (value.street === undefined || isString(value.street))
    && (value.houseNumber === undefined || isString(value.houseNumber)) && (value.apartmentNumber === undefined || isString(value.apartmentNumber));
}

export async function GET() {
  const configuration = getUkrposhtaSandboxConfiguration();
  return Response.json({
    provider: "ukrposhta",
    environment: "sandbox",
    configured: configuration.configured,
    missing: configuration.missing,
    capabilities: {
      shipmentCreation: configuration.configured,
      deliveryPrice: "returned only by a successful sandbox shipment request",
      officeDirectory: "not enabled: no official sandbox directory endpoint configured",
      tracking: "not enabled: Ukrposhta has not provided a sandbox tracking endpoint",
    },
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!isRecord(body) || !isRecipient(body.recipient) || !isDeliveryDraft(body.delivery)) return Response.json({ error: "recipient and delivery must have valid field types" }, { status: 400 });
  const { recipient, delivery } = body;
  const validation = validateUkrposhtaDeliveryDraft(delivery, recipient);
  return Response.json(validation, { headers: { "Cache-Control": "no-store" } });
}

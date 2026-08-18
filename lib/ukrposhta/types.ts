export type UkrposhtaDeliveryKind = "branch" | "address";

export type UkrposhtaRecipient = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
};

export type UkrposhtaDeliveryDraft = {
  kind: UkrposhtaDeliveryKind;
  region: string;
  city: string;
  postcode: string;
  postOfficeId?: string;
  street?: string;
  houseNumber?: string;
  apartmentNumber?: string;
};

export type UkrposhtaAddressPayload = {
  postcode: string;
  country: "UA";
  region: string;
  city: string;
  district?: string;
  street?: string;
  houseNumber?: string;
  apartmentNumber?: string;
};

export type UkrposhtaShipmentPayload = {
  sender: { uuid: string };
  recipient: { uuid: string };
  deliveryType: string;
  paidByRecipient: boolean;
  parcels: Array<Record<string, unknown>>;
};

export type UkrposhtaTrackingStatus = {
  barcode: string;
  date: string;
  event: number;
  eventName: string;
  index: string;
  name: string;
};

export type DeliveryDraftValidation = { valid: true } | { valid: false; errors: string[] };

export function validateUkrposhtaDeliveryDraft(draft: UkrposhtaDeliveryDraft, recipient: UkrposhtaRecipient): DeliveryDraftValidation {
  const errors: string[] = [];
  if (!recipient.firstName.trim()) errors.push("recipient.firstName is required");
  if (!recipient.lastName.trim()) errors.push("recipient.lastName is required");
  if (!recipient.phone.trim()) errors.push("recipient.phone is required");
  if (!draft.region.trim()) errors.push("delivery.region is required");
  if (!draft.city.trim()) errors.push("delivery.city is required");
  if (!/^\d{5}$/.test(draft.postcode.trim())) errors.push("delivery.postcode must contain five digits");
  if (draft.kind === "branch" && !draft.postOfficeId?.trim()) errors.push("delivery.postOfficeId is required for branch delivery");
  if (draft.kind === "address" && !draft.street?.trim()) errors.push("delivery.street is required for address delivery");
  if (draft.kind === "address" && !draft.houseNumber?.trim()) errors.push("delivery.houseNumber is required for address delivery");
  return errors.length ? { valid: false, errors } : { valid: true };
}

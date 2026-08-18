import "server-only";

import type { UkrposhtaAddressPayload, UkrposhtaRecipient, UkrposhtaShipmentPayload } from "./types";

const ECOM_SANDBOX_BASE_URL = "https://dev.ukrposhta.ua/ecom/0.0.1/";

type RequiredCredential = "UKRPOSHTA_SANDBOX_BEARER" | "UKRPOSHTA_COUNTERPARTY_TOKEN" | "UKRPOSHTA_COUNTERPARTY_UUID";
type SandboxCredentials = { bearer: string; counterpartyToken: string; counterpartyUuid: string };

export class UkrposhtaSandboxError extends Error {
  constructor(
    public readonly code: "not_configured" | "upstream_rejected" | "upstream_unavailable" | "invalid_response",
    message: string,
    public readonly status?: number,
  ) {
    super(message);
  }
}

function value(name: string) {
  return process.env[name]?.trim() || undefined;
}

export function getUkrposhtaSandboxConfiguration() {
  const bearer = value("UKRPOSHTA_SANDBOX_BEARER");
  const counterpartyToken = value("UKRPOSHTA_COUNTERPARTY_TOKEN");
  const counterpartyUuid = value("UKRPOSHTA_COUNTERPARTY_UUID");
  const appLogin = value("UKRPOSHTA_APP_LOGIN");
  const appPassword = value("UKRPOSHTA_APP_PASSWORD");
  const missing = ([
    ["UKRPOSHTA_SANDBOX_BEARER", bearer],
    ["UKRPOSHTA_COUNTERPARTY_TOKEN", counterpartyToken],
    ["UKRPOSHTA_COUNTERPARTY_UUID", counterpartyUuid],
  ] as const).filter(([, credential]) => !credential).map(([name]) => name) as RequiredCredential[];
  return { bearer, counterpartyToken, counterpartyUuid, appLogin, appPassword, missing, configured: missing.length === 0 };
}

export class UkrposhtaSandboxClient {
  private readonly configuration = getUkrposhtaSandboxConfiguration();

  private requireConfiguration(): SandboxCredentials {
    if (!this.configuration.configured || !this.configuration.bearer || !this.configuration.counterpartyToken || !this.configuration.counterpartyUuid) {
      throw new UkrposhtaSandboxError("not_configured", "Ukrposhta sandbox credentials are not configured");
    }
    return { bearer: this.configuration.bearer, counterpartyToken: this.configuration.counterpartyToken, counterpartyUuid: this.configuration.counterpartyUuid };
  }

  private async request(path: string, init: RequestInit) {
    const { bearer } = this.requireConfiguration();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetch(new URL(path, ECOM_SANDBOX_BASE_URL), {
        ...init,
        cache: "no-store",
        signal: controller.signal,
        headers: { Authorization: `Bearer ${bearer}`, Accept: "application/json", "Content-Type": "application/json", ...init.headers },
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const code = response.status === 401 || response.status === 403 ? "upstream_rejected" : "upstream_unavailable";
        throw new UkrposhtaSandboxError(code, "Ukrposhta sandbox request failed", response.status);
      }
      if (!body || typeof body !== "object") throw new UkrposhtaSandboxError("invalid_response", "Ukrposhta sandbox returned an invalid response");
      return body as Record<string, unknown>;
    } catch (error) {
      if (error instanceof UkrposhtaSandboxError) throw error;
      throw new UkrposhtaSandboxError("upstream_unavailable", "Ukrposhta sandbox is unavailable");
    } finally {
      clearTimeout(timeout);
    }
  }

  async createAddress(address: UkrposhtaAddressPayload) {
    return this.request("addresses", { method: "POST", body: JSON.stringify(address) });
  }

  async createRecipient(recipient: UkrposhtaRecipient) {
    const { counterpartyToken } = this.requireConfiguration();
    return this.request(`clients?token=${encodeURIComponent(counterpartyToken)}`, { method: "POST", body: JSON.stringify(recipient) });
  }

  async createShipment(shipment: Omit<UkrposhtaShipmentPayload, "sender">) {
    const { counterpartyToken, counterpartyUuid } = this.requireConfiguration();
    return this.request(`shipments?token=${encodeURIComponent(counterpartyToken)}`, {
      method: "POST",
      body: JSON.stringify({ ...shipment, sender: { uuid: counterpartyUuid } }),
    });
  }
}

export const ukrposhtaSandboxEndpoints = {
  ecomBaseUrl: ECOM_SANDBOX_BASE_URL,
  createAddress: "POST /addresses",
  createRecipient: "POST /clients?token={counterpartyToken}",
  createShipment: "POST /shipments?token={counterpartyToken}",
} as const;

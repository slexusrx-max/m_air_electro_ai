import type { UkrposhtaTrackingStatus } from "./types";

export interface ShipmentTracker {
  getLastStatus(trackingNumber: string): Promise<UkrposhtaTrackingStatus | null>;
}

/**
 * Ukrposhta publishes its tracking endpoint on the production status-tracking
 * host. Marketplace is sandbox-only for now, so this adapter deliberately
 * makes no network call until Ukrposhta supplies a sandbox tracking endpoint.
 */
export class UkrposhtaSandboxTrackingAdapter implements ShipmentTracker {
  async getLastStatus(): Promise<UkrposhtaTrackingStatus | null> {
    return null;
  }
}

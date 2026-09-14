"use client";
import { useEffect } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";
export function AnalyticsEvent({ name, eventKey }: { name: AnalyticsEvent; eventKey: string }) {
  useEffect(() => { trackEvent(name); }, [name, eventKey]);
  return null;
}

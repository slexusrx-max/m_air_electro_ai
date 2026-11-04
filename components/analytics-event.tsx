"use client";
import { useEffect, useRef } from "react";
import { trackEvent, type AnalyticsEvent, type AnalyticsProperties } from "@/lib/analytics";
export function AnalyticsEvent({ name, eventKey, properties }: { name: AnalyticsEvent; eventKey: string; properties?: AnalyticsProperties }) {
  const sent = useRef("");
  const serialized = properties ? JSON.stringify(properties) : "";
  useEffect(() => {
    const key = `${name}:${eventKey}`;
    const send = () => {
      if (sent.current !== key && trackEvent(name, serialized ? JSON.parse(serialized) : undefined)) sent.current = key;
    };
    send();
    // A product already open when consent is given still belongs in the consented funnel.
    window.addEventListener("mair-analytics-consent", send);
    window.addEventListener("storage", send);
    return () => {
      window.removeEventListener("mair-analytics-consent", send);
      window.removeEventListener("storage", send);
    };
  }, [name, eventKey, serialized]);
  return null;
}

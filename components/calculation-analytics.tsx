"use client";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
// Live calculators have no submit button: count a valid changed result once after editing settles.
export function CalculationAnalytics({ signature, valid }: { signature: string; valid: boolean }) {
  const initial = useRef(signature);
  const started = useRef(false);
  useEffect(() => {
    if (initial.current === signature) return;
    if (!started.current) started.current = trackEvent("calculator_start");
    if (!valid) return;
    const timer = setTimeout(() => { initial.current = signature; trackEvent("calculator_complete"); }, 1200);
    return () => clearTimeout(timer);
  }, [signature, valid]);
  return null;
}

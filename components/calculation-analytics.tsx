"use client";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
// Live calculators have no submit button: count a valid changed result once after editing settles.
export function CalculationAnalytics({ signature, valid }: { signature: string; valid: boolean }) {
  const initial = useRef(signature);
  useEffect(() => {
    if (!valid || initial.current === signature) return;
    const timer = setTimeout(() => { initial.current = signature; trackEvent("calculator_complete"); }, 1200);
    return () => clearTimeout(timer);
  }, [signature, valid]);
  return null;
}

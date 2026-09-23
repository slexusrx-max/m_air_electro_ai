"use client";
import { createContext, useContext } from "react";
import { translateCalculator } from "@/lib/i18n/calculator-copy";

const CalculatorLocale = createContext(false);
export function CalculatorLocaleProvider({ ro, children }: { ro: boolean; children: React.ReactNode }) {
  return <CalculatorLocale.Provider value={ro}>{children}</CalculatorLocale.Provider>;
}
export function useCalculatorCopy() {
  const ro = useContext(CalculatorLocale);
  return (text: string) => translateCalculator(text, ro);
}

export const supportedLocales = ["en", "uk"] as const;
export type Locale = (typeof supportedLocales)[number];

export const roles = ["client", "expert"] as const;
export type RegistrationRole = (typeof roles)[number];
export type MarketplaceRole = RegistrationRole | "admin";

export type Dictionary = Record<string, string>;

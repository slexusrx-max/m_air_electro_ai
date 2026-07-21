import type { MarketplaceRole } from "@/lib/i18n/types";

export type Profile = { id: string; email: string; role: MarketplaceRole; country_code: string | null; preferred_language: string | null; spoken_languages: string[]; city: string | null; timezone: string | null; currency: string | null; remote_available: boolean | null; onboarding_completed_at: string | null; created_at: string; updated_at: string; };
export type Database = { public: { Tables: { profiles: { Row: Profile; Insert: Partial<Profile> & Pick<Profile, "id" | "email">; Update: Partial<Profile>; Relationships: []; }; }; Views: Record<string, never>; Functions: Record<string, never>; Enums: { marketplace_role: MarketplaceRole; }; CompositeTypes: Record<string, never>; }; };

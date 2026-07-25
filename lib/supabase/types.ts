import type { MarketplaceRole } from "@/lib/i18n/types";

export type AccountStatus = "active" | "blocked" | "pending";
export type Profile = {
  id: string; email: string; full_name: string | null; role: MarketplaceRole; account_status: AccountStatus;
  onboarding_completed: boolean; onboarding_completed_at: string | null; country_code: string | null; preferred_language: string | null;
  spoken_languages: string[]; city: string | null; timezone: string | null; currency: string | null; remote_available: boolean | null;
  company_name: string | null; assistance_type: string | null; professional_title: string | null; specializations: string[];
  years_experience: number | null; professional_description: string | null; contact_person: string | null;
  supplied_product_categories: string[]; company_description: string | null; created_at: string; updated_at: string;
};

type ProfileTable = { Row: Profile; Insert: Partial<Profile> & Pick<Profile, "id" | "email">; Update: Partial<Profile>; Relationships: [] };
type ExpertProfile = { profile_id: string; professional_title: string | null; specializations: string[]; years_experience: number | null; professional_description: string | null; created_at: string; updated_at: string };
type ClientProfile = { profile_id: string; assistance_type: string | null; created_at: string; updated_at: string };
type CompanyProfile = { id: string; profile_id: string; company_name: string; description: string | null; created_at: string; updated_at: string };
type Table<Row> = { Row: Row; Insert: Partial<Row>; Update: Partial<Row>; Relationships: [] };

export type Database = {
  public: {
    Tables: { profiles: ProfileTable; expert_profiles: Table<ExpertProfile>; client_profiles: Table<ClientProfile>; company_profiles: Table<CompanyProfile> };
    Views: Record<string, never>;
    Functions: {
      complete_user_onboarding: {
        Args: {
          p_full_name: string; p_country_code: string; p_preferred_language: string; p_assistance_type?: string | null;
          p_company_name?: string | null; p_company_description?: string | null; p_professional_title?: string | null;
          p_specializations?: string[] | null; p_years_experience?: number | null; p_professional_description?: string | null;
        };
        Returns: undefined;
      };
    };
    Enums: { marketplace_role: MarketplaceRole; account_status: AccountStatus; };
    CompositeTypes: Record<string, never>;
  };
};

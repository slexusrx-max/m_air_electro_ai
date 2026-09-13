export type ExpertProfile = {
  audience: string[];
  description: string;
  premium: boolean;
  regions: string[];
  responseWindow: string;
  serviceModes: string[];
  signals: string[];
  slug: string;
  title: string;
  useCases: string[];
};

// Profiles are published only after real identity, credential and consent checks.
export const expertProfiles: ExpertProfile[] = [];
export function getExpertProfileBySlug(slug: string) { return expertProfiles.find(p=>p.slug===slug); }

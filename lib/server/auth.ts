import "server-only";

export type UserRole =
  | "guest"
  | "home_user"
  | "electrician"
  | "marine_electrician"
  | "expert"
  | "seller"
  | "company"
  | "support"
  | "moderator"
  | "admin";

export type AuthenticatedUser = {
  email: string;
  id: string;
  name: string;
  role: UserRole;
};

export type AuthSession = {
  expiresAt: string;
  user: AuthenticatedUser;
};

export interface AuthenticationAdapter {
  getSession(): Promise<AuthSession | null>;
  requireRole(role: UserRole | UserRole[]): Promise<AuthSession>;
}

export const userRoles: UserRole[] = [
  "guest",
  "home_user",
  "electrician",
  "marine_electrician",
  "expert",
  "seller",
  "company",
  "support",
  "moderator",
  "admin",
];

export function getAuthRuntimeStatus() {
  const hasAuthSecret = Boolean(process.env.AUTH_SECRET?.trim());
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL?.trim());
  const oauthProviders = [
    { id: "google", configured: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) },
    { id: "microsoft", configured: Boolean(process.env.AUTH_MICROSOFT_ID && process.env.AUTH_MICROSOFT_SECRET) },
  ];

  return {
    hasAuthSecret,
    hasDatabaseUrl,
    configured: hasAuthSecret && hasDatabaseUrl,
    oauthProviders,
    supportedStrategies: ["magic-link", "password", "oauth"],
    roles: userRoles,
  };
}

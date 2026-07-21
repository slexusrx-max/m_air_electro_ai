// Authenticated content must be rendered per request so server-side session and role checks are never cached.
export const dynamic = "force-dynamic";

export default function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

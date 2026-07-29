import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/types";

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) throw new Error("Supabase environment variables are not configured.");
  return { url, key };
}

/** Read-only client for Server Components. */
export async function createClient() {
  const { url, key } = getSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, key, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} },
  });
}

/** Cookie-writing client for Server Actions and Route Handlers. */
export async function createActionClient() {
  const { url, key } = getSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. Actions and handlers can.
        }
      },
    },
  });
}

export function createAdminClient() {
  const { url } = getSupabaseConfig();
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) return null;

  return createSupabaseClient<Database>(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

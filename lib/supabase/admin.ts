import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

/**
 * Server-only privileged client. Never import this module into client code and
 * never expose SUPABASE_SECRET_KEY through a NEXT_PUBLIC_ environment variable.
 */
export function createAdminClient() {
  const { url } = getSupabaseConfig();
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!secretKey) throw new Error("SUPABASE_SECRET_KEY is not configured.");

  return createClient<Database>(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

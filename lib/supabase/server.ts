import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/types";

function getConfig() { const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; if (!url || !key) throw new Error("Supabase environment variables are not configured."); return { url, key }; }
export async function createClient() { const { url, key } = getConfig(); const cookieStore = await cookies(); return createServerClient<Database>(url, key, { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }); }

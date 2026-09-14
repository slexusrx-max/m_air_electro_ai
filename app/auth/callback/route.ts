import { safeRedirectUrl } from "@/lib/safe-redirect";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";
import { getSupabaseConfig } from "@/lib/supabase/server";
import { ensureProfileForUser } from "@/lib/supabase/auth";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url); const code = url.searchParams.get("code"); const next = safeRedirectUrl(url.searchParams.get("next"), url.origin);
  const response = NextResponse.redirect(next);
  if (!code || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return NextResponse.redirect(new URL("/login?error=verification-failed", url.origin));
  if (code) {
    const { url: supabaseUrl, key } = getSupabaseConfig();
    const supabase = createServerClient<Database>(supabaseUrl, key, { cookies: { getAll: () => request.cookies.getAll(), setAll: (cookies) => cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) } });
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(new URL("/login?error=verification-failed", url.origin));
    if (data.user) await ensureProfileForUser(data.user);
  }
  return response;
}

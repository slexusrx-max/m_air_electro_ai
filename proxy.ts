import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

const protectedPaths = ["/dashboard", "/client", "/expert", "/admin", "/onboarding"];
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedRoute = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return protectedRoute ? NextResponse.redirect(new URL("/login", request.url)) : NextResponse.next();
  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(url, key, { cookies: { getAll: () => request.cookies.getAll(), setAll: (cookies) => { cookies.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } } });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && protectedRoute) { const loginUrl = new URL("/login", request.url); loginUrl.searchParams.set("next", pathname + request.nextUrl.search); const login = NextResponse.redirect(loginUrl); response.cookies.getAll().forEach(cookie => login.cookies.set(cookie)); return login; }
  return response;
}
export const config = { matcher: ["/((?!api|auth/callback|_next/static|_next/image|.*\\.).*)"] };

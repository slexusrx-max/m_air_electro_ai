import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

const protectedPaths = ["/dashboard", "/client", "/expert", "/admin", "/onboarding"];
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) return NextResponse.next();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.redirect(new URL("/login", request.url));
  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(url, key, { cookies: { getAll: () => request.cookies.getAll(), setAll: (cookies) => { cookies.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } } });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { const loginUrl = new URL("/login", request.url); loginUrl.searchParams.set("next", pathname); return NextResponse.redirect(loginUrl); }
  return response;
}
export const config = { matcher: ["/dashboard/:path*", "/client/:path*", "/expert/:path*", "/admin/:path*", "/onboarding/:path*"] };

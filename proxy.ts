import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";
import { isLocalizedPublicPath, localeHeader, stripLocale } from "@/lib/i18n/routing";

const protectedPaths = ["/dashboard", "/client", "/expert", "/admin", "/onboarding"];
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const english = pathname === "/en" || pathname.startsWith("/en/");
  const publicRoute = isLocalizedPublicPath(pathname);
  const destination = request.nextUrl.clone();
  if (english && publicRoute) destination.pathname = stripLocale(pathname);
  function nextResponse() {
    const headers = new Headers(request.headers);
    headers.delete(localeHeader);
    if (publicRoute) headers.set(localeHeader, english ? "en" : "ro");
    return english && publicRoute
      ? NextResponse.rewrite(destination, { request: { headers } })
      : NextResponse.next({ request: { headers } });
  }
  const protectedRoute = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return protectedRoute ? NextResponse.redirect(new URL("/login", request.url)) : nextResponse();
  let response = nextResponse();
  const supabase = createServerClient<Database>(url, key, { cookies: { getAll: () => request.cookies.getAll(), setAll: (cookies) => { cookies.forEach(({ name, value }) => request.cookies.set(name, value)); response = nextResponse(); cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } } });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && protectedRoute) { const loginUrl = new URL("/login", request.url); loginUrl.searchParams.set("next", pathname + request.nextUrl.search); const login = NextResponse.redirect(loginUrl); response.cookies.getAll().forEach(cookie => login.cookies.set(cookie)); return login; }
  return response;
}
export const config = { matcher: ["/((?!api|auth/callback|_next/static|_next/image|.*\\.).*)"] };

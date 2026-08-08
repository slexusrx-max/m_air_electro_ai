import { NextResponse } from "next/server";
import type { Locale } from "@/lib/i18n/types";
import { localeCookieName } from "@/lib/i18n/request";
export async function POST(request: Request) { const body = await request.json() as { locale?: Locale }; if (body.locale !== "en" && body.locale !== "uk") return NextResponse.json({ error: "Unsupported locale" }, { status: 400 }); const response = NextResponse.json({ locale: body.locale }); response.cookies.set(localeCookieName, body.locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" }); return response; }

import { redirect } from "next/navigation";
import Link from "next/link";
import { PlatformShell } from "@/components/platform-shell";
import { getCurrentProfile, rolePath } from "@/lib/supabase/auth";
import { getRequestLocale } from "@/lib/i18n/request";
export default async function AccountPage() {
 const profile = await getCurrentProfile();
 if (profile) redirect(profile.account_status === "blocked" ? "/login?error=account-blocked" : rolePath[profile.role]);
 const ro = await getRequestLocale() === "ro";
 return <PlatformShell><main className="commerce-page content-panel"><h1 className="text-3xl font-semibold">{ro ? "Contul meu" : "My account"}</h1><p>{ro ? "Autentifică-te pentru a accesa profilul și instrumentele contului." : "Sign in to access your profile and account tools."}</p><div className="action-row"><Link className="button-primary" href="/login">{ro ? "Autentificare" : "Log in"}</Link><Link className="button-outline" href="/register">{ro ? "Creează cont" : "Create account"}</Link></div></main></PlatformShell>;
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "@/components/localized-link";
import { PlatformShell } from "@/components/platform-shell";
import { authMessages } from "@/lib/auth-messages";
import { getRequestDictionary, getRequestLocale } from "@/lib/i18n/request";
import { getCurrentProfile, getCurrentUser, rolePath } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getRequestDictionary();
  return { title: dictionary["auth.checkEmail"], robots: { index: false, follow: false } };
}

export default async function CheckEmailPage() {
  if (await getCurrentUser()) {
    const profile = await getCurrentProfile();
    if (profile?.account_status !== "blocked") redirect(profile ? rolePath[profile.role] : "/dashboard");
  }
  const locale = await getRequestLocale() === "ro" ? "ro" : "en";
  const dictionary = await getRequestDictionary();
  return (
    <PlatformShell contentClassName="flex flex-1 items-center px-4 py-12">
      <main className="glass-panel mx-auto w-full max-w-md rounded-[2rem] p-6 text-slate-900 sm:p-8">
        <h1 className="font-display text-3xl font-semibold">{dictionary["auth.checkEmail"]}</h1>
        <p role="status" className="mt-4 text-sm text-slate-700">{authMessages.verify[locale]}</p>
        <p className="mt-4 text-sm text-slate-600">{authMessages.verifyHelp[locale]}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/login" className="button-primary">{dictionary["auth.signIn"]}</Link>
          <Link href="/forgot-password" className="button-outline">{dictionary["auth.forgotPassword"]}</Link>
          <Link href="/register" className="text-sm text-teal-700">{locale === "ro" ? "Corectează adresa de e-mail" : "Correct your email address"}</Link>
        </div>
      </main>
    </PlatformShell>
  );
}

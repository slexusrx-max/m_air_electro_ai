import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentProfile, getCurrentUser } from "@/lib/supabase/auth";
import { getDictionary } from "@/lib/i18n/dictionaries";

type PlatformShellProps = { children: React.ReactNode; contentClassName?: string };
export async function PlatformShell({ children, contentClassName = "flex-1 px-4 pb-16 pt-10 sm:px-6 lg:px-8" }: PlatformShellProps) {
  const [profile, user] = await Promise.all([getCurrentProfile(), getCurrentUser()]);
  const dictionary = getDictionary(profile?.preferred_language === "ru" || profile?.preferred_language === "ro" ? profile.preferred_language : "en");
  return <main className="relative min-h-screen overflow-x-hidden bg-transparent text-slate-900"><div className="relative flex min-h-screen flex-col"><SiteHeader profile={user ? { email: profile?.email ?? user.email ?? "", role: profile?.role ?? "client" } : null} dashboardHref="/dashboard" dictionary={dictionary}/><div className={contentClassName}>{children}</div><SiteFooter/></div></main>;
}

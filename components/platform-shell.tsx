import Image from "next/image";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentProfile, getCurrentUser } from "@/lib/supabase/auth";
import { getDictionary } from "@/lib/i18n/dictionaries";

const circuitOverlayStyle = {
  backgroundImage: `
    linear-gradient(90deg, transparent 0 14%, rgba(190,242,100,0.16) 14% 15%, transparent 15% 100%),
    linear-gradient(0deg, transparent 0 26%, rgba(190,242,100,0.14) 26% 27%, transparent 27% 100%),
    linear-gradient(90deg, transparent 0 62%, rgba(255,255,255,0.16) 62% 62.8%, transparent 62.8% 100%),
    linear-gradient(0deg, transparent 0 58%, rgba(255,255,255,0.12) 58% 58.8%, transparent 58.8% 100%),
    radial-gradient(circle at 18% 22%, rgba(220,252,231,0.46) 0 3px, transparent 3.5px),
    radial-gradient(circle at 61% 44%, rgba(255,255,255,0.24) 0 2.5px, transparent 3px),
    radial-gradient(circle at 74% 68%, rgba(190,242,100,0.36) 0 3px, transparent 3.5px),
    linear-gradient(135deg, rgba(190,242,100,0.18), transparent 52%)
  `,
  backgroundSize:
    "170px 170px, 170px 170px, 220px 220px, 220px 220px, 170px 170px, 220px 220px, 220px 220px, 100% 100%",
  backgroundPosition: "0 0, 0 0, 28px 34px, 28px 34px, 0 0, 28px 34px, 28px 34px, 0 0",
  maskImage:
    "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.16) 14%, black 38%, rgba(0,0,0,0.88) 64%, transparent 100%), linear-gradient(180deg, transparent 0%, black 16%, black 82%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.16) 14%, black 38%, rgba(0,0,0,0.88) 64%, transparent 100%), linear-gradient(180deg, transparent 0%, black 16%, black 82%, transparent 100%)",
};

type PlatformShellProps = {
  children: React.ReactNode;
  contentClassName?: string;
  prioritizeBackground?: boolean;
};

export async function PlatformShell({
  children,
  contentClassName = "flex-1 px-4 pb-16 pt-10 sm:px-6 lg:px-8",
  prioritizeBackground = false,
}: PlatformShellProps) {
  const [profile, user] = await Promise.all([getCurrentProfile(), getCurrentUser()]);
  const dictionary = getDictionary(profile?.preferred_language === "ru" || profile?.preferred_language === "ro" ? profile.preferred_language : "en");
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07101d] text-white">
      {prioritizeBackground && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[100svh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/hero.png"
              alt="M Air Electro AI hero"
              fill
              priority
              sizes="100vw"
              className="object-cover brightness-105 contrast-100 saturate-150"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.04),rgba(2,6,23,0.34))]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(163,230,53,0.12),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_24%)]" />
          <div
            className="pointer-events-none absolute inset-y-[8%] right-[-12%] hidden w-[72%] opacity-50 md:block"
            style={circuitOverlayStyle}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[48%] bg-[radial-gradient(circle_at_60%_50%,rgba(163,230,53,0.16),transparent_58%)] opacity-80" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
        </div>
      )}

      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader
          profile={user ? { email: profile?.email ?? user.email ?? "", role: profile?.role ?? "client" } : null}
          dashboardHref="/dashboard"
          dictionary={dictionary}
        />
        <div className={contentClassName}>{children}</div>
        <SiteFooter />
      </div>
    </main>
  );
}

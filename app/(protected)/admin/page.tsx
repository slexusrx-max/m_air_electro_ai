import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform-shell";
import { requireCompletedProfile } from "@/lib/supabase/auth";

export default async function AdminPage() {
  const profile = await requireCompletedProfile();
  if (profile.role !== "admin") redirect("/dashboard");
  return <PlatformShell><section className="mx-auto flex w-full max-w-5xl flex-1 items-center"><article className="glass-panel w-full rounded-[2rem] p-8 sm:p-12"><p className="text-sm font-medium uppercase tracking-[0.2em] text-lime-200">Administration</p><h1 className="mt-3 font-display text-4xl font-semibold">Admin Dashboard</h1><p className="mt-5 max-w-xl text-base leading-8 text-white/70">Administration tools will be added here. Access is verified on the server for every request.</p></article></section></PlatformShell>;
}

import { redirect } from "next/navigation";
import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";
import { getUserDictionary } from "@/lib/i18n/server";
import { requireCompletedProfile, rolePath } from "@/lib/supabase/auth";
export default async function ExpertDashboardPage() { const profile = await requireCompletedProfile(); if (profile.role !== "expert") redirect(rolePath[profile.role]); return <DashboardPlaceholder role="expert" dictionary={await getUserDictionary()} />; }

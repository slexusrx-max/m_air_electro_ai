import { redirect } from "next/navigation";
import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";
import { getUserDictionary } from "@/lib/i18n/server";
import { requireCompletedProfile, rolePath } from "@/lib/supabase/auth";
export default async function SupplierDashboardPage() { const profile = await requireCompletedProfile(); if (profile.role !== "supplier") redirect(rolePath[profile.role]); return <DashboardPlaceholder role="supplier" dictionary={await getUserDictionary()} />; }

import { redirect } from "next/navigation";
import { requireCompletedProfile, rolePath } from "@/lib/supabase/auth";
export default async function DashboardPage() { const profile = await requireCompletedProfile(); redirect(rolePath[profile.role]); }

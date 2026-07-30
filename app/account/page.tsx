import { SignInRequired, SimplePowerPage } from "@/components/power/simple-pages";
import { getCurrentUser } from "@/lib/supabase/auth";
export default async function AccountPage() { const user = await getCurrentUser(); return <SimplePowerPage eyebrow="Account" title="Account settings.">{user ? <div className="info-card"><h2>{user.email}</h2><p>Account management continues in the existing protected dashboard.</p></div> : <SignInRequired feature="account settings"/>}</SimplePowerPage>; }

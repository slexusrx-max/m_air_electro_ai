import { SignInRequired, SimplePowerPage } from "@/components/power/simple-pages";
import { getCurrentUser } from "@/lib/supabase/auth";
export default async function SavedPage() { const user = await getCurrentUser(); return <SimplePowerPage eyebrow="Saved" title="Your monitored locations.">{user ? <div className="info-card"><h2>No saved locations yet</h2><p>Save a facility or region from the map to monitor it here.</p></div> : <SignInRequired feature="saved plants and regions"/>}</SimplePowerPage>; }

import { PlatformShell } from "@/components/platform-shell";
import { HomeContent } from "@/components/product/page-content";
import { getRequestDictionary } from "@/lib/i18n/request";
export default async function Home() { return <PlatformShell><HomeContent dictionary={await getRequestDictionary()} /></PlatformShell>; }

import { PlatformShell } from "@/components/platform-shell";
import { HomeContent } from "@/components/product/page-content";
import { getRequestDictionary } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
export const metadata = buildMetadata({
  title: "Energie de rezervă, baterii și solar în România",
  path: "/",
});
export default async function Home() {
  return (
    <PlatformShell>
      <HomeContent dictionary={await getRequestDictionary()} />
    </PlatformShell>
  );
}

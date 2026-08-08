import { ExpertDirectory } from "@/components/experts/expert-directory";
import { PlatformShell } from "@/components/platform-shell";
import { expertProfiles } from "@/lib/experts";
import { buildMetadata } from "@/lib/metadata";
import { getRequestDictionary } from "@/lib/i18n/request";

export async function generateMetadata() { const t = await getRequestDictionary(); return buildMetadata({ title: `${t["experts.metadataTitle"]} | Electro-AI`, description: t["experts.metadataDescription"], path: "/experts" }); }

export default async function ExpertsPage() { const t = await getRequestDictionary();
  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
        <ExpertDirectory profiles={expertProfiles} dictionary={t} />
      </section>
    </PlatformShell>
  );
}

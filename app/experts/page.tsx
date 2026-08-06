import { ExpertDirectory } from "@/components/experts/expert-directory";
import { PlatformShell } from "@/components/platform-shell";
import { expertProfiles } from "@/lib/experts";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Experts",
  description:
    "Verified expert tracks for residential, industrial, marine, and offshore electrical work on M Air Electro AI.",
  path: "/experts",
});

export default function ExpertsPage() {
  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
        <ExpertDirectory profiles={expertProfiles} />
      </section>
    </PlatformShell>
  );
}

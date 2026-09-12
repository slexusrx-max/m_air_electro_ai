import { PlatformShell } from "@/components/platform-shell";
import { BackupCalculator } from "@/components/product/backup-calculator";
import { ProductPage } from "@/components/product/page-content";
import { getRequestDictionary } from "@/lib/i18n/request";
import { commercialCopy } from "@/lib/marketplace/copy";
import { buildMetadata } from "@/lib/metadata";
export const metadata = buildMetadata({
  title: "Calculator de autonomie",
  description:
    "Calculează consumul aparatelor, capacitatea bateriei și puterea invertorului pentru energie de rezervă.",
  path: "/backup-calculator",
});
export default async function BackupCalculatorPage() {
  const t = await getRequestDictionary(),
    c = commercialCopy(t);
  return (
    <PlatformShell>
      <ProductPage
        eyebrow={c.ro ? "Planificare explicată" : "Explained planning"}
        title={c.backup}
        description={
          c.ro
            ? "Editează aparatele și timpul lor de funcționare pentru a estima bateria și invertorul. Valorile inițiale sunt exemple, nu măsurători ale locuinței tale."
            : "Edit appliances and their run times to estimate battery and inverter requirements. Initial values are examples, not measurements of your home."
        }
      >
        <BackupCalculator dictionary={t} />
      </ProductPage>
    </PlatformShell>
  );
}

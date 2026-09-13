import { commercialCopy } from "@/lib/marketplace/copy";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/types";
export function AffiliateDisclosure({
  dictionary: t,
}: {
  dictionary: Dictionary;
}) {
  const ro = t["locale.code"] === "ro";
  return (
    <aside className="supplier-disclosure">
      <strong>
        {ro ? "Furnizori și afiliere" : "Suppliers & affiliation"}
      </strong>
      <p>{commercialCopy(t).supplierNote}</p>
      <Link href="/affiliate-disclosure">
        {ro ? "Citește politica de transparență" : "Read the disclosure policy"}{" "}
        →
      </Link>
    </aside>
  );
}

import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/types";
import { commercialCopy } from "@/lib/marketplace/copy";
export function AffiliateDisclosure({
  dictionary: t,
}: {
  dictionary: Dictionary;
}) {
  const c = commercialCopy(t);
  return (
    <aside className="rounded-2xl border border-teal-800/20 bg-white/80 p-4 text-sm leading-6 text-slate-700">
      <p>{c.supplierNote}</p>
      <Link
        href="/affiliate-disclosure"
        className="mt-2 inline-block font-bold text-teal-800 underline"
      >
        {c.disclosure}
      </Link>
    </aside>
  );
}

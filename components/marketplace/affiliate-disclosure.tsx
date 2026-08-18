import type { Dictionary } from "@/lib/i18n/types";
export function AffiliateDisclosure({ dictionary: t }: { dictionary: Dictionary }) { return <p className="rounded-xl border border-lime-100/20 bg-lime-100/[0.06] p-3 text-xs leading-5 text-white/70">{t["marketplace.disclosure"]}</p>; }

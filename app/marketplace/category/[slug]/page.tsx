import { notFound, permanentRedirect } from "next/navigation";
import { legacyCategories } from "@/lib/marketplace/content";
import { getRequestLocale } from "@/lib/i18n/request";
import { localizedPath } from "@/lib/i18n/routing";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const path = legacyCategories[(await params).slug];
  if (!path) notFound();
  permanentRedirect(localizedPath(`/marketplace/${path}`, await getRequestLocale()));
}

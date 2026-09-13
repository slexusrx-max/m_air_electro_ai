import { notFound, permanentRedirect } from "next/navigation";
import { legacyCategories } from "@/lib/marketplace/content";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const path = legacyCategories[(await params).slug];
  if (!path) notFound();
  permanentRedirect(`/marketplace/${path}`);
}

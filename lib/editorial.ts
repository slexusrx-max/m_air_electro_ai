import { siteConfig } from "./site";
import records from "./marketplace/editorial-records.json";

export type EditorialRecord = { author?: string; published?: string; reviewed?: string; evidence?: string; corrections?: { date: string; reason: string }[] };
export function editorialRecord(path: string): EditorialRecord {
  // Only per-page, owner-confirmed facts belong here. A git commit is not publication or human review.
  return (records as Record<string, EditorialRecord>)[path] ?? {};
}
export function editorialAuthor(record: EditorialRecord) {
  return record.author === "owner" ? siteConfig.operatorName : record.author;
}

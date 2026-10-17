import { siteConfig } from "./site";
import records from "./marketplace/editorial-records.json";

export type EditorialRecord = { author?: string; published?: string; updated?: string; reviewed?: string; evidence?: string; corrections?: { date: string; reason: string }[] };
export function editorialRecord(path: string): EditorialRecord {
  // Attribution and human review require per-page evidence. Updated dates record substantive edits;
  // a git commit is not evidence of first publication, authorship or human review.
  return (records as Record<string, EditorialRecord>)[path] ?? {};
}
export function editorialAuthor(record: EditorialRecord) {
  return record.author === "owner" ? siteConfig.operatorName : record.author;
}

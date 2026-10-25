# Architecture safeguards release — 25 October 2026

- Baseline: 4d57f0997dd6adec14435c739327f21dda1e532d (PR27).
- Waterdrop accepts only the documented dewaterdropfilter.pxf.io origin, observed opaque short codes and the issued catalog campaign path. Explicit destinations must equal the exact merchant source. Untrusted overrides fall back to ordinary URLs; activation gates and unavailable K19H remain unchanged.
- Source host inventory: raw catalog 18289 contains the same tracking host; no new tracking hosts were inferred. All 13 reviewed feed mappings and three existing short-code formats pass. No external tracking URL was fetched.
- Added offline catalog validation: 54 records, 41 models, 35 model photos, reviewed links and 72 parent-photo decisions. No price/stock assumptions or eligibility changes.
- Added GitHub PR/main verification: npm ci, lint, catalog validation, unit suite, webpack build, types. Read-only contents permission, no secrets, no persisted checkout credentials, no branch-protection/billing changes. Public font downloads remain a build dependency.
- Local verification: 129 unit tests, full lint, typecheck and webpack build passed. Browser and remote CI evidence will be finalized after execution.
- Architecture report: architecture-gap-assessment-2026-10-25.md, including all A01–C12 criteria and bounded source evidence. Durable lead storage, monitoring/restore proof and live environment separation remain gaps; no new persistent infrastructure added.

Rollback: revert this release's commits through the normal PR path or select the last verified production deployment. No database migrations or environment changes are included. Restoring application code does not constitute a backup restore drill.

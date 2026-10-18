# Account projects: implementation and database evidence

Status on 18 October 2026: **backend and database preparation only; frontend integration and production website release are still pending.**

The work continues from GitHub main `7a48e7d609029352ce05948d46433518ea9cbd4f`. The backend was saved as `042552a` on `codex/account-projects-2026-10-18`. Prepared interface commit `43467ecfe875f85e42390df7348b685a1039f6be` remains in the cloud workspace; its bundle must be imported before integrating those existing changes. Do not recreate or overwrite that work.

## Backend

`/api/projects` uses the existing Supabase cookie session, validates the authenticated user and profile, filters all queries by the owner, and exposes bounded project CRUD. Updates and deletes require the last received revision; a conflict returns 409. Project contents contain catalog IDs and quantities, not orders, stock, prices, payments or compatibility guarantees. CSV export neutralises spreadsheet formulas.

An incomplete `pending` profile is accepted by the existing sign-in/dashboard flow. Projects therefore permit authenticated `active` and `pending` profiles explicitly, while rejecting blocked or unexpected states. This changes only access to the user's own equipment projects. It does not activate profiles or change AI permissions, roles, credentials or other account features.

## Applied database changes

The public Supabase URL configured for Vercel Production and Preview was checked in the dashboard and matches project `rmevcvmmpiejdumqygee` (`m-air-electro-ai`). No keys were copied or changed.

The existing authenticated SELECT grant on `profiles` was already present. The following repository migrations were applied through the SQL Editor, each in a transaction:

- `20261018000000_equipment_projects.sql`: private project table, owner RLS, restricted column grants, validation, automatic revision/timestamps, and concurrent-safe per-account limit.
- `20261018000001_equipment_projects_pending_profiles.sql`: narrow alignment with existing pending-profile access; the original applied migration was not rewritten.

Application through the SQL Editor does not by itself register migration versions in Supabase CLI migration history. Inspect remote history before any future automated migration push; do not blindly reapply these files.

## Verification

- All 99 repository unit tests passed, including real PostgreSQL-compatible RLS tests with two pending profiles, blocked/anonymous denial, quantity validation, stale revisions, limits and API ownership filters.
- TypeScript and targeted ESLint checks passed.
- A full production build passed with `node --use-system-ca node_modules/next/dist/bin/next build --webpack` (106 static pages). The local default Turbopack build hit a Windows process-start failure; Google Fonts required the existing Windows CA trust store. Certificate verification stayed enabled and the repository build configuration was not changed.
- Final production metadata checks after both migrations confirmed all 12 expected table/RLS/grant/trigger conditions, zero projects remaining after rollback, and the same four pending profiles.
- After the delta, a production SQL probe using two existing profiles passed all **15** assertions: owner CRUD, saved quantity, refreshed owner claims, cross-owner read/update/delete isolation, forged ownership denial, anonymous denial, protected columns and stale revisions.
- That probe ran inside `BEGIN` / `ROLLBACK`, generated its own temporary project, created no accounts, sent no messages and committed no test data. No existing profile or project contents were modified.

The SQL result is a database-level check, not a completed browser-to-API or two-device UI test. Ignored evidence is under `.task-work/projects-production/`, including `isolation-pass-15.png`, its corresponding accessibility transcript and `final-metadata-pass.png`.

## Remaining release work

Import the prepared visual branch, connect its saved-project interface to the API, preserve an explicitly separate guest mode, handle unknown/removed product IDs and 409 conflicts, and verify account changes/logout without showing another user's cached state. Wire the ten exact partner-feed images documented in `product-photo-provenance-2026-10-18.md`; keep the six unverified Pecron/Bluetti model photos explicitly missing. Preserve all issued affiliate links and production tracking gates.

The main domain is not updated by this branch preparation. Complete desktop/mobile checks, production deployment and verification of the deployed GitHub main commit before reporting delivery.

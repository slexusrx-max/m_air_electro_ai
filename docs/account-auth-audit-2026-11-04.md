# Account and authentication audit — 4 November 2026

Audited against application baseline `2cd8e08`, confirmed by the lead agent as matching GitHub main and production before this work. This document describes scoped implementation and isolated regression evidence; it does not itself confirm deployment of this package or a real end-to-end registration.

## Fixed profile-read failure handling

The existing `getCurrentProfile` ignored a database error and treated it as a successfully missing row. That could construct an active session profile despite an unavailable lifecycle-status check. A thrown lookup or optional role-details lookup could instead break the server-rendered header/dashboard.

Failed profile status lookups now return no authorized profile, without a privileged bootstrap attempt or inferred active status. Successful owner reads retain the exact active, pending or blocked state. The existing bounded bootstrap is preserved only after a successful empty lookup. Optional account-detail failures fall back to the already verified base profile rather than an unhandled rendering exception. Profile bootstrap failures cannot abort a successful confirmation-code exchange.

Login/registration actions report the existing localized unavailable message when credentials succeed but profile status cannot be read. Login renders that recovery message instead of cycling between login and dashboard; authenticated registration/check-email routes return to the same recovery page. Existing blocked-account sign-out, role routing, confirmation callback, safe redirect validation, password whitespace, pending profile handling and RLS are preserved. No migration or production user update was made.

## Existing saved-data boundaries

- Account profile details and one requirements description use existing private profile tables and the secured onboarding RPC.
- `equipment_projects` and `/api/projects` provide the existing private backend project CRUD. Owner filters and RLS isolate accounts; writes validate product IDs/quantities and require current revisions for update/delete. The API uses private/no-store responses and rejects anonymous/blocked/cross-origin mutation attempts.
- The prepared project UI mentioned by `account-projects-release-2026-10-18.md` is not present in the current main interface. It must be recovered/reconciled from that existing work before integration; this audit does not build a parallel replacement.
- Calculator results are not saved to the account; dashboard copy states this. Comparisons remain explicitly browser/device-local and are not private account storage. `/saved` redirects to comparison. Guest equipment discovery requires no account.
- A secure account-calculation feature would require a bounded, versioned result schema, account ownership/RLS, clear separation from browser-only drafts and tests for account switching/logout. The existing equipment-project schema accepts catalog IDs/quantities, not arbitrary calculation payloads. No unsupported calculation fields were added to it.

## Verification and limits

Twenty focused tests passed across `auth.test.mjs`, `phase2-account-regression.test.mjs`, `profile-read.test.mjs` and `equipment-projects.test.mjs`. These exercise mocked registration/login/logout/recovery, callback/session-cookie handling, unavailable-profile recovery, blocked/pending handling, actual PostgreSQL-compatible owner RLS, reconnect persistence, forged ownership denial, revisions and project limits. All mail providers and accounts are fixtures; no auth email, real account or production data mutation was created.

Fresh read-only production checks passed all six `phase2-account-readonly.spec.ts` scenarios: public forms at 390, 430, 768, 1366 and 1440px, plus anonymous dashboard/project denial and invalid-callback recovery. No runtime errors or horizontal overflow were observed in the form checks, and no form was submitted. The API request in the initial denial run could not validate the host certificate through Node's default trust store; its focused rerun passed with `NODE_USE_SYSTEM_CA=1`, retaining TLS validation. Logs/screenshots are ignored under `.task-work/phase2-account/`.

These checks validate the pre-release production baseline, not deployment of the new error-handling code. The lead agent must record full package checks, deployment and post-release acceptance. Mocked tests do not prove inbox delivery, real signed-in rendering, production database grants or successful confirmation/reset across devices.

## Analytics receipt prerequisites (read-only code audit)

The current funnel sends to `https://plausible.io/api/event`. Before interpreting dashboards, verify the production build has `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` equal to `mairelectroai.com`, the intended Plausible site/project is accessible and its canonical custom event names/properties can be reported. A Google Ads tag or Search Console property is not proof of a working Plausible property. No subscription or project was purchased/created by this audit.

Actual events additionally require unexpired accepted consent, matching hostname, no DNT/GPC, no automation and a public route. Tests retain `navigator.webdriver` and must not generate genuine-customer event counts. Instrumentation or a queued browser request is not receipt evidence; an authenticated reporting record for legitimate consented activity is needed. Missing/unavailable reporting remains unknown rather than zero. The lead agent owns live service access/receipt verification and records any concrete missing configuration separately.

# Commercial source audit — 25 October 2026

Base: 56b9eecc7114c647561e6ee25f5852c84a0f8a7b, fresh isolated clone. Existing C:/AI/TEST/m-air-production matches this commit and was read only. Older Documents/GitHub checkout has unrelated uncommitted renogy-feature.tsx and was untouched.

## Corrected

Renogy verifiedImpactLinks accepted an explicit deep-link destination different from the source mapping key, including another variant. Reject mismatching, empty and duplicate u parameters. Preserve opaque issued short links and existing exact mappings. No new tracking IDs, mappings or activation flags.

## Existing implementation

SupplierLink receives server-resolved URLs from PlatformShell, marks tracked links sponsored and labels affiliate CTAs; fallback is ordinary. There is no /go route: current architecture uses direct resolved external hrefs. Origin and activation gates remain. Existing reviewed mappings preserve exact variant queries. No external handoff was executed in this audit.

The 72-entry catalog deliberately renders product.url directly and explicitly says ordinary/non-affiliate. Source fixture contains parent URLs and SKU lists, not issued tracking links. docs/renogy-catalog-release-2026-10-20.md documents the existing issued publisher/ad/program and u deep-link method. This establishes a potential parent-page deep-link implementation path, not an exact variant mapping for every parent or fresh program acceptance evidence. New mappings remain unsupported/unimplemented here; do not derive a selected SKU from parent-page grouping. Romania eligibility is closed, not a blocker. No CSV reprocessing.

## Analytics and contact

Analytics already includes consent age, GPC/DNT, private-route and webdriver exclusions, hostname gate, sanitized public supplier properties and contact_accepted semantics. No service was purchased or connected. Local clone/process has no production analytics/contact credentials; latest inspected stored commercial report says Plausible unconfigured. Current deployment environment was not retrieved, so present service configuration/ingestion remains unverified.

Contact recipient is siteConfig.contactEmail = verifiedMailbox(NEXT_PUBLIC_CONTACT_EMAIL); intended public recipient is contact@mairelectroai.com. Current runtime recipient cannot be certified from source alone. Sender uses verified CONTACT_FROM_EMAIL, visitor only Reply-To; Brevo STARTTLS and Turnstile gates remain. Parent's separate authorized minimal test: first verify deployed NEXT_PUBLIC_CONTACT_EMAIL equals intended recipient without revealing secrets, then one clearly labelled test message through /contact with consent and a real Turnstile token; record HTTP accepted, SMTP acceptance and actual inbox receipt separately. No live submission here. Historical October 1 receipt is not a fresh test.

## Validation

14 targeted unit tests passed: destination/policy 4, expansion/CSP 4, commercial analytics/privacy 6. ESLint, TypeScript, production build and git diff --check passed. Direct native Node test invocation initially failed extensionless TS resolution; supported tsx runner passed. npm install initially failed sandbox DNS; escalated locked install succeeded. Browser sandbox initially lacked installed Chromium and cross-context localhost failed; host-aligned browser/server resolved both. Development-mode four UI cases encountered duplicate canonical nodes during navigation; production-mode results are recorded in final handoff. No production deployment or merge.

Routing evidence does not prove network click registration. Neither conversions nor payout were tested or inferred. Current Impact authentication/report evidence belongs to the separate controlled-click task.

Production-mode local UI: all four RO/EN 390/1440 cases passed (21.8s), including exact ordinary hrefs, canonical/hreflang, no horizontal overflow and axe checks. English mobile/desktop screenshots inspected; no UI changes made.

## Follow-up — parent destinations and current configuration

The earlier parent-link limitation above is superseded: parent-level mapping does not require selecting a variant. Added a separate allowlisted mapping derived only from the existing 72 exact EU parent URLs, using documented issued ad /c/7767803/3394229/14864 and u, never prodsku. Existing approval, EU verification, global tracking and origin gates remain; deployment overrides retain precedence. Cards now say View variants and label only activated affiliate links. No reviewed-model claim, price, commission guarantee or external traversal.

Read-only Vercel project environment inventory on October 25: NEXT_PUBLIC_PLAUSIBLE_DOMAIN absent, hiddenProductionEnvCount=0. CONTACT_FORM_ENABLED, CONTACT_EMAIL_VERIFIED, CONTACT_FROM_EMAIL, NEXT_PUBLIC_CONTACT_EMAIL, BREVO_SMTP_LOGIN, BREVO_SMTP_KEY, NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY present for production. Presence does not prove validity. Retrieved only the public recipient variable individually: NEXT_PUBLIC_CONTACT_EMAIL=contact@mairelectroai.com. No credentials decrypted, changed or copied into this report.

Fresh origin/main remains 56b9eecc7114c647561e6ee25f5852c84a0f8a7b, authored/committed by slexusrx-max on 25 October 2026 15:17:50 +0200, subject Fix water category browsing flow on current production. No conflict with that baseline. Full unit suite after parent changes: 118 passed, zero failed/skipped. Initial integration JSX and isolated test dependency errors were fixed before successful rerun.

Final parent implementation: lint, types, production build passed; activated local production UI 4/4 RO/EN at 390/1440 passed in 29.2s. Unit suite 118/118. No external CTA clicks.

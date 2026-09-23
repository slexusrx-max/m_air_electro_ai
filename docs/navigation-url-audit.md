# Navigation URL incident audit

Date: 2026-09-23. Production: https://mairelectroai.com.

## Confirmed defect and reproduction

`lib/site.ts` previously implemented `absoluteUrl` by prefixing a slash to any input not starting with `/`, then concatenating the configured origin. Consequently, `absoluteUrl("https://mairelectroai.com/")` returned `https://mairelectroai.com/https://mairelectroai.com/`. A regression test was run against the old implementation and failed with exactly that actual/expected difference before the implementation was changed.

This establishes a real URL-construction defect. It does not establish which UI click triggered the user's report: the existing logo already used `href="/"`, all audited call sites passed relative paths, and the pre-fix live crawl found no malformed anchor among 113 visited routes. Do not claim that an identified header button was fixed or that the user caused the incident. The specific reported click remains unconfirmed.

## Root-level correction

- Resolve paths and already absolute addresses using the standard `URL` parser rather than string concatenation. Resolution is idempotent and preserves query strings/fragments.
- Reject embedded HTTP(S) origins in URL paths, including single-slash and percent-encoded forms, duplicated host path segments, unsupported schemes, credentials and protocol-relative inputs.
- Preserve normal relative internal Next.js navigation. No site-wide rewrite, one-off domain redirect or visual change was introduced.
- The crawler uses URL resolution and explicitly reports malformed link/redirect paths separately from HTTP errors. URLs inside legitimate query values are not mistaken for path origins.

## Files

- `lib/site.ts`: URL resolution and shared malformed-path detection.
- `scripts/crawl.ts`: URL-aware request resolution and explicit nested-origin detection.
- `tests/readiness.test.mjs`: exact failing regression, idempotence, relative/absolute/query/fragment handling, invalid input variants.
- `tests/e2e/navigation-urls.spec.ts`: hydrated link/form-action audit across every public route in both RO/EN, query-based search and comparison, menu contents, logo clicks and language changes at 390/430/1440px. Internal navigation hrefs must remain relative.
- `docs/navigation-url-audit.md`: incident evidence, scope and limitations.

## Verification scope

The source audit searched tracked application/configuration/tests/documentation for the production origin, site environment variables, URL helpers, hrefs, router navigation, location mutations and redirects. The existing full Playwright suite additionally exercises category/product cards, Solutions, Tools, Learn, Experts, Business, breadcrumbs/footer, filters/search, comparison, calculator CTAs and the solution finder. No real orders, account creation or contact messages are submitted.

Pre-fix production crawl: 113 routes, no failures, no orphaned sitemap entries. Post-fix local crawl: 113 routes, no failures, no orphaned sitemap entries. Unit suite: 40 passing tests, including the regression that failed on the old helper. Full local Playwright suite: 71 passing tests in 3.6 minutes. Translation check: 419 declared keys. Lint, typecheck and production build passed.

Release procedure: require the full local browser suite, push this fix to `main`, verify the matching Vercel deployment, rerun the full browser suite and crawler on the actual custom domain, and report the immutable SHA plus those production results. Local results alone do not certify production. Final after-deployment evidence is retained in ignored `.task-work/url-production.log`, `.task-work/url-production/`, and `test-results/crawl-production.json`, and summarized in the delivery response.

## Previous production-completion task

The visual system and original hero remain unchanged. The completed publisher-readiness audit still applies. Status remains **NOT READY** for Impact: actual operator/editor identity, verified domain contact delivery, human editorial approvals and legal/controller details require owner input; Renogy campaign eligibility/approval and any audience evidence must be real. None of these facts were invented to close this navigation incident. See `docs/production-completion-report.md` and `docs/custom-domain-and-publisher.md`.

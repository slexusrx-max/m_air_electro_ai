# Account and responsive audit — 14 September 2026

The existing Supabase SSR authentication and role routing remain in place. Public discovery still requires no account.

## Changes

- Anonymous visitors can access Romanian/English login and registration from desktop navigation and the top of the mobile menu. Authenticated headers expose account/dashboard navigation and sign-out on both layouts.
- Auth forms use the request locale. Validation, provider failures, verification-link failures and missing configuration have localized messages; password whitespace is preserved. Login permits existing passwords without imposing registration's minimum length.
- The callback rejects missing verification codes and preserves the existing safe local redirect validation. Session refresh now covers public HTML pages as well as protected routes; refresh cookies are copied to protected-route redirects.
- The existing client/expert dashboard now displays account details, account settings, persisted energy requirements when present, calculator/discovery links, and the existing browser-only comparison selection. Private role details are read from the same tables written by the secured onboarding RPC.
- `/onboarding` is an optional profile editor using that RPC, with Romanian/English preferences, retained country values, and support for zero years of experience. It does not publish experts or verify qualifications.
- `/account` shows a localized sign-in-required state or routes authenticated users to their role dashboard. Existing private-page noindex metadata remains.
- Header controls wrap deliberately on narrow screens; touch targets, menu scrolling, forms, filter columns, table containment and long-content wrapping are improved.
- The global decorative image now uses `object-contain` with bottom alignment, preserving the complete composition at all aspect ratios. Existing original product illustrations retain intrinsic dimensions. The panorama is intentionally smaller on phones rather than cropped to a narrow central slice.
- Battery-calculator navigation is localized. The solution finder reports absent/invalid browser profiles rather than treating illustrative defaults as saved user data.

## Persistence and commercial boundaries

Account requirements use the existing `client_profiles.assistance_type` field. This is one requirements description, not a new projects database. Calculator results are not stored in the account. Comparisons remain browser/device storage and may be visible to others using that browser; the UI states this explicitly. No supplier order integration, checkout, payment, stock, invented professional listing or affiliate approval was added. Existing Renogy/Impact disclosure and ordinary supplier links remain.

## Verification

Commands: `npm test`, `npm run i18n:check`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm audit`, `npm run test:e2e`, `npm run test:crawl`, and `npx playwright test --config playwright.missing-config.config.ts` (local only).

The responsive suite covers 25 routes/states at 320×568, 360×800, 390×844, 412×915, 430×932, 768×1024, 1024×1366, 1366×768 and 1440×900. It checks page/control/image overflow, image loading and dimensions, extreme measurable crop, private metadata, query-preserving language changes, keyboard-scrollable comparisons, account navigation, runtime/console errors and failed image responses. Viewport and full-page screenshots are generated and visually reviewed. Nested mobile navigation includes 320, 360, 390, 430 and 768 px.

Eight browser component tests mount the actual header with mocked profile data, Link/navigation dependencies and sign-out action. They cover client/expert navigation and sign-out dispatch at 320, 390, 430 and 1440 px. These do not assert real Supabase session success. Server-action tests cover registration validation and callback configuration, password handling, roles, blocked-account logout, recovery, missing configuration, profile persistence arguments and verification cookie propagation. PGlite tests execute existing migrations and the secured onboarding RPC, including Romanian preferences and client requirements persistence.

A first concurrent local run had temporary navigation/fetch timeouts. The isolated menu rerun and crawler passed; browser suites now run serially for stable screenshot-heavy verification. A test locator was also corrected to exclude Next.js's route announcer. The database test reads post-RPC results as the test owner, since PGlite does not supply Supabase's default table grants.

`npm audit` requires `NODE_USE_SYSTEM_CA=1` on this host; TLS validation remains enabled. Chromium was installed using the project-compatible Playwright installer.

## External verification limitation

No valid isolated Supabase project/email configuration is available in this checkout. An attempted second Next.js server against a loopback mock was rejected by automatic approval review, including after explicit user approval (reason: “blocked by policy”). A separate mocked header component test and server-action tests provide bounded evidence, but full registration → actual email confirmation → real session refresh → recovery email → password reset against Supabase remains unverified. The production audit is read-only and does not create accounts or send email. Do not describe full authentication integration or email delivery as proven.

Generated logs, screenshots, crawls and deployment evidence are kept in ignored `.task-work/` and `test-results/`. The release procedure is to verify local checks, push to `main`, confirm the GitHub/Vercel deployment SHA and success status, then rerun the public suite and crawl on the production alias. The final task response records the deployed SHA and exact final results.

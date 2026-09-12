# M Air Electro AI

Independent energy-equipment planning and editorial discovery for Romania / the EU. Public flows run without an account: calculate demand, compare equipment classes and documented product examples, then visit the external supplier. M Air holds no stock and processes no merchant checkout.

## Development and verification

Use Node.js 20.9+ and npm. Run npm ci, npm run dev. Run npm test, npm run i18n:check, npm run lint, npm run typecheck and npm run build. Browser tests: npm run start -- --port 3137, then npm run test:e2e. The local browser test configuration uses installed Microsoft Edge; set PLAYWRIGHT_CHANNEL=chromium with Playwright Chromium installed on CI. Set PLAYWRIGHT_BASE_URL to test a deployed site. Browser tests do not submit messages, place orders or mutate production data.

## Production configuration

NEXT_PUBLIC_SITE_URL should be the canonical deployed HTTPS origin. It defaults to https://m-air-electro-ai.vercel.app.

Set NEXT_PUBLIC_OPERATOR_NAME to the confirmed publisher identity. Set NEXT_PUBLIC_CONTACT_EMAIL to a mailbox the publisher monitors, and CONTACT_EMAIL_VERIFIED=true only after receiving a test message. An unverified invented mailbox is never shown; without verification the contact page links to the real project GitHub issue form, explicitly warning that messages are public. This fallback does not establish that a private privacy-contact channel is ready for an affiliate application.

## Affiliate status

No Renogy approval is claimed. Ordinary supplier links are the default. Do not enable tracking before approval.

After approval, set RENOGY_AFFILIATE_APPROVED=true, AFFILIATE_TRACKING_ENABLED=true and RENOGY_IMPACT_LINKS_JSON to a JSON object mapping each exact catalog productUrl to its approved HTTPS Impact URL. Use URLs provided by the program, never guessed IDs. Invalid or unmapped URLs fail closed to ordinary links. The same configuration updates visible disclosure text and marks tracked links. Redeploy after environment changes. Review the approved program’s privacy/consent obligations before activation. No affiliate pixel is included. Amazon/eBay are future adapters, disabled unless their own approval flag and the global tracking flag are both true; no products use them at launch.

## Calculations

Finder: load × duration / 0.80 usable discharge / 0.92 inverter efficiency. Inverter continuous reserve 25%; surge reserve 10%; ratings round upward to 100 W. Solar uses an explicit 3.5-equivalent-sun-hour scenario and 0.80 derating, not a Romanian yield forecast.

Backup: sum watts × quantity × each appliance’s runtime capped at overall backup duration. Disabled items do not contribute. Nominal battery energy uses editable inverter efficiency and usable discharge. Simultaneous starting is conservative. Marketplace shows transferred criteria without pretending all examples satisfy them.

## Optional services and database

Supabase auth/documents and the optional AI API retain their architecture. Public commercial pages do not need database queries. The assistant redirects to the planner when its provider is unconfigured. Unfinished alerts, paid plans, comparison demos and unverified expert listings redirect to completed public tools/contact.

The migrations 20260912000000_secure_onboarding.sql and 20260912000001_ai_request_quota.sql were applied transactionally through the production SQL editor on 2026-09-12. Verified: legacy onboarding RPC denied; anonymous quota execution denied; authenticated direct quota-table writes denied; RLS enabled; blocked-account guard present. The existing database has no Supabase CLI migration-history table. Do not blindly replay migrations; baseline/repair history before introducing CLI deployment. PGlite tests cover the actual migration SQL and database permissions using an isolated fixture.

## Content policy

Five named Renogy EU product examples and six equipment-class guides. Technical illustrations are original SVGs. No copied merchant images, fabricated offers, reviews, stock, ratings or certifications. Product pages link to reviewed manufacturer sources. Site results are preliminary; final selection and installation require qualified review.

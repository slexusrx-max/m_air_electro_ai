# Production environment — M Air Electro AI

The official product is marketplace-first equipment discovery for Romania/EU. Public browsing, search, comparison and deterministic tools work without third-party account credentials.

| Variable | Purpose | Missing behavior |
| --- | --- | --- |
| NEXT_PUBLIC_SITE_URL | Canonical production origin | Falls back to https://m-air-electro-ai.vercel.app |
| NEXT_PUBLIC_CONTACT_EMAIL | Owner-provided working mailbox | Contact uses existing public GitHub issues |
| RENOGY_AFFILIATE_APPROVED | Explicit written approval; must be true to activate tracking | Ordinary supplier links |
| RENOGY_IMPACT_URL_TEMPLATE | Actual Impact-issued HTTPS deep-link template containing {url} | Ordinary supplier links |
| NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Optional account/session/document services | Public marketplace remains usable; account features unavailable |
| SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY | Optional server administration | No privileged account operations |
| AI_PROVIDER / OPENAI_API_KEY / OPENAI_MODEL | Optional real AI assistance | Explicit unavailable state; no simulated AI answer |
| UKRPOSHTA_ADDRESS_API_TOKEN | Retained specialized Ukrainian address lookup | No verified-address claim |
| NEXT_PUBLIC_MAP_STYLE_URL | Retained specialized map rendering | Controlled fallback |
| Payment provider variables | Reserved integration boundaries | No product checkout or active fulfilment service |

Never commit credentials. No tracking identifier, Impact account, site-verification tag or submitted application is evidence of affiliate approval. The prior RENOGY_AFFILIATE_ID ref-parameter convention is obsolete and is not used. Update public disclosure and test the actual approved tracking link when activating the program.

## Deployment and verification

1. Use npm ci and the committed lockfile. Run unit, i18n, lint, typecheck, build and audit checks.
2. Start the built site, run Playwright and the homepage-started crawler; inspect screenshots at all required widths.
3. Commit and push to main. Confirm Vercel deploys that commit and wait for ready status.
4. Set TEST_BASE_URL=https://m-air-electro-ai.vercel.app and rerun browser tests and crawl.
5. Check default Romanian, English switching, suppliers/disclosure, canonical origin, sitemap, legacy redirects, 404 and absence of overflow/runtime errors.
6. Record actual deployment commit and results in the delivery report. Do not infer production success from local checks.

## Specialized retained modules

Ukrainian energy/address adapters, map datasets and optional AI/document/account features remain outside the commercial navigation. To test the address integration separately, /api/address?mode=status reports whether credentials are configured. That endpoint is not a commercial launch prerequisite. Demonstration energy datasets must never be represented as live operational status.

## External dependencies

Written affiliate approval and provider-issued attribution, optional feed/asset permissions, real expert verification, owner/legal-entity details, confirmed contact channel, provider retention policies and production legal review remain external responsibilities. Vercel environment values should be changed only within their intended feature scope.

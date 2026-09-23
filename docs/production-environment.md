# Production environment — M Air Electro AI

The official product is marketplace-first equipment discovery for Romania/EU. Public browsing, search, comparison and deterministic tools work without third-party account credentials.

| Variable | Purpose | Missing behavior |
| --- | --- | --- |
| NEXT_PUBLIC_SITE_URL | Canonical production origin | Falls back to https://mairelectroai.com |
| NEXT_PUBLIC_CONTACT_EMAIL | Owner-provided working mailbox | Contact uses existing public GitHub issues |
| RENOGY_AFFILIATE_APPROVED | Explicit written approval; must be true to activate tracking | Ordinary supplier links |
| AFFILIATE_TRACKING_ENABLED | Explicit tracking activation flag, in addition to approval | Ordinary supplier links |
| CONTACT_EMAIL_VERIFIED | Verify the mailbox before showing it publicly | GitHub contact |
| Publisher identity in lib/site.ts | Stanislav Zavizion, individual / independent publisher; Romania / EU | Authoritative owner-confirmed repository configuration; no company env override |
| RENOGY_IMPACT_LINKS_JSON | JSON mapping of exact supplier URLs to approved HTTPS links | Ordinary supplier links |
| NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Optional account/session/document services | Public marketplace remains usable; account features unavailable |
| SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY | Optional server administration | No privileged account operations |
| AI_PROVIDER / OPENAI_API_KEY / OPENAI_MODEL | Optional real AI assistance | Explicit unavailable state; no simulated AI answer |
| NEXT_PUBLIC_MAP_STYLE_URL | Retained specialized map rendering | Controlled fallback |
| Payment provider variables | Reserved integration boundaries | No product checkout or active fulfilment service |

Never commit credentials. No tracking identifier, Impact account, site-verification tag or submitted application is evidence of affiliate approval. The prior RENOGY_AFFILIATE_ID ref-parameter convention is obsolete and is not used. Update public disclosure and test the actual approved tracking link when activating the program.

`NEXT_PUBLIC_OPERATOR_NAME` is no longer read: it must not override the verified individual identity with an old company placeholder. `NEXT_PUBLIC_EDITOR_NAME/BIO/EXPERTISE/PROFILE` remain optional and unset until separately confirmed. Planned mailbox addresses in `lib/site.ts` are distinct from operational `contactEmail/partnershipsEmail/privacyEmail`; the latter stay absent without explicit mailbox environment values and verification. `.env.example` prepares all three official addresses but leaves verification and sending false. No actual Vercel secret, mailbox or email delivery has been configured by editing this example.

## Deployment and verification

1. Use npm ci and the committed lockfile. Run unit, i18n, lint, typecheck, build and audit checks.
2. Start the built site, run Playwright and the homepage-started crawler; inspect screenshots at all required widths.
3. Commit and push to main. Confirm Vercel deploys that commit and wait for ready status.
4. Set TEST_BASE_URL=https://mairelectroai.com and rerun browser tests and crawl.
5. Check default Romanian, English switching, suppliers/disclosure, canonical origin, sitemap, legacy redirects, 404 and absence of overflow/runtime errors.
6. Record actual deployment commit and results in the delivery report. Do not infer production success from local checks.

## Specialized retained modules

Ukrainian energy adapters, map datasets and optional AI/document/account features remain outside the commercial navigation. Address and shipping endpoints were removed; they are not part of the current site. Demonstration energy datasets must never be represented as live operational status.

## External dependencies

Official mailbox configuration after creation and verification: `NEXT_PUBLIC_CONTACT_EMAIL=contact@mairelectroai.com`, `NEXT_PUBLIC_PARTNERSHIPS_EMAIL=partnerships@mairelectroai.com`, `NEXT_PUBLIC_PRIVACY_EMAIL=privacy@mairelectroai.com`, `CONTACT_EMAIL_VERIFIED=true`. Form delivery additionally requires `CONTACT_FROM_EMAIL`, `RESEND_API_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` and `CONTACT_FORM_ENABLED=true`. Keep the form disabled until the sender domain, exact challenge hostname, privacy disclosures and receipt are verified. See `custom-domain-and-publisher.md` for owner-confirmed identity/editorial fields.

Written affiliate approval and provider-issued attribution, optional feed/asset permissions, real expert verification, owner/legal-entity details, confirmed contact channel, provider retention policies and production legal review remain external responsibilities. Vercel environment values should be changed only within their intended feature scope.

# Production environment — M Air Electro AI

Configuration reference updated 1 October 2026. The sole current release/contact status is [AFFILIATE_APPLICATION_READINESS.md](../AFFILIATE_APPLICATION_READINESS.md). Public browsing, search, comparison and deterministic tools do not require account, AI or payment credentials.

| Variable | Production purpose/value | Missing behavior |
| --- | --- | --- |
| NEXT_PUBLIC_SITE_URL | `https://mairelectroai.com` | Official apex is the safe default |
| NEXT_PUBLIC_CONTACT_EMAIL | `contact@mairelectroai.com` | Public confirmed address remains visible; operational config absent |
| NEXT_PUBLIC_PARTNERSHIPS_EMAIL | `partnerships@mairelectroai.com` | Public confirmed partnership route remains visible |
| NEXT_PUBLIC_PRIVACY_EMAIL | `privacy@mairelectroai.com` | Public confirmed privacy route remains visible |
| CONTACT_EMAIL_VERIFIED | `true`, reflecting confirmed inbound routing | Operational mailbox values fail closed |
| CONTACT_FORM_ENABLED | `true` for configured production; controlled receipt verification is separate | Form unavailable; email links work |
| CONTACT_FROM_EMAIL / BREVO_SMTP_LOGIN / BREVO_SMTP_KEY | Verified same-domain sender / SMTP login / SMTP secret | Form unavailable |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY / TURNSTILE_SECRET_KEY | Optional contact challenge / secret | Form unavailable |
| RENOGY_AFFILIATE_APPROVED | `false` until real approval | Ordinary supplier links |
| AFFILIATE_TRACKING_ENABLED | `false` until approved activation | Ordinary supplier links |
| RENOGY_IMPACT_LINKS_JSON | Exact supplier URL → approved HTTPS mapping | Ordinary supplier links |
| NEXT_PUBLIC_PLAUSIBLE_DOMAIN | Optional intentional analytics configuration | No analytics events |
| NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Optional account/session/document services | Public marketplace usable; accounts unavailable |
| SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY | Optional server administration | No privileged account operations |
| AI_PROVIDER / OPENAI_API_KEY / OPENAI_MODEL | Optional AI assistance | Explicit unavailable state; no simulated answer |
| NEXT_PUBLIC_MAP_STYLE_URL | Retained specialized map rendering | Controlled fallback |
| Payment variables | Reserved integration boundaries | No equipment checkout |

## Email state and safety boundaries

Cloudflare routing is active for all three addresses. The owner confirmed real inbound receipt at `contact@mairelectroai.com`; separate receipt tests for partnerships/privacy are not asserted. Brevo SMTP is implemented for website delivery. Supabase auth-email receipt was separately verified on 30 September; this does not prove website-form receipt. See the readiness report for current test evidence.

Public domain constants in `lib/site.ts` are owner-confirmed facts. Operational fields require explicit environment values and `CONTACT_EMAIL_VERIFIED=true`, with same-canonical-domain validation. Public email links do not bypass the independent form gate. The form requires the sender, Brevo SMTP credentials and Turnstile values plus `CONTACT_FORM_ENABLED=true`. Enable only for a controlled authorized test after configuration; retain it for public use only with successful validation. API acceptance is not inbox receipt.

Maintain the documented production values and keep secret values server-only. Do not print secrets or overwrite unrelated variables. Rebuild/redeploy after public environment changes; `.env.example` is documentation, not a live update.

## Publisher and affiliate state

Stanislav Zavizion is the owner-confirmed individual publisher in Romania for Romania / EU. There is no company override: `NEXT_PUBLIC_OPERATOR_NAME` is ignored. Optional `NEXT_PUBLIC_EDITOR_NAME/BIO/EXPERTISE/PROFILE` stay unset unless separately confirmed. Ownership is not authorship, a credential or human review.

Never commit credentials. No tracking identifier, Impact account, site-verification tag or submitted application proves affiliate approval. Both affiliate flags and valid provider-issued mappings are required for activation. The obsolete `RENOGY_AFFILIATE_ID` ref-parameter convention is unused. Update disclosure and verify approved links at activation.

## Deployment and verification

1. Use the committed lockfile; run unit tests, i18n, lint, typecheck, build and audit.
2. Run Playwright and the homepage-started crawler; inspect required desktop/mobile widths.
3. Commit/push and confirm the Vercel deployment commit equals GitHub main.
4. Rerun browser checks and crawl with `TEST_BASE_URL=https://mairelectroai.com`.
5. Verify Romanian/English, domain email links, the expected enabled/disabled form state, supplier disclosure, canonical/sitemap, redirects and no overflow/runtime errors.
6. Record deployment/results in [AFFILIATE_APPLICATION_READINESS.md](../AFFILIATE_APPLICATION_READINESS.md). Do not infer public success from localhost.

Read-only QA must not create accounts, submit messages or place orders. Mock-only form tests verify software behavior, not real receipt.

## Retained modules and external decisions

Ukrainian energy adapters, demonstration datasets and optional AI/document/account capabilities remain outside primary commercial navigation. Demonstration data is never live operational status. Renogy approval, approved asset/feed rights, professional onboarding and optional outbound/form activation remain distinct steps. The official domain, publisher identity and inbound contact routing are confirmed.

See [domain and publisher operations](custom-domain-and-publisher.md) for optional form activation, truthful editorial records, analytics and Google Search Console steps.

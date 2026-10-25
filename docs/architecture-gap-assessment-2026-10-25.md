# Architecture gap assessment — 25 October 2026

## Scope and evidence boundary

Assessed source/production baseline: `4d57f0997dd6adec14435c739327f21dda1e532d` (PR27). Last verified production deployment: `dpl_6j9NRBPqFbLbbyP9GZJiCwutDXMZ`, READY on mairelectroai.com. This assessment changes documentation only; it is not a new backend certification or an infrastructure penetration test.

Reference: **M_Air_Electro_AI_Architecture_Blueprint_RU.docx**, Library `libfile_742d1d10413c8191bf524a41d084f86f`, 31 pages, created 2026-10-25. Read through the supported Library text API, including acceptance criteria A01–C12 on pages 23–25. No guessed local copy or hidden session logs were used. Repository direction remains [PROJECT_BLUEPRINT.md](../PROJECT_BLUEPRINT.md).

Status vocabulary: **implemented** = the stated bounded mechanism exists with evidence; **partial** = useful implementation exists but the full blueprint criterion is not established; **missing** = inspected architecture lacks the mechanism; **not applicable** = outside the active commercial model; **blocked** = external evidence/authority is required. These are not the blueprint's blanket Passed/Failed labels. A partial criterion is not automatically a release blocker.

The active model is independent affiliate discovery plus contact leads. There is no local equipment checkout, stock reservation or order/payment operation. Adding a cart, payment processor or seller settlement system would expand the business model and is not a readiness fix.

## Architecture matrix

| Area | Status | Exact source evidence and practical limit |
|---|---|---|
| Modular application | Implemented, bounded | Next.js application with `lib/affiliate`, `lib/marketplace`, `lib/supabase` and API route boundaries. [Reserved marketplace services](../lib/server/marketplace.ts) explicitly return `protectionFlowReady: false`; interfaces are not completed transaction infrastructure. |
| Product → Variant → Offer | Partial | [CatalogProduct](../lib/affiliate/types.ts) combines product, merchant, URL, availability and price fields. Reviewed Renogy variants and separate parent data preserve distinctions, but there are no independent persisted Variant/Offer entities or multi-offer reconciliation. [Current counts](../README.md) distinguish 41 canonical records from 72 parent pages. Do not claim PostgreSQL is the catalog source of truth. |
| Import provenance | Partial | [Photo provenance](product-photo-provenance-2026-10-18.json), [Waterdrop classification](waterdrop-feed-classification-2026-10-25.json), [Renogy photo manifest](../data/renogy-parent-photos.json) and reviewed source data preserve associations. Manual source snapshots/hashes and Git review exist. No scheduled importer, run-state database, quarantine or transactional promotion pipeline was found. |
| Freshness and overrides | Partial | [Catalog types](../lib/affiliate/types.ts) have `lastUpdated` and explicit unavailable state; K19H is archived. Dates indicate a source review, not continuously observed stock. Static committed data survives feed outages, but no automatic freshness SLA/alert exists. A future importer must preserve manual blocks and last-known-safe data. |
| Supplier destinations | Partial | [suppliers.ts](../lib/affiliate/suppliers.ts) validates exact merchant origins and reviewed paths/variant queries. [Renogy policy](../lib/affiliate/renogy-policy.ts) validates tracking origins and exact explicit `u` targets. [Waterdrop provider](../lib/affiliate/providers/waterdrop.ts) uses exact reviewed mappings plus trusted environment overrides, but [generic tracking resolver](../lib/affiliate/tracking.ts) accepts other well-formed HTTPS override hosts. This is a configuration validation gap, not evidence of an attacker-controlled redirect or broken current links. No arbitrary public `/go?url=` route was found. |
| Search | Implemented at current scale | [query.ts](../lib/marketplace/query.ts) normalizes filters; [search.ts](../lib/marketplace/search.ts) builds an in-memory content index and bounds query length. Linear scans and unpaginated results are reasonable for the current catalog, not evidence of large-catalog capacity. Adopt pagination/benchmarks before a substantial expansion; no external search service is needed now. |
| Consent-aware measurement | Partial operationally | [analytics.ts](../lib/analytics.ts) requires current accepted consent, respects DNT/GPC, excludes automation/private paths and strips queries/referrers/visitor identifiers from payloads. [tests](../tests/affiliate-readiness.test.mjs) cover blocked and allowed cases. Production Plausible activation/receipt was not freshly verified in this assessment; earlier baseline was unconfigured. Code presence is not a working dashboard. |
| Admin/object access | Partial verification | [Supabase auth](../lib/supabase/auth.ts), [admin page](../app/%28protected%29/admin/page.tsx), [projects API](../app/api/projects/route.ts) enforce server identity/role/ownership. [Project RLS migration](../supabase/migrations/20261018000000_equipment_projects.sql), its pending-profile follow-up, and [database tests](../tests/equipment-projects.test.mjs) cover private planning records. Live deployment of every migration and a fresh multi-account negative audit were not verified here. Admin is not a catalog management console. |
| Contact acceptance | Implemented, bounded | [contact.ts](../lib/contact.ts), [form](../components/contact-form.tsx) and [outcome report](contact-outcome-safety-2026-10-25.md): origin/body/input/consent/honeypot/Turnstile checks, required STARTTLS, finite timeouts, safe reference, definite versus uncertain response and no blind retry. SMTP acceptance is not inbox delivery. |
| Durable leads / delivery status | Missing | No Lead+Outbox persistence, idempotency record or delivered/bounced event ledger in the contact path. The reference correlates a request; it does not provide durable deduplication. Browser-preserved fields reduce loss but do not guarantee recovery after tab/device loss. |
| Error monitoring | Partial | [error boundary](../app/error.tsx), [global boundary](../app/global-error.tsx) and safe API statuses exist. No application exception reporting integration, demonstrated alert receipt, on-call escalation or tested incident runbook was established. Platform logs are not proof of monitored alerts. |
| Security configuration | Partial | [next.config.ts](../next.config.ts) sets frame denial, nosniff, permissions policy and CSP. CSP still allows inline scripts and broad HTTPS connections/images; it is not a strict nonce policy. This is a documented hardening tradeoff, not an observed exploit. No secret values were read; production/preview secret isolation is unverified. |
| CI and release | Partial | [package.json](../package.json) exposes lint/types/unit/browser/crawl checks; [PR27 evidence](filter-reset-sync-2026-10-25.md) records local checks and live smoke. No tracked `.github` workflow enforces the full local suite. Observed Vercel build/preview checks do not prove unit/a11y checks are required for every contributor. |
| Rollback / restore | Partial / blocked | Git commits and prior READY Vercel deployments identify rollback candidates. A release can be reverted without rewriting history. No actual rollback drill, database restore, measured RPO/RTO or backup-retention inspection was performed. Frontend rollback does not roll back database changes. |

## Blueprint acceptance crosswalk

| ID | Status | Evidence or missing proof |
|---|---|---|
| A01 | Partial | Merchant/provider/link status is represented in CatalogProduct and provider configuration; no independent Offer.mode entity. Affiliate role is explicit in the product blueprint. |
| A02 | Implemented | Merchant CTA flow; no local equipment checkout/order. Tests inspect hrefs without generating tracking clicks. |
| A03 | Partial | Renogy Romania eligibility confirmed; Waterdrop RO delivery remains unverified; PECRON/BLUETTI ordinary listings. Approval, shipping and tracking must remain separate. |
| A04 | Partial | Media provenance manifests exist; no blanket license/legal certification for every published asset is asserted. |
| A05 | Partial | Unknown prices/stock are not filled in; archived K19H is unavailable. Continuous stock/freshness checks are absent. |
| A06 | Partial | Shared route/category sources and broad route checks exist; not every breadcrumb is proven to derive from a single registry. |
| A07 | Partial | Stable canonical IDs/URLs and parent separation; no relational Product/Variant/Offer uniqueness constraints or SQL catalog deduplication. |
| A08 | Implemented | [Count audit](disclosure-feed-accuracy-2026-10-25.md): 72 extra parents = 186 rows = 31 summaries + 114 variants + 41 single options; 155 options. Waterdrop 32 rows are not 32 devices. |
| A09 | Partial | Normalized facets and bounded calculator tests; unit sanity samples do not certify every engineering formula. |
| A10 | Partial | Exact canonical images and 66 visually inspected representative parent images; six omitted with reasons. Parent photos do not certify a selected bundle quantity. |
| A11 | Implemented, bounded | Comparison uses documented values/unknown states and family-specific rows; it does not certify compatibility or installation safety. |
| A12 | Partial | Mobile/desktop menu, keyboard, comparison and filter tests passed. Not a complete assistive-technology audit; no new real form submit. |
| B01 | Blocked | Server-only boundaries inspected, but no new bundle secret scan or production/preview variable-scope audit. Never disclose values to close this item. |
| B02 | Partial | Server role/ownership and RLS source/tests exist; production multi-account adversarial verification outstanding. |
| B03 | Partial | Merchant and Renogy tracking allowlists exist; Waterdrop trusted override host validation is weaker. No arbitrary destination endpoint found. |
| B04 | Partial | [Supplier audit](../scripts/audit-suppliers.ts) validates each redirect before following; this is not an upload/import SSRF sandbox. No general ingestion service exists. |
| B05 | Not applicable | No active payment/affiliate webhook ingestion. Signature/replay processing is required before introducing one. |
| B06 | Not applicable | No local equipment payment; no payment implementation should be added for affiliate readiness. |
| B07 | Partial | Raw evidence/hash/review records exist; no automatic run IDs/quarantine workflow. |
| B08 | Missing | No automated import idempotency/manual-lock persistence contract. Current changes use explicit Git review instead. |
| B09 | Partial | Committed catalog is unaffected by feed failure; no scheduled feed failure alert exists. |
| B10 | Partial | Routing, network clicks, actions and payout are explicitly distinguished in reports; no network reconciliation ledger. |
| B11 | Missing | Contact transport has truthful uncertainty but no durable Lead+Outbox. |
| B12 | Partial | Coordinating source audit reported a 25 October contact enquiry currently in INBOX with authentication passing, and historical partnerships inbound evidence. This assessment did not repeat sending or inspect personal mail; no full bounce/reply/event chain is certified. |
| C01 | Partial | Owner/publisher and affiliate role documented; legal/tax professional review is outside this source audit. |
| C02 | Not applicable | No direct sale. Merchant terms govern merchant checkout; future local checkout requires its own review. |
| C03 | Blocked | Technical data minimization exists; approved data-flow/retention/processor agreement inventory is not established by source inspection. |
| C04 | Partial | Consent guards and mocked tests exist; fresh real-service network receipt/withdrawal proof not collected. |
| C05 | Partial | Source/photo review records exist; cannot infer complete rights/certification review from image association. |
| C06 | Partial | Existing canonical/hreflang/sitemap/JSON-LD checks and truthful unknown offers; sampled results are not all-content certification. |
| C07 | Blocked | Separate preview deployments exist; preview production-credential isolation and prevention of real side effects need authorized configuration evidence. |
| C08 | Partial | PR/local suites/Vercel/live smoke recorded; mandatory full-suite CI and exercised rollback remain gaps. |
| C09 | Missing | No demonstrated alert-to-owner/runbook/closure exercise. |
| C10 | Blocked | No isolated backup restore or measured RPO/RTO evidence. |
| C11 | Partial | Public contact owner/channel exists; no durable queue, backup operator or tested escalation policy. |
| C12 | Partial | No fictitious sales/revenue metric; analytics events are separate from commission. Currency-aware payout reconciliation is absent. |

## Prioritized decisions and safe follow-up

1. **Waterdrop override validation (engineering, bounded):** validate the documented issued tracking origin and explicit destination, preserving every approved existing URL. Add negative host/port/credentials/ambiguous-target fixtures and all-issued-link regression coverage before a release. No current misrouting was observed; do not disable valid links or change gates based on this finding alone.
2. **Durable contact intake (owner + engineering):** choose retention/access/deletion policy and an existing authorized persistence target before storing personal lead data. Then add idempotent intake/outbox, status distinction and failure fixtures. Do not silently add a paid queue/service or repeatedly submit the live form.
3. **Required verification (engineering/repository owner):** establish a reproducible CI baseline and branch protection expectations using existing infrastructure. Before changing CI, confirm repository plan/minutes/permissions and ensure tests use fixtures rather than production secrets or external tracking.
4. **Operational evidence (owner/platform):** read-only confirmation of environment separation, monitoring ownership and backup policy; schedule an authorized isolated restore/drill. A missing report is not proof backups are absent.
5. **Catalog evolution (engineering, when needed):** keep static reviewed data now. Before automated or substantially larger imports, define Product/Variant/Offer identities, provenance records, manual locks, stale policy and transactional promotion. Benchmark existing search before selecting infrastructure.

No speculative enterprise service, business-model change, credential creation or security-setting change is justified by this assessment. No production code was changed in this batch. The reviewed Waterdrop configuration gap is a follow-up candidate, not a claim of exploited vulnerability. Production stability is preserved.

## Verification record

Existing release evidence: PR27 local 125 unit tests, lint, types, build, eight local and eight production UI checks; [release report](filter-reset-sync-2026-10-25.md). Subsequent read-only readiness audit covered 32 page/viewport checks, 202 unique internal paths (all 200), selected 360/390px energy flows, all nine calculator families in RO/EN, synthetic unit sanity, 35 model photos and six ordinary pending-programme CTAs. These results were collected against the baseline above, not rerun or presented as new backend tests here.

Local audit artifacts remain in ignored `.task-work/readiness-matrix-2026-10-25.md`, `broad-readiness.json`, `energy-mobile-readiness.json`, `calculator-unit-sanity.json`, `model-photo-audit.json`, and `pending-programme-ctas.json`. They are supporting local evidence, not public repository attachments. This documentation batch checks referenced repository paths and diff hygiene only. No affiliate tracking traversal, CAPTCHA, mail submission, order, purchase, env modification or database mutation occurred.

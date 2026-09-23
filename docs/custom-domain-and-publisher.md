# Custom domain, publisher and contact setup

No domain, mailbox or person is invented by the application. Blank values keep private contact unavailable. Do not enable the form before legal/publisher information and actual mailboxes are ready.

1. Add the owned apex and www domain to the existing Vercel project under Settings → Domains. Use the DNS values shown for that project, preserving MX/SPF/DKIM/DMARC and other existing records. Verify ownership, successful TLS issuance and HTTPS behavior. Choose one primary hostname and redirect the other to it.
2. Set `NEXT_PUBLIC_SITE_URL=https://mairelectroai.com`, without a path/query. It is the single source for canonical, OG, sitemap, robots, JSON-LD and contact origin checking. The official domain is the default; `www.mairelectroai.com` and the old Vercel production alias are normalized to it. Local-origin contact tests require an explicit `http://localhost:3100` override. Rebuild after public env changes.
3. After the custom host works, configure the old project alias redirect in Vercel and verify a deep path/query survives. Verify auth provider Site URL and redirect allowlists for the new domain; retain necessary recovery callback paths. Never migrate DNS based on guessed values.
4. Create and verify `contact@mairelectroai.com`, `partnerships@mairelectroai.com`, `privacy@mairelectroai.com`. Set `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_PARTNERSHIPS_EMAIL`, `NEXT_PUBLIC_PRIVACY_EMAIL` to those values, then `CONTACT_EMAIL_VERIFIED=true`. The app accepts verified mailboxes only on the canonical custom host. These examples are setup instructions, not claims that the mailboxes already exist.
5. Supply real `NEXT_PUBLIC_OPERATOR_NAME`, `NEXT_PUBLIC_EDITOR_NAME`, `NEXT_PUBLIC_EDITOR_BIO`, `NEXT_PUBLIC_EDITOR_EXPERTISE`, optional HTTPS `NEXT_PUBLIC_EDITOR_PROFILE`. These are public. Do not place credentials in public variables. All trust/legal pages share these fields.
6. For private contact, verify the sending domain with Resend, configure `CONTACT_FROM_EMAIL` on the same domain and secret `RESEND_API_KEY`. Create Cloudflare Turnstile keys restricted to the exact canonical hostname; configure public `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and secret `TURNSTILE_SECRET_KEY`. The server requires the `contact` action and matching hostname, limits the request body, checks origin/consent and validates a single-use challenge. Add a deployment WAF rate limit for `/api/contact` as defense in depth. Review provider processing agreements, transfers, retention and mailbox access controls. Set `CONTACT_FORM_ENABLED=true` only after these steps.
7. The form forwards a plain-text message only to the operator's fixed contact mailbox; it does not send autoresponses or store a message database. A successful API result means accepted for delivery, not confirmed receipt. Delivery and inbox verification are owner tasks and were NOT performed during this audit because no emails/forms may be sent.
8. Fill per-page records in `lib/marketplace/editorial-records.json`, keyed by canonical pathname, using real `author`, `published`, `reviewed`, `evidence`, and optional `corrections: [{date, reason}]`. `author: "owner"` resolves to the configured editor only after the editor accepts attribution. Use ISO dates from actual publication/review records. Do not use git timestamps as a substitute. Each existing guide, solution, comparison and equipment-class article needs explicit approval. Record original source/manual revision and precise verified fields with the review evidence.

## Analytics: collect 30–60 days of real evidence

Create a Plausible site for the real hostname and set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. Keep it blank in local/preview/QA builds. Tracking uses the Events API directly from the visitor browser only after explicit consent, preserving real UA/IP handling. No account pages, queries, referrers, form fields or calculation values are submitted. Automated browsers, localhost, mismatched hosts and Do Not Track are excluded. Consent expires after 180 days; settings allow refusal/withdrawal. Cross-tab changes apply to subsequent events. No tracking script is installed.

Create exactly these custom goals: `outbound_click`, `calculator_complete`, `comparison_view`. Outbound means a real HTTPS external-link click (not necessarily a purchase); comparison means a displayed valid 2–4-item table. The finder counts a successful calculation action; live calculators count a valid changed result after a 1.2-second editing pause, not the default example. These are usage signals, not sales.

Exclude owner/manual QA traffic using provider exclusions; automated tests never populate a live property. Obtain consent before measurement. Collect 30–60 consecutive days, then export date range, users/visits, country distribution, acquisition mix, relevant content and goal counts. Explain consent/ad-blocker limitations and sample size. Publish only reviewed exports in the media kit; no fake baseline, zeros or projected reach. With no verified export, the page says “Data being collected” and explicitly says no audience report is published. This phrase is not proof that analytics has been activated.

## Sources checked for implementation

- [Vercel domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Cloudflare server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Resend email endpoint](https://resend.com/docs/api-reference/emails/send-email)
- [Plausible Events API](https://plausible.io/docs/events-api) and [custom goals](https://plausible.io/docs/custom-event-goals)
- [EU online privacy guidance](https://europa.eu/youreurope/business/growing/digitalising/online-privacy/index_en.htm)

The owner must confirm the actual processing inventory, controller identity, retention, lawful basis and required legal details with an appropriate adviser. A template is not legal sign-off.

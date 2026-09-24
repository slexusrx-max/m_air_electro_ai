# Domain, publisher and contact operations

Current facts: 24 September 2026. Application status and release evidence live in [AFFILIATE_APPLICATION_READINESS.md](../AFFILIATE_APPLICATION_READINESS.md).

## Completed and owner-confirmed

- Official public origin: `https://mairelectroai.com`; `www.mairelectroai.com` permanently redirects to the apex.
- Stanislav Zavizion owns and publishes M Air Electro AI as an individual / independent publisher in Romania, serving Romania / European Union. There is no incorporated company. No private address, corporate registration or unconfirmed credentials are published.
- Cloudflare Email Routing is active for `contact@mairelectroai.com`, `partnerships@mairelectroai.com` and `privacy@mairelectroai.com`. Routes forward to the owner's verified Google-hosted inbox.
- The owner performed a real external inbound test to `contact@mairelectroai.com` and confirmed receipt. Separate receipt tests for partnerships/privacy are not asserted.
- Outbound send-as/SMTP and website-form delivery are **not verified**. Inbound forwarding does not provide outbound sending infrastructure.

## Production configuration

Set only these four contact values; leave unrelated environment values unchanged:

```dotenv
NEXT_PUBLIC_CONTACT_EMAIL=contact@mairelectroai.com
NEXT_PUBLIC_PARTNERSHIPS_EMAIL=partnerships@mairelectroai.com
NEXT_PUBLIC_PRIVACY_EMAIL=privacy@mairelectroai.com
CONTACT_EMAIL_VERIFIED=true
```

Keep `NEXT_PUBLIC_SITE_URL=https://mairelectroai.com` and `CONTACT_FORM_ENABLED=false`. Public variables are bundled at build time: deploy again after changing them and verify the deployed commit and actual production links. Editing `.env.example` alone does not update Vercel.

`lib/site.ts` holds owner-confirmed public domain addresses independently of sending configuration. Operational `contactEmail`, `partnershipsEmail` and `privacyEmail` fields still require explicit same-domain environment values plus `CONTACT_EMAIL_VERIFIED=true`. With missing environment values, public pages still show the confirmed domain contacts; the form cannot send.

Preserve existing DNS routing records when maintaining the site domain. Use only DNS values provided by the actual Vercel/Cloudflare project. Canonical, OG, sitemap, robots, JSON-LD and contact origin checking use the official apex. For isolated local-origin form tests, explicitly set `NEXT_PUBLIC_SITE_URL=http://localhost:3100`.

## Optional future website-form activation

1. Verify an outbound sender domain with Resend; configure same-domain `CONTACT_FROM_EMAIL` and secret `RESEND_API_KEY`.
2. Configure Cloudflare Turnstile with the exact canonical hostname, public `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and secret `TURNSTILE_SECRET_KEY`. The server checks the `contact` action, hostname, origin, input bounds, consent and honeypot.
3. Confirm actual provider processing arrangements, mailbox retention/access and privacy disclosure before enabling collection. Consider deployment rate limiting for `/api/contact`.
4. Perform an explicitly authorized end-to-end form/inbox test and verify delivery. Routine read-only QA must not send messages.
5. Only then set `CONTACT_FORM_ENABLED=true` and deploy. API acceptance alone is not proof of inbox receipt.

The form sends plain text to the fixed contact address; it does not send autoresponses or store a message database. While disabled, the page shows a compact unavailable notice with no editable form controls and loads no Turnstile script. Email links remain available.

## Editorial identity and evidence

Ownership does not assign authorship, review or technical qualifications. Optional `NEXT_PUBLIC_EDITOR_NAME`, `NEXT_PUBLIC_EDITOR_BIO`, `NEXT_PUBLIC_EDITOR_EXPERTISE` and HTTPS `NEXT_PUBLIC_EDITOR_PROFILE` stay unset unless independently confirmed.

Add only evidenced per-page records to `lib/marketplace/editorial-records.json`: `author`, `published`, `reviewed`, `evidence` and optional `corrections: [{date, reason}]`. Use `author: "owner"` only with confirmed attribution of that page. A git/deployment timestamp is not a human review date. Missing author/review fields are omitted from visible bylines and structured data; public methodology and AI disclosures explain source-based research and preliminary calculations. No human engineering sign-off is implied.

## Optional audience measurement

Plausible is optional. Keep `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` blank in local/preview/QA builds and until measurement is intentionally configured. Public privacy copy reflects whether it is configured. When enabled, events require explicit consent; settings allow withdrawal and consent expires after 180 days. Automated browsers, localhost, mismatched hosts and Do Not Track are excluded.

Events contain only the public route and action type, not queries, referrers, form data, private/account pages or calculation inputs. The browser sends events directly, so the provider processes its IP address and user agent. The goals are `outbound_click`, `calculator_complete` and `comparison_view`; these are usage signals, not sales.

Provide partners only real dated exports with the period, geography, traffic sources and consent/ad-blocker limitations. Exclude owner and QA traffic. No audience figures or collection claim is published without evidence. Historical traffic is not a technical prerequisite for applying; the program may separately request it.

## Google Search Console

Technical indexing readiness is separate from actual Google indexing. No Search Console verification is asserted. If not already configured: add a Domain property for `mairelectroai.com`, publish only the TXT value Google issues, verify ownership, submit `https://mairelectroai.com/sitemap.xml`, inspect the homepage and representative commercial URLs, request indexing where appropriate, and monitor Page indexing and sitemap reports. A successful sitemap response does not establish indexing.

## Reference documentation

- [Vercel domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/)
- [Cloudflare server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Resend email endpoint](https://resend.com/docs/api-reference/emails/send-email)
- [Plausible Events API](https://plausible.io/docs/events-api)

Operational privacy/retention and legally required disclosures must be based on actual arrangements. This configuration document does not constitute legal sign-off.

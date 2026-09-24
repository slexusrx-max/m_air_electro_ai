# Publisher identity and contact update

Current facts: 24 September 2026. This supersedes the prepared-mailbox/Gmail-first status. The sole current application status is in [AFFILIATE_APPLICATION_READINESS.md](../AFFILIATE_APPLICATION_READINESS.md).

## Publisher

M Air Electro AI is the brand/platform. Stanislav Zavizion is its individual owner and independent publisher, operating in Romania for Romania / European Union. No incorporated company, company number, VAT/tax identifier, office, residential address, employees, licenses or certifications are asserted.

`lib/site.ts` centralizes these facts. `NEXT_PUBLIC_OPERATOR_NAME` remains ignored so an obsolete deployment value cannot substitute a fictitious company. Shared publisher details appear on About, Contact, Privacy, Terms, Affiliate Disclosure, Partnerships, For Business, Experts, Methodology, Editorial Policy, Author Policy, Corrections Policy and AI Use Policy. The footer identifies the publisher across public commercial routes.

## Structured data and attribution

- The publisher is a `Person` at `https://mairelectroai.com/#publisher`.
- M Air Electro AI is a `Brand` and `WebSite`, with the Person as publisher.
- Article and TechArticle records use the same Person as publisher; root metadata names Stanislav Zavizion as publisher.
- Ownership does not assign authorship or human technical approval. Unsupported authors, biographies, reviewer credentials and review dates are omitted from public fields and JSON-LD.
- Sources, methodology, preliminary-calculation limits and AI-use disclosures remain. Public pages do not display internal incomplete-field placeholders or application checklists.

## Active domain contacts

The owner confirms Cloudflare Email Routing is active for:

| Public purpose | Address | Receipt evidence |
| --- | --- | --- |
| General enquiries and corrections | contact@mairelectroai.com | Owner confirmed a successful real external inbound test |
| Partnerships | partnerships@mairelectroai.com | Active route confirmed; no separate receipt test asserted |
| Privacy requests | privacy@mairelectroai.com | Active route confirmed; no separate receipt test asserted |

Routes forward to the owner's verified Google-hosted inbox. The destination Gmail address is no longer public brand contact. Privacy explains forwarding without exposing the destination address.

Public constants are `publicEmailAddresses`. Operational mailbox fields still require explicit same-domain environment values plus `CONTACT_EMAIL_VERIFIED=true`. That flag describes inbound configuration; it does not establish outbound send-as/SMTP or form delivery.

Production must set the three `NEXT_PUBLIC_*_EMAIL` values above and `CONTACT_EMAIL_VERIFIED=true`, then redeploy. `.env.example` reflects this state. `CONTACT_FORM_ENABLED=false` remains separate. Activation additionally requires sender configuration, Resend, Turnstile and an authorized delivery test. Until then, email links are working contact controls and the form section states that it is unavailable.

## Remaining optional or external steps

- Renogy / Impact application, eligibility and eventual approval; tracking stays disabled until real approval and provider-issued configuration.
- Outbound send-as/SMTP and optional website-form activation.
- Optional audience analytics and truthful dated reports, if required by a partner.
- Page-specific authorship/review evidence where a named byline or technical approval is claimed.
- Actual operational retention/provider arrangements and required legal advice; code tests do not establish legal sign-off.

The domain, publisher identity and inbound general contact are completed facts. Affiliate approval and optional form activation are not prerequisites for using the independent discovery site or submitting an application.

## Verification

Regression tests cover domain contacts, explicit operational mailbox gates, inbound/form separation, no fabricated publisher/author schema, RO/EN identity and dedicated partnership/privacy links. Browser checks verify no editable form controls or Turnstile script while disabled, and no Gmail-first or stale untested-inbound wording. Production evidence belongs in the readiness report.

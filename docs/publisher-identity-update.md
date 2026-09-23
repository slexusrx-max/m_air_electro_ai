# Owner / publisher identity update

Owner-supplied facts, 2026-09-23: M Air Electro AI is the brand/platform at https://mairelectroai.com. Stanislav Zavizion is the owner/publisher, operating in Romania as an individual / independent publisher, with commercial region Romania / European Union. There is currently no incorporated company behind the website. These are owner confirmations, not independent verification of professional credentials or legal compliance.

## 1. Public pages identifying the publisher

Detailed shared publisher identity is displayed in Romanian and English on `/about`, `/contact`, `/privacy`, `/terms`, `/affiliate-disclosure`, `/partnerships`, `/business`, `/experts`, `/methodology`, `/editorial-policy`, `/author-policy`, `/corrections-policy` and `/ai-use-policy`.

The shared public footer additionally identifies Stanislav Zavizion as individual publisher operating in Romania throughout the public marketplace, solutions, tools and learning pages. Its former Company heading is now About the platform. About and Terms name the owner in their opening text; Privacy includes an operator/publisher section; affiliate disclosure identifies the individual publisher as the possible future commission recipient, conditional on actual program approval.

## 2. Structured data and metadata

- Removed the M Air Electro AI `Organization` declaration.
- Added `Person` at `https://mairelectroai.com/#publisher`: `name=Stanislav Zavizion`, About URL, independent-publisher description and a reference to the brand. No address, nationality, job title, credentials, email, company identifiers or registration status is inferred.
- Added a separate `Brand` at `https://mairelectroai.com/#brand` with the platform name and official URL.
- `WebSite` at `https://mairelectroai.com/#website` retains the platform name/description/URL, declares RO/EN, and sets `publisher` to the Person reference.
- `TechArticle.publisher` now identifies the same Person rather than an Organization.
- Equipment-class `Article` removes the generic Organization author and identifies the Person as publisher. Real manufacturer Product/Brand data remains unchanged.
- Root metadata `publisher` is Stanislav Zavizion. Removed generic brand-as-author/creator metadata. Ownership does not assert authorship, qualifications or human review of any page. Per-page author/review records are unchanged and remain unconfirmed where no evidence exists.

Schema.org supports a [Person as publisher](https://schema.org/publisher) and distinguishes a [Brand](https://schema.org/Brand) from a legal organization. Use of this vocabulary does not promise search rich results or legal/affiliate acceptance.

## 3. Prepared email addresses

Follow-up, 2026-09-23: the owner explicitly supplied `slexusrx@gmail.com` for publication. It is centralized separately as `ownerContactEmail` and appears on the 13 shared publisher pages above. Contact, general policy, partnership and privacy links can use this owner-authorized address without asserting a delivery test. No physical address was supplied. The root structured data remains unchanged; no email delivery, domain provisioning or form readiness is inferred.

`contact@mairelectroai.com`, `partnerships@mairelectroai.com`, `privacy@mairelectroai.com` are explicitly prepared in `lib/site.ts` (`plannedEmailAddresses`) and `.env.example` (`NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_PARTNERSHIPS_EMAIL`, `NEXT_PUBLIC_PRIVACY_EMAIL`).

They are not asserted to be provisioned or delivery-tested. Operational `siteConfig.contactEmail/partnershipsEmail/privacyEmail` still require actual environment values plus `CONTACT_EMAIL_VERIFIED=true`. No planned default silently activates a mailbox. The example retains `CONTACT_EMAIL_VERIFIED=false` and `CONTACT_FORM_ENABLED=false`. Form sending also requires Resend/Turnstile and sender-domain configuration. This change does not create mailboxes, change live secrets, send emails or certify inbox delivery.

## 4. Remaining owner input

- Responsible human content-reviewer identity, biography, relevant expertise and optional verifiable professional profile. The publisher is not automatically assigned these separate roles.
- Actual per-page author attribution, publication/review dates, source verification and human approvals.
- Confirmation that all three mailboxes are provisioned, ownership verified and an authorized delivery/inbox test completed; sending provider, sender-domain and anti-abuse setup where the contact form is enabled.
- Actual processing/retention/provider arrangements and appropriate privacy/terms review. Known individual identity must not be replaced with invented corporate or residential details.
- Applicable Renogy EU / Impact campaign eligibility and any eventual approval/tracking configuration; genuine audience evidence when required. Identity confirmation does not establish affiliate approval.

Do not request or publish a residential address by default. Any later legally necessary disclosure must be separately established and explicitly discussed with the owner. No SRL, LLC, Ltd, VAT number, registration number, office, tax identifier, staff, license or certification is supplied or inferred in this update.

## 5. Invented or placeholder company information

No owner-company placeholder is retained in the updated public identity blocks or structured data. The obsolete `NEXT_PUBLIC_OPERATOR_NAME` override is ignored so a stale deployment value cannot replace the verified individual with a fictitious company. Unknown content-reviewer fields remain explicitly unconfirmed, not fabricated. Generic third-party company roles, supplier brand names and references to qualified installers are not claims that M Air Electro AI is incorporated, employs staff or holds licenses.

Regression tests check the individual identity, separation from author/reviewer roles, absent invented schema fields, mailbox verification gates, all public-route footers in RO/EN, detailed identity pages, metadata and no horizontal overflow. Follow the existing release checks and verify the actual production domain after deployment before claiming publication.

Impact readiness remains **NOT READY** for the unresolved operational/editorial/legal/program prerequisites above. The owner/publisher name, operating country and non-incorporated status are no longer missing prerequisites.

# Contact outcome safety - 25 October 2026

An SMTP timeout/socket failure can happen after DATA acceptance. The prior handler reported all exceptions as Message not sent, inviting duplicates. Explicit negative replies at known send stages remain definite failures; unknown transport and post-acceptance/QUIT errors return uncertain. SMTP acceptance remains distinct from inbox receipt.

Client requests have a 45-second bound. Unknown responses, lost connections and timeouts preserve fields, show an opaque UUID reference, and disable automatic/manual resubmission within the current form session. The synchronous in-flight guard prevents rapid duplicate submission. A validated reference is included in API outcome and email text for correlation; it contains no customer data and is not logged alongside PII. It is NOT durable idempotency or a delivery-status store; reloads are not claimed deduplicated.

Origin/content-type/body bounds, consent, mailbox validation, honeypot, Turnstile hostname/action/fresh token, verified sender and required STARTTLS are preserved. No real form or email test performed; parent independently confirmed an existing inbox message.

Validation: full unit suite and isolated browser fixtures cover explicit SMTP rejection, ambiguous DATA timeout, QUIT failure, server uncertain response and browser network loss. Mock Turnstile and mail transport only; no Cloudflare/SMTP calls. Final counts and release status in handoff.

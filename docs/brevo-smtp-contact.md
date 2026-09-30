# Brevo SMTP contact form status

Supabase auth SMTP is configured separately. Real sign-in email delivery from contact@mairelectroai.com was verified in the owner's inbox on September 30, 2026. New-account registration and contact-form receipt still need their own tests.

The domain `mairelectroai.com` is authenticated in Brevo, and `M Air Electro AI <contact@mairelectroai.com>` is a verified sender. A production-scoped Brevo SMTP key is stored in Vercel as a Secret. The SMTP login and sender address are production-scoped Config variables. The key must never be copied to a public or `NEXT_PUBLIC_` variable.

The contact route uses Brevo SMTP on port 587 with STARTTLS. It awaits SMTP acceptance and returns `accepted` only when Brevo accepts the recipient. SMTP acceptance is not proof of inbox delivery. The Turnstile challenge, origin, consent, input bounds and honeypot remain in place.

The website form stays disabled until all of these are done:

1. Create a Cloudflare Turnstile widget for `mairelectroai.com` with action `contact`; set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and secret `TURNSTILE_SECRET_KEY` for Production.
2. Deploy the SMTP implementation with `BREVO_SMTP_LOGIN`, `BREVO_SMTP_KEY` and `CONTACT_FROM_EMAIL` set in Vercel, leaving `CONTACT_FORM_ENABLED` unset.
3. Once Turnstile and SMTP are configured, enable `CONTACT_FORM_ENABLED=true` for a controlled delivery test and redeploy. Submit one authorized enquiry, inspect Brevo's transactional log and confirm receipt in the forwarded contact inbox. Disable the flag again if the test fails.
4. Keep the form enabled only after receipt is confirmed. Keep email links available as a fallback.

The Brevo key expires September 30, 2027, or after 90 days without use. Rotation requires updating the Vercel Secret and redeploying.

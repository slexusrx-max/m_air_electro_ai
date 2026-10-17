# Registration confirmation — 17 October 2026

A user supplied a photograph of the registration screen with a report that the site returns to registration. The exact host and preceding action were not readable; clarification about submission versus the email callback is pending. This release addresses a confirmed code/UI defect, not a claimed reproduction of that entire reported journey.

Previously, every successful signup request returned a small message while leaving the registration form visible, including when Supabase returned an active session. Now a request without a session redirects to `/register/check-email`, a noindex RO/EN page that survives refresh and explains email confirmation, same-browser handling, existing accounts and login/password recovery. An active session redirects to the authenticated profile's role destination; blocked profiles remain blocked. Provider errors still return to the form. No user email or token is put in the destination URL, and a success response is not presented as proof of inbox delivery.

The existing callback, PKCE session exchange, email settings and role/security rules are unchanged. Confirmation links opened in a different browser may lack the PKCE verifier; the page explains returning to sign in after email confirmation. This is guidance, not a claim of cross-browser session exchange support.

Validation: production build, lint, 92 unit tests and five local browser scenarios passed. Browser checks cover RO/EN at 320/1440px, refresh, links, noindex, no-JavaScript rendering and a callback without a code. Unit tests cover signup with/without a session, blocked profiles and provider errors. Tests do not create real accounts or send email. Final production SHA and browser evidence belong in ignored `.task-work/registration-2026-10-17/`.

Real new-account registration, inbox receipt and confirmation-link completion still need a controlled user journey. No end-to-end delivery or resolution of the exact photographed incident is claimed from these tests alone.

# M Air Electro AI

Production-ready MVP repository for an AI-first electrical engineering platform focused on:

- AI electrical diagnostics
- Electrical calculators
- Technical document analysis
- Verified electrical experts
- Protected marketplace workflows for electrical services and parts
- Marine and industrial premium support paths

The product is intentionally **not** a general handyman marketplace. Electrical engineering is the focus across UX, content, and architecture.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- App Router

## MVP Surface

- Landing page
- AI Assistant page
- Electrical calculators
- Marketplace page
- Expert Profiles
- Knowledge Base
- About
- Contact
- Privacy Policy
- Terms

## Calculators Included

- Cable sizing
- Voltage drop
- Motor current
- Transformer
- Battery
- Generator
- Breaker selection
- Fuse selection

All calculator outputs are framed as **preliminary engineering guidance** and intentionally include safety and design caveats.

## Architecture Prepared

- AI provider abstraction for OpenAI, Anthropic, Google, and Azure OpenAI
- Authentication architecture with role model and runtime status checks
- Database abstraction and deployment readiness checks
- Marketplace payment abstraction centered on Stripe Connect-style flows
- Marketplace workflow model with deposit, completion confirmation, and dispute window concepts
- PWA-ready metadata structure
- Security headers, robots, sitemap, OG image routes, icons, and manifest

## Local Development

```powershell
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```powershell
npm.cmd run lint
npm.cmd run build
```

## Environment Variables

Create a local `.env.local` from `.env.example` and configure:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `AI_PROVIDER`
- Provider-specific AI credentials
- `AUTH_SECRET`
- `DATABASE_URL`
- OAuth provider credentials if used
- Stripe / marketplace payment credentials

## Deployment

The repository is ready to deploy to Vercel.

Before production launch, confirm:

1. `NEXT_PUBLIC_SITE_URL` points at the real public domain.
2. Contact email is replaced with a monitored inbox.
3. AI provider credentials are configured for the chosen provider.
4. Authentication and database credentials are configured.
5. Stripe Connect or another marketplace payment provider is configured.
6. Legal review is completed for Privacy Policy and Terms.

## Notes

- The marketplace architecture does **not** implement escrow.
- Payment flows are designed around marketplace payment providers.
- AI and marketplace abstractions are prepared without pretending external services already exist.
- `PROJECT_BLUEPRINT.md` remains the main product and architecture brief.
# M Air Electro AI

## Supabase authentication setup

1. Create a Supabase project and apply [20260721000000_auth_profiles.sql](./supabase/migrations/20260721000000_auth_profiles.sql) using the Supabase CLI or SQL Editor.
2. In Supabase Authentication, enable **Email** and turn on **Confirm email**. Keep Google, GitHub, and Microsoft disabled until their provider credentials and redirect settings are ready.
3. Add `http://localhost:3000/auth/callback` and `https://your-domain.com/auth/callback` to Supabase Authentication URL Configuration → Redirect URLs.
4. Copy `.env.example` to `.env.local` and provide `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. The publishable key is safe for browser use; security is enforced with Supabase Auth and the profile RLS policies.

The App Router uses `proxy.ts` for optimistic protected-route checks and validates the authenticated user again in every protected Server Component and Server Action. OAuth provider plumbing remains intentionally unconfigured.

### First administrator

Register and verify your own account first. Then, in the Supabase SQL Editor, run the commented promotion query in [20260721000001_add_admin_role.sql](./supabase/migrations/20260721000001_add_admin_role.sql), replacing the email address with yours. Sign in again and you will be routed to `/admin`. There is deliberately no public “administrator” registration option.

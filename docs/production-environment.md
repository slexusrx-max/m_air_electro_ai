# Production environment configuration

Set these values in Vercel for the Production environment. Never commit real credentials.

| Variable | Required | Used by | Where to obtain it | Missing behavior |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URLs, metadata | Production domain, e.g. `https://m-air-electro-ai.vercel.app` | Canonicals fall back to localhost. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional | Contact links | Project mailbox | Falls back to the project default. |
| `UKRPOSHTA_ADDRESS_API_TOKEN` | Required for verified Ukrainian lookup | `/api/address` | Ukrposhta Address Classifier API access | Address UI reports lookup unavailable and allows no verified address claim. `/api/address?mode=status` reports `configured:false`. |
| `OPENAI_API_KEY` | Required for AI assistant | `/api/ai` | OpenAI project API key | Assistant returns configuration error. |
| `OPENAI_MODEL` | Required with OpenAI | `/api/ai` | Supported Responses API model name | AI request cannot be completed. |
| `AI_PROVIDER` | Optional | AI routing | Set `openai` for current integration | Defaults to application routing behavior. |
| `NEXT_PUBLIC_SUPABASE_URL` | Required for auth/documents | Supabase clients | Supabase project settings | Auth and document storage are unavailable. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Required for auth/documents | Browser Supabase client | Supabase project settings | Auth and document storage are unavailable. |
| `SUPABASE_SECRET_KEY` | Server-only, optional by feature | Administrative operations | Supabase project settings | Server admin capabilities unavailable. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only, optional legacy path | Administrative operations | Supabase project settings | Server admin capabilities unavailable. |
| `AUTH_SECRET` | Required for production auth | Session security | Generate a high-entropy secret | Authentication is unsafe or unavailable. |
| `DATABASE_URL` | Required if database-backed auth is enabled | Server database | Supabase/Postgres connection settings | Database-backed operations unavailable. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Required only when payments launch | Payments | Stripe dashboard | Payments must remain disabled. |
| `RENOGY_AFFILIATE_ID` | Optional until approved | Renogy tracking links | Renogy affiliate approval | Partner URLs work without attribution. |
| `AMAZON_ASSOCIATE_ID` | Optional until approved | Amazon tracking links | Amazon Associates | Provider remains untracked. |
| `EBAY_CAMPAIGN_ID` | Optional until approved | eBay tracking links | eBay Partner Network | Provider remains untracked. |

## Address lookup verification

After deployment, open `/api/address?mode=status`. It must return `{"configured":true,"provider":"ukrposhta"}` before city, street and house lookups can be considered operational. If lookup requests return `upstream_rejected`, reissue or correct the Ukrposhta token; `upstream_unavailable` indicates a remote response, network or timeout failure. Error logs deliberately record the status and endpoint type without logging the token.

## Deployment checklist

1. Add the required values in Vercel → Project → Settings → Environment Variables.
2. Redeploy production after changing any server-side variable.
3. Verify `/api/address?mode=status`, then test Ukrainian city → street → house selection.
4. Confirm `NEXT_PUBLIC_SITE_URL` contains the deployed HTTPS domain.
5. Keep payment and affiliate variables blank until the corresponding commercial approval is live.
## Security fixes (September 2026)

Apply all Supabase migrations in order before deploying the updated AI route. In particular:

- `20260912000000_secure_onboarding.sql` preserves account status, rejects blocked accounts and revokes access to the legacy onboarding RPC.
- `20260912000001_ai_request_quota.sql` adds an atomic quota of 30 AI requests per active user per UTC day. The database owns the counter; browser clients cannot reset it. Failed provider requests also consume a slot. Quota lookup errors stop the request before calling the provider.

The AI assistant now requires a signed-in active account. Provider calls time out after 30 seconds. Keep provider-side project spending limits configured separately; the per-user quota is not a global spending cap.

Run `npm test` for calculator, redirect, AI handler and PostgreSQL migration regression coverage. Database tests use an isolated in-memory PGlite instance with minimal Supabase auth fixtures; they do not access production. Run `npm run lint`, `npm run typecheck`, `npm run build`, and the existing `npm run smoke` against a local server as well.

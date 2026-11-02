# Launch state - 2 November 2026

## Implementation

- Mobile home value proposition and primary actions precede the product showcase. Desktop product-left layout and approved artwork are preserved.
- Clear card backing uses one 12%-to-8% gradient rather than two stacked translucent layers. Text and product photographs retain full opacity.
- Pointer decoration is bounded to two degrees, resets before interacting with controls and on scroll, and is disabled for touch and reduced motion.
- Optional Google measurement shares the private-route exclusion already used by first-party event reporting. Entering a private route withdraws consent signals from an already loaded tag. This is not proof of external provider receipt.
- The supplier regression fixture reads both ordinary and quoted CSV rows, including escaped quotes. Published feed mappings are unchanged.

## Commercial state

The existing Electro pilot is paused by explicit owner instruction. Search partners are disabled; ten campaign-level phrase exclusions for free panels and subsidies are saved. Do not reactivate as part of deploying these website fixes or allocate another pilot budget.

Authenticated Impact reports confirm that clicks and sales are distinct. No test order or synthetic affiliate click was created. Payout is not verified; the account displays a bank-review notice. Private dated performance evidence and advertising screenshots are retained in ignored `.task-work/launch-20261102/`, not published with source.

Renogy EU/Romania eligibility remains confirmed by the existing correspondence. Review the actual paid-search terms before reactivation. Waterdrop DE remains Germany-only; a separate EU approval and issued links are still required for Romania. No approval is inferred for PECRON or BLUETTI. All current link-only pricing and affiliate gates are preserved.

## Verification and release

Local unit tests: 164 passed; catalog validation: 77 records, 64 models/photos, zero errors. TypeScript, translations and lint passed (one existing feed-image warning). Production builds passed with webpack and Turbopack. New mouse/touch/reduced-motion checks: two passed; six Romanian responsive-home widths passed.

The local Next production server does not propagate the English rewrite locale, whereas the live deployment does. English browser checks must run on the actual Vercel deployment; this release does not change locale routing to mask that environment discrepancy. Release SHA, public browser checks and crawl outcome must be recorded after deployment.

## Remaining gates

- Independently verify real measurement receipt and the intended conversion goal; a page view is not a sale.
- Verify paid-channel permission, account currency and the tax/FX-safe remaining total before any advertising restart.
- Confirm actual network orders/approved commissions and payout separately. No revenue or payout guarantee is made.

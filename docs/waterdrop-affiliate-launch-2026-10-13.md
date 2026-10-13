# Waterdrop affiliate launch — 2026-10-13

## Verified account state

- Impact account: Stanislav Zavizion, account ID 7767803.
- Brand/contract shown in Impact: `Waterdrop（DE）`.
- Contract state: active/accepted.
- Online Sale terms displayed in the account: 8% commission and 30-day referral period.
- Impact rejected `www.waterdropfilter.eu` as an invalid landing-page domain.
- Impact accepted the exact `www.waterdropfilter.de` model pages below and generated a link for each.

## Exact activation map

| Catalog product | Ordinary merchant page | Impact-issued link |
| --- | --- | --- |
| Waterdrop G3P600 | `https://www.waterdropfilter.de/en/products/g3p600-waterdrop-umkehrosmose-wasserfilteranlage` | `https://dewaterdropfilter.pxf.io/OYJAjQ` |
| Waterdrop G3P800 | `https://www.waterdropfilter.de/en/products/umkehrosmoseanlage-g3p800` | `https://dewaterdropfilter.pxf.io/vDrd7d` |
| Waterdrop X12 | `https://www.waterdropfilter.de/en/products/umkehrosmose-wasserfilter-x12` | `https://dewaterdropfilter.pxf.io/4aYV19` |

Production activation requires all three conditions:

1. `AFFILIATE_TRACKING_ENABLED=true`
2. `WATERDROP_AFFILIATE_APPROVED=true`
3. `WATERDROP_IMPACT_LINKS_JSON` equals the exact ordinary-to-issued mapping above.

The provider fails closed to the ordinary merchant URL if any flag, key or HTTPS destination is missing or malformed. The public link component adds `rel="sponsored noopener noreferrer"`, an affiliate label and click-event metadata only when the resolved URL is tracked.

## Commercial boundary

This is a Germany-store affiliate contract. Acceptance and link generation do not prove delivery to Romania. Public copy must tell visitors to confirm the delivery country, price, warranty and returns with the merchant. M Air Electro AI remains an independent publisher and does not take the order or payment.

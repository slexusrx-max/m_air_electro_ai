# Battery calculator journey — 10 November 2026

Baseline main/production: `ed983c549e9067baf6e39e1310e12e15b6bc20a6`, READY `dpl_4ySB3fCyREZYvEwgU6yhtSagNeQf`. Scoped live browser verification, not a site-wide/mobile sign-off or attribution test.

## Observed desktop scenario

1. Opened https://mairelectroai.com/en/calculators/battery in the available cloud browser. Chose **Reject / withdraw consent**. Existing automation/consent exclusions were not bypassed.
2. Initial inputs: 1200 W, 4 h, 24 V, 80% usable discharge and 92% efficiency. Rendered result: 4800 Wh load energy, 6521.74 Wh nominal, 271.74 Ah, rounded 300 Ah. The page explicitly reported no documented single model covering the energy/voltage thresholds; it did not recommend assembling batteries.
3. Changed real form controls to **100 W**, **2 h**, **12 V class**, preserving **80% / 92%**. The hydrated UI recalculated to **200 Wh**, **271.74 Wh**, **22.64 Ah**, rounded planning bank **35 Ah**. Arithmetic: 100 × 2 / (0.80 × 0.92) = 271.739... Wh; divided by entered 12 V = 22.6449... Ah. The page separately explains that the reviewed 12 V-class LiFePO4 models use actual nominal values such as 12.8 V; no model compatibility is implied by a class filter.
4. Candidates appeared: Core Mini 100, Core Mini 200 and Pro Smart 200 Ah. Clicked **Compare these batteries**, an internal link. Observed actual navigation to:
   https://mairelectroai.com/en/compare?ids=renogy-mini-100%2Crenogy-mini-200%2Crenogy-pro-smart-200ah
5. Comparison showed the **Batteries** role with those three selected records. Missing fields stayed **Not documented**; no prices were rendered. Supplier links were visible but not followed.
6. Clicked **RO**. The page rendered Romanian comparison controls/content and preserved the exact three IDs:
   https://mairelectroai.com/compare?ids=renogy-mini-100%2Crenogy-mini-200%2Crenogy-pro-smart-200ah
7. Clicked the localized **Renogy Core Mini 12,8 V 100 Ah** title. The Romanian product detail rendered the exact model, ordinary editorial source, source date/limitations and marked affiliate CTA.
8. Read the visible CTA href only. It retains publisher 7767803/programme 14864 and exact variant 46545423761665 in both prodsku and the encoded merchant destination. That destination matches the visible editorial model source. This is public technical href evidence only, not fresh account-issued link provenance or proof of clicks/commission. No merchant/tracking endpoint requested.

One attempted English exact-title selector on the Romanian page found no match. Fresh DOM inspection revealed the correct localized comma decimal; the localized link then worked. This is a test-locator correction, not a website defect. Internal client navigation was confirmed after the destination rendered, not inferred from the initial click response.

## Native/mobile environment check

A changed runner condition made a native Chromium app available. It launched to a new tab. Native typing failed with **AT-SPI provider unavailable**, including after explicitly focusing the address field; both bounded input attempts stopped. No site page loaded through that native window and no device emulation or phone interaction was completed. No package install, security weakening, alternate fingerprint or unbounded retry.

The independent cloud-browser scenario above is desktop only. It does not close phone layout/tap/navigation, finder handoff, all models, all locales or other calculators. Existing 4–5 November scoped acceptance remains dated evidence. Retry native mobile work only after an actual input/runner condition changes.

## Measurement / partner limits and next step

Gmail after 9 November returned no new matching Renogy/Waterdrop/PECRON/BLUETTI message. No duplicate partner response, support enquiry, Ukraine promise or application. Renogy Romania eligibility was not reopened. No Impact/Awin login attempted, fresh GA4/GSC/financial report read, artificial event or paid action. Site clicks, network clicks/actions, approved commissions and payouts remain separate unknowns where reporting is unavailable.

No application change was necessary. Preserve the functioning calculator and comparison. Next: legitimate reporting/receipt when access is available; exact issued links from the 26-SKU queue; phone acceptance only with a working runner. Record CI/preview/production source proof on the associated documentation PR. Rollback: focused revert of this report/backlog/log package after subsequent-change review, not an app or configuration rollback.

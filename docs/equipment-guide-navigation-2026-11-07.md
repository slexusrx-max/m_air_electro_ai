# Equipment guide navigation check — 7 November 2026

Baseline main/production: `a092f54ed4737d768b43d5fdefd6f02992a4358a`, READY Vercel `dpl_2zNHGy9kT1BQFTgePB1AL95qkiHF`. Follow-up of PR #58, not a new seller-link implementation.

## Static production evidence

All 13 equipment-class detail routes on both RO/EN returned HTTP 200 (26 pages). Each rendered its existing EquipmentGuideActions block and a locale-preserving Learn link. All 20 distinct Learn destinations returned HTTP 200 with the expected-language H1. No action link returned to the same equipment category. No guide action block carried an active affiliate marker.

| Equipment class | EN action destinations |
| --- | --- |
| battery-lfp-100 | /en/learn/how-to-size-backup-battery |
| inverter-2000 | /en/learn/how-to-choose-inverter |
| solar-kit-400 | /en/learn/solar-panel-sizing |
| controller-mppt | /en/learn/solar-panel-sizing |
| portable-panel | /en/learn/solar-panel-sizing |
| flexible-panel | /en/learn/solar-panel-sizing |
| backup-essential | /en/learn/apartment-backup-system |
| marine-dc | /en/learn/marine-battery-system |
| dc-protection | /en/learn/cable-and-protection-basics |
| generator-hybrid | /en/learn/generator-vs-battery-backup |
| industrial-backup-planning | /en/learn/industrial-motor-planning |
| ac-ev-charging-class | https://ev-mag.ro/15-statii-de-incarcare-home · /en/learn/ev-charging-basics |
| water-system-planning | /en/learn/choosing-water-system |

EV-Mag is the sole external action in these blocks. Both locales render the previously reviewed exact category URL, ordinary tracking status, merchant-category destination kind, and noopener/noreferrer. The visible notice says it is a non-affiliate external catalog, not a purchasable model. This check did not contact EV-Mag or any merchant/tracking endpoint; its current external reachability, inventory, delivery, commission and checkout were not verified.

These are server-HTML and internal-route checks. They do not prove hydration, keyboard/tap handling, phone layout, analytics receipt, network clicks or purchases. No new browser/mobile pass is claimed. Existing photographs, role distinctions, product supplier gates and link-only pricing are untouched.

## Access and partner state

Existing Impact root navigation opened the ordinary login form at https://app.impact.com/login.user. No sign-in, OAuth, credential entry or declined-authentication retry was performed. Current network click/action/commission/payout figures were not obtained and remain unknown; this is the known reporting access limitation, not a new attribution failure.

The focused Gmail search after 6 November found only the already handled Renogy referral and existing support enquiry. No new substantive Renogy, Waterdrop, PECRON or BLUETTI reply was found. No mail, application or partner-watcher notification duplicated. Ukraine direct delivery, EU forwarding, warranty, discounts and commission remain separate outstanding checks. Renogy Romania eligibility remains confirmed.

## Next action and rollback

Prioritize existing-account receipt/financial reports and exact account-issued equipment links when authorized session access is available; use the preserved 26-row queue. Do not alter a healthy site to compensate for absent measurements or issue more service-row links merely to raise counts. No new paid service, campaign, purchase or automation.

This package saves verification only. CI/preview/production release evidence is recorded on the associated PR once the final SHA is known. Rollback is a focused revert of this report and the two growth-state updates after checking subsequent changes; no application or configuration rollback is required.

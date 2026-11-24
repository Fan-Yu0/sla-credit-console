# Portal submission draft

## Category

Builder -> Projects

## Contribution date

2026-11-24

## Title

SLA Uptime Credit Console

## One-line summary

Validator-backed SLA claims console that turns public incident evidence into deterministic service-credit decisions.

## Description

SLA Uptime Credit Console is a complete GenLayer application for machine-to-machine service agreements. Buyers register a vendor status page, uptime target, and billing period; anyone can run a consensus assessment. Validators independently fetch the public report and agree on downtime, then deterministic contract code computes uptime and maps the shortfall to a frozen 10%, 25%, or 50% monthly-fee credit schedule. Unreadable or contradictory reports route to human review. The console handles wallet signing, StudioNet switching, finalization, execution-result checks, and fresh public reads. It displays measured uptime, credit, evidence consistency and summary, the fixed policy table, and the live is_credit_owed integration result. The repository includes a responsive frontend, source, tests, documentation, and GitHub Pages deployment.

## Usage step 1

Open the live console and inspect `nw-2026-11` without connecting a wallet.

## Expected verification result

The sample shows Tier 1 credit, 9980 bps uptime, 86 downtime minutes of 43200, 1000 bps credit, consistent evidence, and credit owed = yes. A reviewer can connect any EIP-1193 wallet, register a unique SLA claim, and run a new finalized assessment on gasless StudioNet.

## Links

- Website: https://Fan-Yu0.github.io/sla-credit-console/
- Repository: https://github.com/Fan-Yu0/sla-credit-console
- Contract: https://explorer-studio.genlayer.com/address/0x024C5EC0B21D9d349A57259e37398a6A16524562
- Underlying contract: https://github.com/Fan-Yu0/sla-credit-adjudicator
- Required evidence: https://github.com/Fan-Yu0/sla-credit-console

## Submission status

- Live site verified on 2026-11-24: Tier 1, 99.80% uptime, 86 minutes downtime,
  10% credit, and `is_credit_owed = true` for `nw-2026-11`.
- `npm run check`: lint clean, 25 tests passed, production build successful.
- Portal Projects form filled and left ready for interactive reCAPTCHA and final
  submission confirmation on 2026-11-24. Screenshot:
  `../artifacts/sla_project_form_ready.png`.
- Submitted successfully on 2026-11-24 and visible in **My submissions** as
  **SLA Uptime Credit Console**, category **Projects**, status **Pending review**.

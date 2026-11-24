# SLA Uptime Credit Console

A complete GenLayer application for machine-to-machine service-level agreements.
Buyers register a public vendor status page, required uptime, and billing period;
anyone can trigger a validator-backed assessment and price the resulting service credit.

**GitHub Pages URL:** https://Fan-Yu0.github.io/sla-credit-console/
Publish with `npm run deploy` before using this URL for a submission.

## Live contract and sample

- StudioNet contract: [`0x024C5EC0B21D9d349A57259e37398a6A16524562`](https://explorer-studio.genlayer.com/address/0x024C5EC0B21D9d349A57259e37398a6A16524562)
- Contract and 13 direct-mode tests: [sla-credit-adjudicator](https://github.com/Fan-Yu0/sla-credit-adjudicator)
- Live claim `nw-2026-11`: 86 minutes down in a 30-day period, 99.80% measured uptime
  against a 99.90% target, Tier 1 credit of 10% of the monthly fee.

## Use it

Public reads require no wallet. Connect an EIP-1193 wallet for writes; the app adds
or switches to gasless GenLayer StudioNet (chain ID 61999).

1. Register a unique claim ID, vendor name, public HTTPS status URL, uptime target in
   basis points, and billing period in days. The default new ID avoids the live sample.
2. Inspect an existing claim or select **Assess claim**. Every validator independently
   re-reads the status page and extracts downtime before consensus.
3. The contract computes uptime and applies the frozen `sla-credit-v1` schedule:
   no credit, 10%, 25%, or 50% of the monthly fee. Unclear evidence routes to human review.
4. Inspect the verdict, uptime, credit, evidence summary, and `is_credit_owed` result.

## Development

```sh
npm ci
npm run check
npm run dev
npm run deploy
```

React, TypeScript, Vite, `genlayer-js`, and Lucide icons. No backend or custody service.
Writes verify transaction finalization and execution results rather than trusting a
submitted hash. Optional overrides are documented in `.env.example`.

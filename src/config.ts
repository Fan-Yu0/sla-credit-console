import type { ClaimForm } from './types'

export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  '0x024C5EC0B21D9d349A57259e37398a6A16524562'

export const GENLAYER_RPC_URL =
  import.meta.env.VITE_GENLAYER_RPC_URL || 'https://studio.genlayer.com/api'

export const EXPLORER_URL = 'https://explorer-studio.genlayer.com'
export const CONTRACT_URL = EXPLORER_URL + '/address/' + CONTRACT_ADDRESS
export const SOURCE_URL = 'https://github.com/Fan-Yu0/sla-credit-console'
export const CONTRACT_SOURCE_URL =
  'https://github.com/Fan-Yu0/sla-credit-adjudicator'
export const POLICY_URL =
  'https://github.com/Fan-Yu0/sla-credit-adjudicator/blob/master/examples/sla-policy.md'

export const SAMPLE_CLAIM_ID = 'nw-2026-11'

export const SAMPLE_FORM: ClaimForm = {
  claimId: 'nw-2026-12-demo',
  vendor: 'Northwind Payments',
  statusUrl:
    'https://raw.githubusercontent.com/Fan-Yu0/sla-credit-adjudicator/master/examples/service-status.md',
  requiredUptimeBps: '9990',
  periodDays: '30',
}

export const DECISION_META = {
  0: {
    label: 'Not assessed',
    tone: 'neutral',
    description: 'This SLA claim has no completed assessment yet.',
  },
  1: { label: 'No credit', tone: 'clear', description: 'Measured uptime meets the contractual requirement.' },
  2: { label: 'Tier 1 credit', tone: 'tier1', description: 'The shortfall is at most 10 basis points.' },
  3: { label: 'Tier 2 credit', tone: 'tier2', description: 'The shortfall is greater than 10 and at most 50 basis points.' },
  4: { label: 'Tier 3 credit', tone: 'blocked', description: 'The shortfall exceeds 50 basis points.' },
  5: { label: 'Review required', tone: 'review', description: 'Evidence is unreadable, contradictory, or outside the billing period.' },
} as const

export const CREDIT_TIERS = [
  { decision: 1, name: 'SLA met', shortfall: 'None', credit: '0%' },
  { decision: 2, name: 'Tier 1', shortfall: '0–10 bps', credit: '10%' },
  { decision: 3, name: 'Tier 2', shortfall: '>10–50 bps', credit: '25%' },
  { decision: 4, name: 'Tier 3', shortfall: '>50 bps', credit: '50%' },
]

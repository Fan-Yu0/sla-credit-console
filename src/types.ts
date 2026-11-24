export interface ClaimForm {
  claimId: string
  vendor: string
  statusUrl: string
  requiredUptimeBps: string
  periodDays: string
}

export interface CreditClaim {
  publisher: string
  claimId: string
  vendor: string
  statusUrl: string
  requiredUptimeBps: number
  periodDays: number
  state: number
  decision: number
  uptimeBps: number
  creditBps: number
  downtimeMinutes: number
  totalMinutes: number
  consistency: string
  summary: string
  round: number
}

export type TransactionPhase =
  | 'idle'
  | 'preparing'
  | 'signing'
  | 'submitted'
  | 'finalized'
  | 'error'

export interface TransactionState {
  phase: TransactionPhase
  action?: 'register' | 'assess'
  hash?: string
  message?: string
}

export interface Notice {
  tone: 'success' | 'error' | 'info'
  message: string
}

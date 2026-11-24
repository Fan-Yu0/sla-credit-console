import type { CreditClaim } from '../types'

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value instanceof Map) {
    return Object.fromEntries(value.entries()) as Record<string, unknown>
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return null
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function normalizeClaim(raw: unknown): CreditClaim | null {
  const record = asRecord(raw)
  if (!record) return null
  const claimId = String(record.claim_id ?? record.claimId ?? '')
  if (!claimId) return null

  return {
    publisher: String(record.publisher ?? ''),
    claimId,
    vendor: String(record.vendor ?? ''),
    statusUrl: String(record.status_url ?? record.statusUrl ?? ''),
    requiredUptimeBps: asNumber(record.required_uptime_bps ?? record.requiredUptimeBps),
    periodDays: asNumber(record.period_days ?? record.periodDays),
    state: asNumber(record.state),
    decision: asNumber(record.decision),
    uptimeBps: asNumber(record.uptime_bps ?? record.uptimeBps),
    creditBps: asNumber(record.credit_bps ?? record.creditBps),
    downtimeMinutes: asNumber(record.downtime_minutes ?? record.downtimeMinutes),
    totalMinutes: asNumber(record.total_minutes ?? record.totalMinutes),
    consistency: String(record.consistency ?? 'insufficient'),
    summary: String(record.summary ?? ''),
    round: asNumber(record.round),
  }
}

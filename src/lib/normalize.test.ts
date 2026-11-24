import { describe, expect, it } from 'vitest'
import { normalizeClaim } from './normalize'

describe('normalizeClaim', () => {
  it('maps the snake_case contract response', () => {
    const result = normalizeClaim({
      publisher: '0xabc',
      claim_id: 'nw-2026-11',
      vendor: 'Northwind Payments',
      status_url: 'https://status.example.com/november',
      required_uptime_bps: 9990,
      period_days: 30,
      state: 1,
      decision: 2,
      uptime_bps: 9980,
      credit_bps: 1000,
      downtime_minutes: 86,
      total_minutes: 43200,
      consistency: 'consistent',
      summary: 'One 86-minute incident.',
      round: 2,
    })

    expect(result).toMatchObject({
      claimId: 'nw-2026-11',
      decision: 2,
      uptimeBps: 9980,
      creditBps: 1000,
      downtimeMinutes: 86,
      totalMinutes: 43200,
      consistency: 'consistent',
      round: 2,
    })
  })

  it('maps camelCase fields', () => {
    const result = normalizeClaim({
      claimId: 'camel-claim',
      uptimeBps: 9940,
      creditBps: 2500,
      round: 1,
    })

    expect(result).toMatchObject({
      claimId: 'camel-claim',
      uptimeBps: 9940,
      creditBps: 2500,
      round: 1,
    })
  })

  it('returns null without a claim id', () => {
    expect(normalizeClaim({ decision: 1 })).toBeNull()
    expect(normalizeClaim(null)).toBeNull()
    expect(normalizeClaim(new Map())).toBeNull()
  })
})

import { describe, expect, it } from 'vitest'
import { creditBpsForDecision, creditForUptime, percentFromBps, uptimeForMinutes } from './policy'

describe('sla-credit-v1 policy', () => {
  it('matches the live sample calculation', () => {
    expect(uptimeForMinutes(43200, 86)).toBe(9980)
    expect(creditForUptime(9980, 9990)).toBe(2)
    expect(creditBpsForDecision(2)).toBe(1000)
  })

  it('implements exact shortfall boundaries', () => {
    expect(creditForUptime(9990, 9990)).toBe(1)
    expect(creditForUptime(9980, 9990)).toBe(2)
    expect(creditForUptime(9979, 9990)).toBe(3)
    expect(creditForUptime(9940, 9990)).toBe(3)
    expect(creditForUptime(9939, 9990)).toBe(4)
  })

  it('only assigns credit to the three credit decisions', () => {
    expect([0, 1, 5].map(creditBpsForDecision)).toEqual([0, 0, 0])
    expect(percentFromBps(2500)).toBe('25.00%')
  })
})

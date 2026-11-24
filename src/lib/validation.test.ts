import { describe, expect, it } from 'vitest'
import { hasErrors, validateClaimForm, validateClaimId } from './validation'
import type { ClaimForm } from '../types'

const valid: ClaimForm = {
  claimId: 'nw-2026-11-new',
  vendor: 'Northwind Payments',
  statusUrl: 'https://status.example.com/november',
  requiredUptimeBps: '9990',
  periodDays: '30',
}

describe('validateClaimForm', () => {
  it('accepts a complete form', () => {
    expect(hasErrors(validateClaimForm(valid))).toBe(false)
  })

  it('requires a claim id of at least three characters', () => {
    expect(validateClaimForm({ ...valid, claimId: '   ' }).claimId).toMatch(/Enter/)
    expect(validateClaimForm({ ...valid, claimId: 'ab' }).claimId).toMatch(/3–64/)
  })

  it('rejects non-HTTPS and overlong status urls', () => {
    expect(validateClaimForm({ ...valid, statusUrl: 'http://x.com' }).statusUrl).toMatch(/HTTPS/)
    expect(validateClaimForm({ ...valid, statusUrl: 'https://x.com/' + 'a'.repeat(401) }).statusUrl).toMatch(/400/)
  })

  it('validates vendor length', () => {
    expect(validateClaimForm({ ...valid, vendor: 'A' }).vendor).toMatch(/2–120/)
  })

  it('requires whole-number uptime bps within contract limits', () => {
    expect(validateClaimForm({ ...valid, requiredUptimeBps: '0' }).requiredUptimeBps).toMatch(/1 to 10,000/)
    expect(validateClaimForm({ ...valid, requiredUptimeBps: '10001' }).requiredUptimeBps).toMatch(/1 to 10,000/)
    expect(validateClaimForm({ ...valid, requiredUptimeBps: '99.9' }).requiredUptimeBps).toMatch(/whole/)
  })

  it('validates billing periods within contract limits', () => {
    expect(validateClaimForm({ ...valid, periodDays: '0' }).periodDays).toMatch(/1 to 366/)
    expect(validateClaimForm({ ...valid, periodDays: '367' }).periodDays).toMatch(/1 to 366/)
    expect(validateClaimForm({ ...valid, periodDays: '30.5' }).periodDays).toMatch(/whole/)
  })

  it('rejects an overlong claim id', () => {
    expect(validateClaimForm({ ...valid, claimId: 'a'.repeat(65) }).claimId).toMatch(/3–64/)
  })
})

describe('validateClaimId', () => {
  it('accepts a normal id', () => {
    expect(validateClaimId('nw-2026-11')).toBeNull()
  })

  it('rejects an empty id', () => {
    expect(validateClaimId('   ')).toMatch(/Enter/)
  })
})

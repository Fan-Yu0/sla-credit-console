import type { ClaimForm } from '../types'

export type FormErrors = Partial<Record<keyof ClaimForm, string>>

export function validateClaimForm(form: ClaimForm): FormErrors {
  const errors: FormErrors = {}
  const idError = validateClaimId(form.claimId)
  if (idError) errors.claimId = idError
  const vendor = form.vendor.trim().replace(/\s+/g, ' ')
  if (vendor.length < 2 || vendor.length > 120)
    errors.vendor = 'Vendor must be 2–120 characters.'
  const statusUrl = form.statusUrl.trim()
  if (!statusUrl.startsWith('https://'))
    errors.statusUrl = 'Use a public HTTPS status or incident report URL.'
  else if (statusUrl.length > 400)
    errors.statusUrl = 'URL must be 400 characters or fewer.'
  const requiredUptime = Number(form.requiredUptimeBps)
  if (!Number.isInteger(requiredUptime) || requiredUptime < 1 || requiredUptime > 10000)
    errors.requiredUptimeBps = 'Enter a whole number from 1 to 10,000 basis points.'
  const periodDays = Number(form.periodDays)
  if (!Number.isInteger(periodDays) || periodDays < 1 || periodDays > 366)
    errors.periodDays = 'Billing period must be a whole number from 1 to 366 days.'
  return errors
}

export function validateClaimId(claimId: string): string | null {
  const normalized = claimId.trim()
  if (!normalized) return 'Enter a claim ID to inspect.'
  if (normalized.length < 3 || normalized.length > 64)
    return 'Claim ID must be 3–64 characters.'
  return null
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0
}

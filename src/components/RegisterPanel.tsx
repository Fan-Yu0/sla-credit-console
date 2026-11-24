import { FilePlus2, RotateCcw, ShieldPlus } from 'lucide-react'
import type { FormErrors } from '../lib/validation'
import { SAMPLE_CLAIM_ID } from '../config'
import type { ClaimForm } from '../types'
import { Field } from './Field'

interface RegisterPanelProps {
  form: ClaimForm
  errors: FormErrors
  busy: boolean
  connected: boolean
  onChange: (field: keyof ClaimForm, value: string) => void
  onReset: () => void
  onSubmit: () => void
}

export function RegisterPanel({
  form,
  errors,
  busy,
  connected,
  onChange,
  onReset,
  onSubmit,
}: RegisterPanelProps) {
  return (
    <section className="tool-panel register-panel" aria-labelledby="register-title">
      <div className="panel-heading">
        <div className="panel-icon">
          <FilePlus2 size={19} aria-hidden="true" />
        </div>
        <div>
          <p className="eyebrow">Buyer action</p>
          <h2 id="register-title">Register an SLA claim</h2>
        </div>
        <button className="text-button" type="button" onClick={onReset}>
          <RotateCcw size={14} aria-hidden="true" />
          Sample
        </button>
      </div>

      <div className="form-stack">
        <Field label="Claim ID" htmlFor="claim-id" hint="Unique key" error={errors.claimId}>
          <input
            id="claim-id"
            value={form.claimId}
            onChange={(event) => onChange('claimId', event.target.value)}
            placeholder={SAMPLE_CLAIM_ID + '-new'}
            autoComplete="off"
          />
        </Field>

        <Field label="Vendor" htmlFor="vendor" hint="Service provider" error={errors.vendor}>
          <input
            id="vendor"
            value={form.vendor}
            onChange={(event) => onChange('vendor', event.target.value)}
            placeholder="Northwind Payments"
          />
        </Field>

        <Field label="Public status report URL" htmlFor="status-url" hint="HTTPS only" error={errors.statusUrl}>
          <input
            id="status-url"
            value={form.statusUrl}
            onChange={(event) => onChange('statusUrl', event.target.value)}
            placeholder="https://status.example.com/reports/november"
            inputMode="url"
          />
        </Field>

        <Field label="Required uptime" htmlFor="required-uptime" hint="1–10,000 bps" error={errors.requiredUptimeBps}>
          <input
            id="required-uptime"
            value={form.requiredUptimeBps}
            onChange={(event) => onChange('requiredUptimeBps', event.target.value)}
            placeholder="9990"
            inputMode="numeric"
          />
          <span className="field-detail">9,990 bps = 99.90% required uptime</span>
        </Field>

        <Field label="Billing period" htmlFor="period-days" hint="1–366 days" error={errors.periodDays}>
          <input
            id="period-days"
            value={form.periodDays}
            onChange={(event) => onChange('periodDays', event.target.value)}
            placeholder="30"
            inputMode="numeric"
          />
          <span className="field-detail">The contract calculates total minutes as days × 1,440.</span>
        </Field>
      </div>

      <div className="read-only-note">
        <ShieldPlus size={15} aria-hidden="true" />
        Registration stores the claim only. Assessment is a separate consensus
        transaction; choose a unique claim ID for a new claim.
      </div>

      <button
        className="primary-button full-width"
        type="button"
        onClick={onSubmit}
        disabled={busy || !connected}
      >
        <ShieldPlus size={17} aria-hidden="true" />
        {connected ? 'Register claim on GenLayer' : 'Connect wallet to register'}
      </button>
    </section>
  )
}

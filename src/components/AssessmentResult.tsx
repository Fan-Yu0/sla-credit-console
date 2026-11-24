import {
  Activity,
  CircleDashed,
  ExternalLink,
  FileText,
  Link2,
  Scale,
  ShieldAlert,
  Timer,
} from 'lucide-react'
import { CONTRACT_URL, DECISION_META } from '../config'
import { percentFromBps } from '../lib/policy'
import type { CreditClaim } from '../types'

function shorten(value: string, start = 8, end = 6) {
  if (!value) return 'Unknown'
  if (value.length <= start + end + 3) return value
  return value.slice(0, start) + '...' + value.slice(-end)
}

function DecisionIcon({ decision }: { decision: number }) {
  if (decision === 1) return <Activity size={28} aria-hidden="true" />
  if (decision >= 2 && decision <= 4) return <Scale size={28} aria-hidden="true" />
  if (decision === 5) return <ShieldAlert size={28} aria-hidden="true" />
  return <CircleDashed size={28} aria-hidden="true" />
}

export function AssessmentResult({
  result,
  reading,
  creditOwed,
}: {
  result: CreditClaim | null
  reading: boolean
  creditOwed: boolean | null
}) {
  if (reading) {
    return (
      <section className="result-panel loading-state" aria-live="polite">
        <CircleDashed className="spin" size={24} aria-hidden="true" />
        Reading the accepted contract state.
      </section>
    )
  }

  if (!result) {
    return (
      <section className="result-panel empty-state">
        <div className="empty-icon">
          <FileText size={26} aria-hidden="true" />
        </div>
        <div>
          <h2>No assessment loaded</h2>
          <p>
            Read an existing claim ID or load the live sample to inspect the
            deployed contract.
          </p>
        </div>
      </section>
    )
  }

  const decision =
    DECISION_META[result.decision as keyof typeof DECISION_META] ??
    DECISION_META[0]
  const consistencyTone =
    result.consistency === 'consistent' ? 'ok' : 'warn'
  const shortfall = Math.max(0, result.requiredUptimeBps - result.uptimeBps)

  return (
    <section
      className={'result-panel decision-' + decision.tone}
      aria-labelledby="result-title"
    >
      <div className="decision-hero">
        <div className="decision-icon">
          <DecisionIcon decision={result.decision} />
        </div>
        <div className="decision-copy">
          <p className="eyebrow">On-chain assessment</p>
          <h2 id="result-title">{decision.label}</h2>
          <p>{result.summary || decision.description}</p>
          <span className="vendor-label">{result.vendor}</span>
        </div>
        <div className="decision-release">
          <span>{creditOwed ? 'Credit owed' : 'No automatic credit'}</span>
          <strong>{percentFromBps(result.creditBps)} of monthly fee</strong>
          <code>{result.claimId}</code>
        </div>
      </div>

      <div className="metric-strip">
        <div>
          <span>Uptime</span>
          <strong>{result.state === 1 && result.decision !== 5 ? percentFromBps(result.uptimeBps) : '—'}</strong>
          <small>measured</small>
        </div>
        <div>
          <span>Required</span>
          <strong>{percentFromBps(result.requiredUptimeBps)}</strong>
          <small>SLA target</small>
        </div>
        <div>
          <span>Downtime</span>
          <strong>{result.downtimeMinutes.toLocaleString()}</strong>
          <small>of {result.totalMinutes.toLocaleString()} min</small>
        </div>
        <div>
          <span>Shortfall</span>
          <strong className={shortfall ? 'metric-warn' : 'metric-ok'}>{shortfall}</strong>
          <small>basis points</small>
        </div>
        <div>
          <span>Source</span>
          <strong className={consistencyTone}>{result.consistency}</strong>
          <small>consistency</small>
        </div>
        <div>
          <span>Round</span>
          <strong>{result.round}</strong>
          <small>latest assessment</small>
        </div>
      </div>

      <div className="result-grid">
        <div className="result-section">
          <div className="section-title-row">
            <h3>Credit calculation</h3>
            <span>sla-credit-v1</span>
          </div>
          <div className="formula-card">
            <code>(({result.totalMinutes.toLocaleString()} − {result.downtimeMinutes}) × 10,000) ÷ {result.totalMinutes.toLocaleString()}</code>
            <strong>= {result.decision === 5 ? 'Review required' : result.uptimeBps.toLocaleString() + ' bps uptime'}</strong>
          </div>
          <p className="result-note">
            {creditOwed
              ? 'is_credit_owed returns true. Other contracts can use this signal to release escrow or accrue a service credit.'
              : 'No credit is owed from this record. The credit is derived deterministically from validator-extracted downtime.'}
          </p>
        </div>

        <div className="result-section">
          <div className="section-title-row">
            <h3>Evidence and record</h3>
            <span>Round {result.round}</span>
          </div>
          <dl className="evidence-list">
            <div>
              <dt>Claim state</dt>
              <dd>{result.state === 0 ? 'Draft' : result.state === 1 ? 'Assessed' : 'Withdrawn'}</dd>
            </div>
            <div>
              <dt>Source consistency</dt>
              <dd className={consistencyTone}>{result.consistency}</dd>
            </div>
            <div>
              <dt>Publisher</dt>
              <dd title={result.publisher}>{shorten(result.publisher)}</dd>
            </div>
            <div>
              <dt>Billing period</dt>
              <dd>{result.periodDays} days</dd>
            </div>
            <div>
              <dt>is_credit_owed()</dt>
              <dd>{creditOwed === null ? 'Read unavailable' : creditOwed ? 'true' : 'false'}</dd>
            </div>
          </dl>
          <div className="result-links">
            <a href={result.statusUrl} target="_blank" rel="noreferrer">
              <Link2 size={14} aria-hidden="true" />
              Status evidence
              <ExternalLink size={13} aria-hidden="true" />
            </a>
            <a href={CONTRACT_URL} target="_blank" rel="noreferrer">
              <FileText size={14} aria-hidden="true" />
              Intelligent Contract
              <ExternalLink size={13} aria-hidden="true" />
            </a>
            <a href="#credit-schedule">
              <Timer size={14} aria-hidden="true" />
              Credit schedule
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

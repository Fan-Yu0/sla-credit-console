import {
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Info,
  Scale,
  ShieldCheck,
  TerminalSquare,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { RegisterPanel } from './components/RegisterPanel'
import { AssessPanel } from './components/AssessPanel'
import { AssessmentResult } from './components/AssessmentResult'
import { TransactionBanner } from './components/TransactionBanner'
import {
  CONTRACT_URL,
  CREDIT_TIERS,
  POLICY_URL,
  SAMPLE_FORM,
  SAMPLE_CLAIM_ID,
  CONTRACT_SOURCE_URL,
} from './config'
import { useWallet } from './hooks/useWallet'
import { assessClaim, readClaim, readCreditOwed, registerClaim } from './lib/contract'
import {
  hasErrors,
  validateClaimForm,
  validateClaimId,
  type FormErrors,
} from './lib/validation'
import type {
  ClaimForm,
  CreditClaim,
  Notice,
  TransactionState,
} from './types'
import './App.css'

function App() {
  const wallet = useWallet()
  const [registerForm, setRegisterForm] = useState<ClaimForm>(SAMPLE_FORM)
  const [registerErrors, setRegisterErrors] = useState<FormErrors>({})
  const [assessId, setAssessId] = useState(SAMPLE_CLAIM_ID)
  const [assessError, setAssessError] = useState<string>()
  const [assessment, setAssessment] = useState<CreditClaim | null>(null)
  const [creditOwed, setCreditOwed] = useState<boolean | null>(null)
  const [reading, setReading] = useState(true)
  const [transaction, setTransaction] = useState<TransactionState>({
    phase: 'idle',
  })
  const [notice, setNotice] = useState<Notice | null>(null)

  const busy =
    transaction.phase === 'preparing' ||
    transaction.phase === 'signing' ||
    transaction.phase === 'submitted'

  async function loadRecord(claimId: string, announce = true) {
    const error = validateClaimId(claimId)
    if (error) {
      setAssessError(error)
      return
    }

    setAssessError(undefined)
    setReading(true)
    if (announce) setNotice(null)
    try {
      const result = await readClaim(claimId)
      setAssessment(result)
      if (result) {
        setCreditOwed(null)
        try {
          setCreditOwed(await readCreditOwed(claimId))
        } catch {
          setCreditOwed(null)
        }
      } else {
        setCreditOwed(false)
      }
      if (!result && announce) {
        setNotice({ tone: 'info', message: 'No SLA claim was found.' })
      }
    } catch (cause) {
      setNotice({
        tone: 'error',
        message:
          cause instanceof Error
            ? cause.message
            : 'Could not read the contract state.',
      })
    } finally {
      setReading(false)
    }
  }

  useEffect(() => {
    let active = true
    readClaim(SAMPLE_CLAIM_ID)
      .then((result) => {
        if (active) setAssessment(result)
        return result ? readCreditOwed(SAMPLE_CLAIM_ID) : false
      })
      .then((owed) => {
        if (active) setCreditOwed(owed)
      })
      .catch((cause) => {
        if (!active) return
        setNotice({
          tone: 'error',
          message:
            cause instanceof Error
              ? cause.message
              : 'Could not read the sample claim.',
        })
      })
      .finally(() => {
        if (active) setReading(false)
      })
    return () => {
      active = false
    }
  }, [])

  function updateForm(field: keyof ClaimForm, value: string) {
    setRegisterForm((current) => ({ ...current, [field]: value }))
    setRegisterErrors((current) => ({ ...current, [field]: undefined }))
  }

  function phaseHandler(action: 'register' | 'assess') {
    return (
      phase: TransactionState['phase'],
      message: string,
      hash?: string,
    ) => {
      setTransaction({ phase, action, message, hash })
    }
  }

  async function handleRegister() {
    const errors = validateClaimForm(registerForm)
    setRegisterErrors(errors)
    if (hasErrors(errors)) return
    if (!wallet.address) {
      setNotice({ tone: 'error', message: 'Connect a wallet first.' })
      return
    }

    setNotice(null)
    setTransaction({
      phase: 'preparing',
      action: 'register',
      message: 'Preparing registration.',
    })
    try {
      await registerClaim(wallet.address, registerForm, phaseHandler('register'))
      const normalizedId = registerForm.claimId.trim().toLowerCase()
      setAssessId(normalizedId)
      setNotice({
        tone: 'success',
        message: 'Claim registered. Run a consensus assessment when ready.',
      })
      await loadRecord(normalizedId, false)
    } catch (cause) {
      setTransaction({
        phase: 'error',
        action: 'register',
        message: cause instanceof Error ? cause.message : 'Registration failed.',
      })
    }
  }

  async function handleAssess() {
    const error = validateClaimId(assessId)
    setAssessError(error ?? undefined)
    if (error) return
    if (!wallet.address) {
      setNotice({ tone: 'error', message: 'Connect a wallet first.' })
      return
    }

    setNotice(null)
    setTransaction({
      phase: 'preparing',
      action: 'assess',
      message: 'Preparing assessment.',
    })
    try {
      await assessClaim(wallet.address, assessId, phaseHandler('assess'))
      setNotice({
        tone: 'success',
        message: 'Assessment finalized and recorded on GenLayer Studio.',
      })
      await loadRecord(assessId, false)
    } catch (cause) {
      setTransaction({
        phase: 'error',
        action: 'assess',
        message: cause instanceof Error ? cause.message : 'Assessment failed.',
      })
    }
  }

  return (
    <div className="app-shell">
      <Header
        address={wallet.address}
        connecting={wallet.connecting}
        hasProvider={wallet.hasProvider}
        onConnect={wallet.connect}
        onDisconnect={wallet.disconnect}
      />

      {notice && (
        <div className={'notice notice-' + notice.tone} role="status">
          {notice.tone === 'success' ? (
            <CheckCircle2 size={17} aria-hidden="true" />
          ) : (
            <Info size={17} aria-hidden="true" />
          )}
          <span>{notice.message}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss">
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      )}

      <main className="main-content">
        <section className="page-heading">
          <div>
            <p className="eyebrow">Service-level agreement workbench</p>
            <h1>SLA Uptime Credit Console</h1>
            <p>
              Register a service claim, verify the vendor's public incident
              evidence with GenLayer, and price the resulting credit.
            </p>
          </div>
          <div className="heading-meta">
            <span>
              <ShieldCheck size={16} aria-hidden="true" />
              Consensus-backed
            </span>
            <span>
              <TerminalSquare size={16} aria-hidden="true" />
              Real contract writes
            </span>
          </div>
        </section>

        <TransactionBanner state={transaction} />

        <div className="workbench-grid">
          <RegisterPanel
            form={registerForm}
            errors={registerErrors}
            busy={busy}
            connected={Boolean(wallet.address)}
            onChange={updateForm}
            onReset={() => {
              setRegisterForm(SAMPLE_FORM)
              setRegisterErrors({})
            }}
            onSubmit={handleRegister}
          />
          <AssessPanel
            claimId={assessId}
            error={assessError}
            busy={busy}
            reading={reading}
            connected={Boolean(wallet.address)}
            result={assessment}
            onChange={(value) => {
              setAssessId(value)
              setAssessError(undefined)
            }}
            onRead={() => void loadRecord(assessId)}
            onAssess={handleAssess}
            onSample={() => {
              setAssessId(SAMPLE_CLAIM_ID)
              void loadRecord(SAMPLE_CLAIM_ID)
            }}
          />
        </div>

        <AssessmentResult result={assessment} reading={reading} creditOwed={creditOwed} />

        <section className="reference-band" id="credit-schedule">
          <div className="reference-intro">
            <p className="eyebrow">Frozen sla-credit-v1 policy</p>
            <h2>One outage. One auditable credit.</h2>
            <p>
              Validators independently re-read the status report and agree on
              downtime. The contract, not the LLM, calculates uptime and maps
              the shortfall to this fixed schedule. Unreadable or contradictory
              evidence fails closed to human review.
            </p>
            <div className="credit-table" role="table" aria-label="SLA credit schedule">
              {CREDIT_TIERS.map((tier) => (
                <div className={assessment?.decision === tier.decision ? 'credit-row active' : 'credit-row'} key={tier.decision} role="row">
                  <strong role="cell">{tier.name}</strong>
                  <span role="cell">{tier.shortfall}</span>
                  <b role="cell">{tier.credit}</b>
                </div>
              ))}
            </div>
          </div>
          <div className="policy-list">
            <div>
              <span className="step-number">01</span>
              <div>
                <strong>Fetch</strong>
                <p>Each validator independently reads the public status page.</p>
              </div>
            </div>
            <div>
              <span className="step-number">02</span>
              <div>
                <strong>Agree</strong>
                <p>Consensus is reached on downtime and evidence consistency.</p>
              </div>
            </div>
            <div>
              <span className="step-number">03</span>
              <div>
                <strong>Price</strong>
                <p>Deterministic arithmetic produces the owed monthly-fee credit.</p>
              </div>
            </div>
          </div>
          <div className="reference-links">
            <a href={CONTRACT_SOURCE_URL} target="_blank" rel="noreferrer">
              <GitBranch size={16} aria-hidden="true" />
              Contract source
            </a>
            <a href={POLICY_URL} target="_blank" rel="noreferrer">
              <Scale size={16} aria-hidden="true" />
              SLA policy example
            </a>
            <a href={CONTRACT_URL} target="_blank" rel="noreferrer">
              <ExternalLink size={16} aria-hidden="true" />
              Deployed contract
            </a>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span>SLA Uptime Credit Console</span>
        <span>Built on GenLayer StudioNet</span>
      </footer>
    </div>
  )
}

export default App

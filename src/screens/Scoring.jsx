import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Screen, Footer } from '../components/Chrome.jsx'
import { Button } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { LOADING_MESSAGES, EXPERT, EXPERT_STAGES } from '../data/trip.js'
import { useFlow } from '../state/FlowContext.jsx'

export default function Scoring() {
  const { variant } = useFlow()
  return variant === 'expert' ? <ExpertReview /> : <InstantScoring />
}

/* ── v1 · Instant AI scoring (~5s, auto-advances) ─────────────── */
function InstantScoring() {
  const navigate = useNavigate()
  const [msg, setMsg] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (error) return
    const cycle = setInterval(() => setMsg((m) => (m + 1) % LOADING_MESSAGES.length), 1500)
    const done = setTimeout(() => navigate('/score'), 5200)
    return () => { clearInterval(cycle); clearTimeout(done) }
  }, [error, navigate])

  if (error) {
    return (
      <Screen>
        <div className="screen-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
          <div className="loader-orb">
            <div className="loader-orb__core" style={{ background: 'var(--warning-red-000)', color: 'var(--feedback-negative)' }}>
              <Icon name="warning" size={34} />
            </div>
          </div>
          <h2 className="t-hd-med" style={{ marginTop: 26 }}>Something went wrong.</h2>
          <p className="t-p-med muted" style={{ marginTop: 8, maxWidth: 250 }}>Your itinerary was saved — nothing's lost.</p>
        </div>
        <Footer><Button full onClick={() => setError(false)}>Try again</Button></Footer>
      </Screen>
    )
  }

  return (
    <Screen>
      <div className="screen-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
        <div className="loader-orb">
          <motion.div className="loader-orb__ring" animate={{ rotate: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }} />
          <div className="loader-orb__core">
            <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Icon name="route" size={32} />
            </motion.div>
          </div>
        </div>

        <div style={{ height: 56, marginTop: 30, display: 'flex', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={msg}
              className="t-hd-med"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              {LOADING_MESSAGES[msg]}
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ width: '100%', marginTop: 'auto', paddingTop: 30 }}>
          <div className="dim__track">
            <motion.div className="dim__fill" style={{ background: 'var(--brand-primary)' }} initial={{ width: '8%' }} animate={{ width: '96%' }} transition={{ duration: 5 }} />
          </div>
        </div>
      </div>
    </Screen>
  )
}

/* ── v2 · Human expert review (stay & wait, live status) ──────── */
function ExpertReview() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // index of the in-progress stage

  useEffect(() => {
    const t = []
    t.push(setTimeout(() => setStep(1), 1600))
    t.push(setTimeout(() => setStep(2), 3600))
    t.push(setTimeout(() => setStep(3), 5800))
    t.push(setTimeout(() => setStep(EXPERT_STAGES.length), 7800)) // all done
    t.push(setTimeout(() => navigate('/score'), 8800))
    return () => t.forEach(clearTimeout)
  }, [navigate])

  return (
    <Screen>
      <div className="screen-body pad" style={{ display: 'flex', flexDirection: 'column', paddingTop: 18, paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}>
        <h1 className="t-hd-large">Your itinerary is with an expert</h1>
        <p className="t-p-med muted" style={{ marginTop: 8 }}>
          A Scapia travel expert is going through your Thailand plan by hand. Hang tight —
          your score is on its way.
        </p>

        <motion.div
          className="expert-card" style={{ marginTop: 18 }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        >
          <img className="expert-card__av" src={EXPERT.avatar} alt={EXPERT.name} />
          <div>
            <div className="t-hd-sm">{EXPERT.name}</div>
            <div className="t-p-small muted">{EXPERT.title}</div>
            <span className="expert-card__verify"><Icon name="check" size={13} />{EXPERT.reviewed}</span>
          </div>
        </motion.div>

        <div style={{ marginTop: 24 }}>
          {EXPERT_STAGES.map((stage, i) => {
            const status = i < step ? 'done' : i === step ? 'active' : 'pending'
            const last = i === EXPERT_STAGES.length - 1
            return (
              <div key={stage.key} className={`review-step is-${status}`}>
                <div className="review-step__rail">
                  <div className="review-step__node">
                    {status === 'done' ? (
                      <Icon name="check" size={15} />
                    ) : status === 'active' ? (
                      <motion.span
                        style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--brand-primary)', borderTopColor: 'transparent' }}
                        animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : (
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--border-strong)' }} />
                    )}
                  </div>
                  {!last && <div className="review-step__line" />}
                </div>
                <div className="review-step__body">
                  <div className="review-step__label">{stage.label}</div>
                  <div className="review-step__sub">{stage.sub}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="spacer" />
        <div className="banner banner--info" style={{ marginTop: 20 }}>
          <Icon name="clock" size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{EXPERT.eta}. We've sped this up for the demo — your score will open automatically.</span>
        </div>
      </div>
    </Screen>
  )
}

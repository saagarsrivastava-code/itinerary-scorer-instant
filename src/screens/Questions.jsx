import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Screen, Footer } from '../components/Chrome.jsx'
import { Button, Stepper } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { useFlow } from '../state/FlowContext.jsx'
import { QUESTIONS_TOTAL } from '../data/trip.js'

const PARTY = ['Solo', 'Partner', 'Friends', 'Family (kids)', 'Family (teens)', 'Parents', 'Group (6+)']
const PARTY_ICONS = { Solo: 'user', Partner: 'user', Friends: 'user', 'Family (kids)': 'home', 'Family (teens)': 'home', Parents: 'home', 'Group (6+)': 'user' }
const INTERESTS = ['Food & dining', 'Culture & history', 'Nature & outdoors', 'Nightlife', 'Shopping', 'Wellness', 'Adventure', 'Local life', 'Hidden gems', 'Popular landmarks']
const BUDGET = [
  { l: 'Budget', s: 'under ₹2,000/day' },
  { l: 'Mid-range', s: '₹2,000–5,000' },
  { l: 'Comfortable', s: '₹5,000–10,000' },
  { l: 'Luxury', s: '₹10,000+' },
]
const FLEX = [
  { l: 'All booked', s: 'Stays & activities locked — fine-tune only' },
  { l: 'Mostly set', s: 'A few things flexible — open to swaps' },
  { l: 'Still planning', s: 'Nothing locked — suggest freely' },
]

export default function Questions() {
  const navigate = useNavigate()
  const { answers, setAnswers } = useFlow()
  const [step, setStep] = useState(0)

  const set = (k, v) => setAnswers((a) => ({ ...a, [k]: v }))

  function toggleInterest(i) {
    const has = answers.interests.includes(i)
    if (has) set('interests', answers.interests.filter((x) => x !== i))
    else if (answers.interests.length < 3) set('interests', [...answers.interests, i])
  }

  function back() { step === 0 ? navigate('/preview') : setStep(step - 1) }
  function next() { step === QUESTIONS_TOTAL - 1 ? navigate('/scoring') : setStep(step + 1) }

  const answered = [
    !!answers.party,
    answers.pace != null,
    answers.interests.length > 0,
    !!answers.budget,
    !!answers.flexibility,
  ][step]

  return (
    <Screen>
      <div className="pad" style={{ paddingTop: 8 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button className="appbar__back" style={{ marginLeft: -8 }} onClick={back} aria-label="Back"><Icon name="back" /></button>
          <span className="t-p-small muted">{step + 1} of {QUESTIONS_TOTAL}</span>
          <button className="btn btn--text" style={{ padding: 4 }} onClick={next}>Skip</button>
        </div>
        <div style={{ marginTop: 12 }}><Stepper current={step + 1} total={QUESTIONS_TOTAL} /></div>
      </div>

      <div className="screen-body pad" style={{ paddingTop: 18 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22 }}
          >
            {step === 0 && <Q1 value={answers.party} onSelect={(v) => set('party', v)} />}
            {step === 1 && <Q2 value={answers.pace} onChange={(v) => set('pace', v)} />}
            {step === 2 && <Q3 selected={answers.interests} onToggle={toggleInterest} />}
            {step === 3 && <Q4 value={answers.budget} onSelect={(v) => set('budget', v)} />}
            {step === 4 && <Q5 value={answers.flexibility} onSelect={(v) => set('flexibility', v)} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer>
        <Button full disabled={!answered} onClick={next}>
          {step === QUESTIONS_TOTAL - 1 ? 'Score my itinerary' : 'Next'}
        </Button>
      </Footer>
    </Screen>
  )
}

function QTitle({ children, hint }) {
  return (
    <>
      <h2 className="t-hd-large" style={{ marginTop: 6 }}>{children}</h2>
      {hint && <div className="t-p-small muted" style={{ marginTop: 6 }}>{hint}</div>}
    </>
  )
}

function Q1({ value, onSelect }) {
  return (
    <>
      <QTitle>Who's joining you?</QTitle>
      <div className="opt-grid" style={{ marginTop: 16 }}>
        {PARTY.map((p, i) => (
          <button
            key={p}
            className={`opt${value === p ? ' is-sel' : ''}${i === PARTY.length - 1 ? ' opt--wide' : ''}`}
            onClick={() => onSelect(p)}
          >
            <span className="opt__icn"><Icon name={PARTY_ICONS[p]} size={20} /></span>
            <span className="opt__label">{p}</span>
            {value === p && <Icon name="check" size={16} style={{ color: 'var(--brand-primary)' }} />}
          </button>
        ))}
      </div>
    </>
  )
}

function Q2({ value, onChange }) {
  return (
    <>
      <QTitle>How do you like to travel?</QTitle>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 36, gap: 16 }}>
        <div className="center" style={{ width: 110 }}>
          <span className="opt__icn" style={{ margin: '0 auto' }}><Icon name="clock" size={20} /></span>
          <div className="t-p-small muted" style={{ marginTop: 8 }}>Relaxed — few stops, lots of time</div>
        </div>
        <div className="center" style={{ width: 110 }}>
          <span className="opt__icn" style={{ margin: '0 auto' }}><Icon name="sparkle" size={20} /></span>
          <div className="t-p-small muted" style={{ marginTop: 8 }}>Packed — see as much as possible</div>
        </div>
      </div>

      <div className="slider-wrap">
        <div className="slider-track">
          <div className="slider-fill" style={{ width: `${(value - 1) / 4 * 100}%` }} />
          <div className="slider-knob" style={{ left: `${(value - 1) / 4 * 100}%` }} />
          <input className="slider-input" type="range" min="1" max="5" step="1" value={value} onChange={(e) => onChange(Number(e.target.value))} />
        </div>
        <div className="slider-ticks">
          {[1, 2, 3, 4, 5].map((n) => <span key={n} className={`slider-tick${n === value ? ' is-on' : ''}`} />)}
        </div>
      </div>
    </>
  )
}

function Q3({ selected, onToggle }) {
  const full = selected.length >= 3
  return (
    <>
      <QTitle hint={`Pick up to 3 · ${selected.length} selected`}>What's this trip really about?</QTitle>
      <div className="chips" style={{ marginTop: 16 }}>
        {INTERESTS.map((i) => {
          const on = selected.includes(i)
          return (
            <button
              key={i}
              className={`chip${on ? ' is-sel' : ''}${!on && full ? ' is-disabled' : ''}`}
              onClick={() => onToggle(i)}
            >
              {i}{on ? ' ✓' : ''}
            </button>
          )
        })}
      </div>
    </>
  )
}

function Q4({ value, onSelect }) {
  return (
    <>
      <QTitle hint="Per person">Roughly, what's your daily spend?</QTitle>
      <div className="opt-grid" style={{ marginTop: 18 }}>
        {BUDGET.map((b) => (
          <button key={b.l} className={`opt opt--tall${value === b.l ? ' is-sel' : ''}`} onClick={() => onSelect(b.l)}>
            <span className="t-hd-sm">{b.l}{value === b.l ? ' ✓' : ''}</span>
            <span className="t-p-small muted">{b.s}</span>
          </button>
        ))}
      </div>
    </>
  )
}

function Q5({ value, onSelect }) {
  return (
    <>
      <QTitle hint="Helps us know what we can suggest changing">How locked-in is this plan?</QTitle>
      <div className="col" style={{ gap: 10, marginTop: 18 }}>
        {FLEX.map((f) => (
          <button key={f.l} className={`opt opt--wide${value === f.l ? ' is-sel' : ''}`} style={{ alignItems: 'flex-start' }} onClick={() => onSelect(f.l)}>
            <span className="col" style={{ alignItems: 'flex-start', gap: 3 }}>
              <span className="t-hd-sm">{f.l}{value === f.l ? ' ✓' : ''}</span>
              <span className="t-p-small muted">{f.s}</span>
            </span>
          </button>
        ))}
      </div>
    </>
  )
}

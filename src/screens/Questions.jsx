import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Screen, Footer } from '../components/Chrome.jsx'
import { Button, Stepper } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { useFlow } from '../state/FlowContext.jsx'
import { QUESTIONS_TOTAL, PARAM_OPTIONS } from '../data/trip.js'

const PARTY = ['Solo', 'Partner', 'Friends', 'Family (kids)', 'Family (teens)', 'Parents', 'Group (6+)']

export default function Questions() {
  const navigate = useNavigate()
  const { answers, setAnswers, params, setParam, variant } = useFlow()
  const [step, setStep] = useState(0)

  const set = (k, v) => setAnswers((a) => ({ ...a, [k]: v }))

  function back() { step === 0 ? navigate(variant === 'noQuestions' ? '/score' : variant === 'expert' ? '/preview' : '/') : setStep(step - 1) }
  function next() { step === QUESTIONS_TOTAL - 1 ? navigate(variant === 'noQuestions' ? '/suggestions' : '/scoring') : setStep(step + 1) }

  const answered = [
    !!answers.party && !!params.season,
    !!params.pace && !!params.crowd,
    !!params.food && !!params.photogenic && !!params.offbeat,
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

      <div className="screen-body pad" style={{ paddingTop: 18, paddingBottom: 20 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22 }}
          >
            {step === 0 && (
              <>
                <QOptionList
                  title="Who's joining you?"
                  options={PARTY} value={answers.party} onSelect={(v) => set('party', v)}
                />
                <div style={{ height: 30 }} />
                <QOptionList
                  title="When are you travelling?" hint="Helps us gauge weather and crowds."
                  options={PARAM_OPTIONS.season} value={params.season} onSelect={(v) => setParam('season', v)}
                />
              </>
            )}
            {step === 1 && (
              <>
                <QOptionList
                  title="How do you like to travel?" hint="This changes how packed each day feels."
                  options={PARAM_OPTIONS.pace} value={params.pace} onSelect={(v) => setParam('pace', v)}
                />
                <div style={{ height: 30 }} />
                <QOptionList
                  title="How do you feel about crowds?" hint="Helps us flag busy, touristy stops."
                  options={PARAM_OPTIONS.crowd} value={params.crowd} onSelect={(v) => setParam('crowd', v)}
                />
              </>
            )}
            {step === 2 && (
              <>
                <QOptionList
                  title="What's your food preference?" hint="We'll check how well the trip caters to it."
                  options={PARAM_OPTIONS.food} value={params.food} onSelect={(v) => setParam('food', v)}
                />
                <div style={{ height: 30 }} />
                <QOptionList
                  title="How photogenic should it be?" hint="For that Instagram-worthy itinerary."
                  options={PARAM_OPTIONS.photogenic} value={params.photogenic} onSelect={(v) => setParam('photogenic', v)}
                />
                <div style={{ height: 30 }} />
                <QOptionList
                  title="Popular spots or offbeat ones?" hint="Hidden gems vs. the well-trodden path."
                  options={PARAM_OPTIONS.offbeat} value={params.offbeat} onSelect={(v) => setParam('offbeat', v)}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer>
        <Button full disabled={!answered} onClick={next}>
          {step === QUESTIONS_TOTAL - 1
            ? (variant === 'expert' ? 'Send to an expert' : variant === 'noQuestions' ? 'See my suggestions' : 'Score my itinerary')
            : 'Next'}
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

// Shared single-select pill row, used by every question.
function QOptionList({ title, hint, options, value, onSelect }) {
  return (
    <>
      <QTitle hint={hint}>{title}</QTitle>
      <div className="chips" style={{ marginTop: 14 }}>
        {options.map((o) => {
          const on = value === o
          return (
            <button key={o} className={`chip${on ? ' is-sel' : ''}`} onClick={() => onSelect(o)}>
              {o}{on ? ' ✓' : ''}
            </button>
          )
        })}
      </div>
    </>
  )
}

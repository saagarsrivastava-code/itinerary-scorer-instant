import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen, AppBar, Footer } from '../components/Chrome.jsx'
import { Button, ScoreDial, Sheet } from '../components/ui.jsx'
import { ExpertScoreCard, ExpertChatSheet, ExpertCallOverlay } from '../components/ExpertContact.jsx'
import Icon from '../components/Icon.jsx'
import { SCORE, TRIP, getScoreBreakdown } from '../data/trip.js'
import { useFlow } from '../state/FlowContext.jsx'
import ParamsOverview from './ParamsOverview.jsx'

export default function ScoreOverview() {
  const { variant } = useFlow()
  return variant === 'noQuestions' ? <ParamsOverview /> : <StandardScoreOverview />
}

/* ── v1/v2 · instant AI & expert-review score screen ────────────
   Wireframe: score dial + summary, then a per-preference breakdown
   ("Pace of the trip 4/10 — based on your preference…"). Tapping a row
   opens a bottom sheet that shows where that parameter's issues sit in
   the date-wise itinerary. */
function StandardScoreOverview() {
  const navigate = useNavigate()
  const { baseScore, variant, params } = useFlow()
  const rows = getScoreBreakdown(params)
  const [active, setActive] = useState(null) // breakdown row shown in the sheet
  const [chat, setChat] = useState(false)
  const [call, setCall] = useState(false)

  return (
    <Screen>
      <AppBar
        title="Your itinerary score"
        subtitle={`${TRIP.destination} · ${TRIP.durationDays} days`}
        onBack={() => navigate(variant === 'expert' ? '/preview' : '/')}
        right={<button className="appbar__back" aria-label="Share"><Icon name="share" size={20} /></button>}
      />

      <div className="screen-body pad" style={{ paddingBottom: 96 }}>
        <ScoreDial value={baseScore} />

        <motion.p
          className="t-p-large center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ marginTop: 16, color: 'var(--neutral-grey-700)' }}
        >
          {SCORE.summary}
        </motion.p>

        <h3 className="t-hd-sm" style={{ marginTop: 24 }}>What's working and what isn't</h3>
        <div className="t-p-small muted" style={{ marginTop: 4 }}>Tap a parameter to see where it shows up in your plan.</div>
        <div style={{ marginTop: 2 }}>
          {rows.map(({ key, ...r }, i) => (
            <BreakdownRow
              key={key}
              {...r}
              icon={PARAM_ICONS[key]}
              delay={0.4 + i * 0.08}
              onClick={() => setActive({ ...r, icon: PARAM_ICONS[key] })}
            />
          ))}
        </div>

        {variant === 'expert' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ marginTop: 20 }}>
            <ExpertScoreCard onChat={() => setChat(true)} onCall={() => setCall(true)} />
          </motion.div>
        )}
      </div>

      <Footer>
        <Button full onClick={() => navigate('/recommendations')}>Show recommendations</Button>
      </Footer>

      <ParamIssueSheet row={active} onClose={() => setActive(null)} />

      {variant === 'expert' && (
        <>
          <ExpertChatSheet open={chat} onClose={() => setChat(false)} />
          <ExpertCallOverlay open={call} onClose={() => setCall(false)} />
        </>
      )}
    </Screen>
  )
}

function scoreColor10(score) {
  return score >= 7 ? 'var(--feedback-positive)' : score >= 5 ? 'var(--feedback-warning)' : 'var(--feedback-negative)'
}

const PARAM_ICONS = { pace: 'clock', crowd: 'user', route: 'route', food: 'star', photogenic: 'image', offbeat: 'compass' }

/* Score-out-of-10 card: icon chip + label, score bar, and a
   preference-tied note underneath. Tappable. */
function BreakdownRow({ label, score, note, icon, delay = 0, onClick }) {
  const color = scoreColor10(score)
  return (
    <button className="dim dim--card" style={{ width: '100%', display: 'block', textAlign: 'left' }} onClick={onClick}>
      <div className="dim__head">
        <span className="row" style={{ gap: 9, alignItems: 'center', minWidth: 0 }}>
          <span className="dim__icn"><Icon name={icon} size={15} /></span>
          <span className="t-p-med" style={{ fontWeight: 600 }}>{label}</span>
        </span>
        <span className="row" style={{ gap: 5, alignItems: 'center', flexShrink: 0 }}>
          <span style={{ font: '700 14px/1 var(--font-body)', color }}>{score}/10</span>
          <Icon name="back" size={14} style={{ transform: 'rotate(180deg)', color: 'var(--content-tertiary)' }} />
        </span>
      </div>
      <div className="dim__track">
        <motion.div
          className="dim__fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="t-p-small muted" style={{ marginTop: 8 }}>{note}</div>
    </button>
  )
}

/* stopId → { stop, day } lookup for the issue sheet. */
function findStop(id) {
  for (const day of TRIP.days) {
    const stop = day.stops.find((s) => s.id === id)
    if (stop) return { stop, day }
  }
  return null
}

/* Bottom sheet: the tapped parameter pinned on top, then only the slices of
   the plan where that parameter shows up — one evidence card per finding,
   instead of scrolling the whole date-wise itinerary. */
function ParamIssueSheet({ row, onClose }) {
  return (
    <Sheet open={!!row} onClose={onClose} height="88%">
      {row && (
        <>
          <div style={{ marginTop: 2 }}>
            <div className="dim__head" style={{ alignItems: 'center' }}>
              <span className="row" style={{ gap: 9, alignItems: 'center', minWidth: 0 }}>
                {row.icon && <span className="dim__icn"><Icon name={row.icon} size={15} /></span>}
                <span className="t-hd-sm">{row.label}</span>
              </span>
              <span style={{ font: '700 15px/1 var(--font-body)', color: scoreColor10(row.score) }}>{row.score}/10</span>
            </div>
            <div className="dim__track" style={{ marginTop: 8 }}>
              <div className="dim__fill" style={{ width: `${row.score * 10}%`, background: scoreColor10(row.score) }} />
            </div>
            <div className="t-p-small muted" style={{ marginTop: 8 }}>{row.note}</div>
          </div>

          <div style={{ height: 1, background: 'var(--border-opaque)', margin: '16px 0 2px' }} />

          <div className="day-label" style={{ marginTop: 14 }}>Where this shows up in your plan</div>

          {row.issues.map((issue, idx) => {
            const spots = issue.stopIds.map(findStop).filter(Boolean)
            if (spots.length === 0) return null
            const day = spots[0].day
            return (
              <div key={idx} className={`evcard${issue.good ? ' evcard--good' : ''}`}>
                <div className="evcard__day">{day.label} · {day.date}</div>
                <div className="evcard__stops">
                  {spots.map(({ stop }) => (
                    <div key={stop.id} className="evstop">
                      <span className="evstop__time">{stop.time || '—'}</span>
                      <span className="evstop__name">{stop.name}</span>
                    </div>
                  ))}
                </div>
                <div className={`issuecall${issue.good ? ' issuecall--good' : ' issuecall--bad'}`}>
                  <div className="issuecall__tag">{issue.tag}</div>
                  {issue.text}
                </div>
              </div>
            )
          })}
          <div style={{ height: 10 }} />
        </>
      )}
    </Sheet>
  )
}

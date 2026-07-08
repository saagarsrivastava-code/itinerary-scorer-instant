import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen, AppBar, Footer } from '../components/Chrome.jsx'
import { Button, CategoryPill, ScoreBadge } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { TRIP, SUGGESTIONS, PACE_TIPS } from '../data/trip.js'
import { useFlow } from '../state/FlowContext.jsx'

// Recommendations shown inline within the itinerary (wireframe): each stop
// that has a suggestion gets an explicit before/after "change card" attached
// right below it, so it's clear what is being swapped and why. Suggestions
// with no target stop (pure adds) sit at the end of their day. The score
// badge in the app bar updates live as suggestions are applied.
export default function Recommendations() {
  const navigate = useNavigate()
  const { params, applySuggestion, isApplied, newScore, applied } = useFlow()

  // Suggestions that don't attach to an existing stop, grouped by day
  // ("All nights" → Day 1).
  const floatingByDay = useMemo(() => {
    const m = {}
    for (const s of SUGGESTIONS) {
      if (s.targetStopId) continue
      const day = s.suggested.day?.startsWith('Day') ? s.suggested.day : 'Day 1'
      ;(m[day] ||= []).push(s)
    }
    return m
  }, [])
  const anchoredTo = (stopId) => SUGGESTIONS.filter((s) => s.targetStopId === stopId)

  return (
    <Screen>
      <AppBar
        title={`Your trip to ${TRIP.destination}`}
        subtitle={TRIP.dateRange}
        onBack={() => navigate('/score')}
        right={<ScoreBadge value={newScore} />}
      />

      <div className="screen-body pad" style={{ paddingBottom: 96 }}>
        <div className="banner banner--warn" style={{ marginTop: 4 }}>
          <Icon name="sparkle" size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span><strong>Since you prefer a {params.pace.toLowerCase()} pace:</strong> {PACE_TIPS[params.pace] || PACE_TIPS.Balanced}</span>
        </div>

        {TRIP.days.map((day) => {
          const dayKey = day.label.split(' — ')[0]
          const floating = floatingByDay[dayKey] || []
          return (
            <div key={day.label} style={{ marginTop: 18 }}>
              <div className="day-label">{day.label} · {day.date}</div>
              <div style={{ marginTop: 10 }}>
                {day.stops.map((stop) => (
                  <div key={stop.id}>
                    <div className="stop" style={{ marginTop: 8 }}>
                      <div className="stop__time">{stop.time || '—'}</div>
                      <div className="stop__body">
                        <div className="stop__name">{stop.name}</div>
                        <div style={{ marginTop: 5 }}><CategoryPill category={stop.category} /></div>
                      </div>
                    </div>
                    {anchoredTo(stop.id).map((s) => (
                      <ChangeCard
                        key={s.id}
                        s={s}
                        anchored
                        applied={isApplied(s.id)}
                        onApply={() => applySuggestion(s)}
                        onDetails={() => navigate(`/suggestions/${s.id}`)}
                      />
                    ))}
                  </div>
                ))}
                {floating.map((s) => (
                  <ChangeCard
                    key={s.id}
                    s={s}
                    applied={isApplied(s.id)}
                    onApply={() => applySuggestion(s)}
                    onDetails={() => navigate(`/suggestions/${s.id}`)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <Footer>
        <Button full onClick={() => navigate('/updated')}>
          Proceed to booking{applied.length > 0 ? ` · ${applied.length} added` : ''}
        </Button>
      </Footer>
    </Screen>
  )
}

const CHANGE_VERB = {
  'Swap this stop': 'Swap',
  'Add this stop': 'Add',
  'Better timing': 'Shift',
  'Better stay': 'Swap',
  'Better route': 'Reorder',
}
const CHANGE_ICON = { Stops: 'pin', Timing: 'clock', Stays: 'home', Route: 'route' }

/* Before/after change card, attached under the stop it modifies:
   what's in the plan now → what we suggest instead, why, and a
   verb-specific action (Swap / Shift / Add / Reorder). */
function ChangeCard({ s, anchored, applied, onApply, onDetails }) {
  const verb = CHANGE_VERB[s.typeLabel] || 'Add'
  const isAdd = verb === 'Add'
  return (
    <motion.div
      className={`chg${anchored ? ' chg--anchored' : ''}`}
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="chg__head">
        <span className="chg__type">
          <Icon name={CHANGE_ICON[s.type] || 'sparkle'} size={12} />
          {s.typeLabel}
        </span>
        <span className="chg__delta">+{s.scoreDelta} pts</span>
      </div>

      <button className="chg__diff" onClick={onDetails}>
        <div className="chg__row chg__row--old">
          <span className="chg__marker">{isAdd ? 'Gap' : 'Now'}</span>
          <span className="chg__name">
            <span className={isAdd ? undefined : 'chg__strike'}>{s.current.name}</span>
            {s.current.meta && <span className="chg__meta">{s.current.meta}</span>}
          </span>
        </div>
        <div className="chg__row chg__row--new">
          <span className="chg__marker">{isAdd ? 'Add' : 'New'}</span>
          <span className="chg__name">
            {s.suggested.name}
            {s.suggested.meta && <span className="chg__meta">{s.suggested.meta}</span>}
          </span>
        </div>
      </button>

      <div className="chg__foot">
        <span className="chg__impact">{s.impact}</span>
        {applied ? (
          <Button variant="soft" size="sm" onClick={onDetails}>Done ✓</Button>
        ) : (
          <Button size="sm" onClick={onApply}>{verb}</Button>
        )}
      </div>
    </motion.div>
  )
}

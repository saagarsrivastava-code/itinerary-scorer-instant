import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen, Footer } from '../components/Chrome.jsx'
import { Button, CategoryPill } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { SUGGESTIONS } from '../data/trip.js'
import { useFlow } from '../state/FlowContext.jsx'

const CONFETTI = ['var(--brand-primary)', 'var(--feedback-positive)', 'var(--secondary-blue-300)', 'var(--alert-yellow-400)']

export default function UpdatedItinerary() {
  const navigate = useNavigate()
  const { baseScore, newScore, applied } = useFlow()
  const remaining = SUGGESTIONS.length - applied.length

  // Representative updated day, marking applied changes.
  const stops = [
    { time: '09:00', name: 'Eiffel Tower', badge: 'improved' },
    { time: '15:00', name: "Musée d'Orsay", category: 'culture', badge: 'new' },
    { time: '19:30', name: 'Le Comptoir' },
  ]

  return (
    <Screen>
      {/* Celebration banner — slides in from top after a beat */}
      <motion.div
        className="celebrate"
        initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 26 }}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {CONFETTI.map((c, i) => (
          <motion.span
            key={i}
            className="confetti"
            style={{ background: c, left: `${12 + i * 22}%` }}
            initial={{ y: -10, opacity: 0, rotate: 0 }}
            animate={{ y: 90, opacity: [0, 1, 0], rotate: 220 }}
            transition={{ delay: 0.6 + i * 0.07, duration: 1.1 }}
          />
        ))}
        <div className="celebrate__tick"><Icon name="check" size={22} /></div>
        <div>
          <div className="t-hd-sm" style={{ color: 'var(--success-green-700)' }}>
            Score improved: {baseScore} → {newScore} ↑
          </div>
          <div className="t-lb-sm" style={{ color: 'var(--success-green-500)' }}>
            {applied.length > 0 ? `${applied.length} change${applied.length > 1 ? 's' : ''} applied` : 'Your itinerary is ready'}
          </div>
        </div>
      </motion.div>

      <div className="screen-body pad" style={{ paddingTop: 16, paddingBottom: 20 }}>
        <h1 className="t-hd-large">Your updated itinerary</h1>

        <div className="day-label" style={{ marginTop: 16 }}>Day 2 — Paris</div>
        <div className="stack-8" style={{ marginTop: 10 }}>
          {stops.map((s) => (
            <div
              key={s.name}
              className="stop"
              style={s.badge === 'new' ? { borderColor: 'var(--feedback-positive)', background: 'var(--success-green-000)' } : undefined}
            >
              <div className="stop__time">{s.time}</div>
              <div className="stop__body">
                <div className="stop__name">{s.name}</div>
                {s.category && <div style={{ marginTop: 5 }}><CategoryPill category={s.category} /></div>}
              </div>
              {s.badge === 'improved' && <span className="badge badge--improved">Improved</span>}
              {s.badge === 'new' && <span className="badge badge--new">New</span>}
            </div>
          ))}
        </div>

        {remaining > 0 && (
          <button
            className="card"
            style={{ width: '100%', padding: 12, marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px dashed var(--border-strong)', boxShadow: 'none' }}
            onClick={() => navigate('/suggestions')}
          >
            <span className="t-p-med">{remaining} more improvement{remaining > 1 ? 's' : ''} available</span>
            <Icon name="arrowRight" size={18} />
          </button>
        )}
      </div>

      <Footer>
        <Button full icon="share">Share this itinerary</Button>
        <button className="btn btn--text" style={{ margin: '12px auto 0', textDecoration: 'underline' }}>
          Happy with this? Save your travel profile →
        </button>
      </Footer>
    </Screen>
  )
}

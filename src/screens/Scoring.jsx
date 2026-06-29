import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Screen, Footer } from '../components/Chrome.jsx'
import { Button } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { LOADING_MESSAGES } from '../data/trip.js'

export default function Scoring() {
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
          <button className="btn btn--text" style={{ margin: '12px auto 0', fontSize: 11, opacity: 0.5 }} onClick={() => setError(true)}>
            (demo: simulate error)
          </button>
        </div>
      </div>
    </Screen>
  )
}

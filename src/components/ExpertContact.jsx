import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from './Icon.jsx'
import { Sheet } from './ui.jsx'
import { EXPERT } from '../data/trip.js'

/* In-body card shown on the score screen (expert variant only). */
export function ExpertScoreCard({ onChat, onCall }) {
  return (
    <div className="expert-score">
      <div className="expert-score__top">
        <img className="expert-card__av" src={EXPERT.avatar} alt={EXPERT.name} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="t-lb-sm muted">Reviewed by your expert</div>
          <div className="t-hd-sm">{EXPERT.name}</div>
          <span className="expert-card__verify"><Icon name="check" size={13} />{EXPERT.title.split(' · ')[0]}</span>
        </div>
      </div>
      <p className="t-p-small muted" style={{ marginTop: 10 }}>
        “I went through your Thailand plan stop by stop — most of the wins are on Day 2.
        Ask me anything about the changes.”
      </p>
      <div className="row" style={{ gap: 10, marginTop: 12 }}>
        <button className="btn btn--ghost btn--md" style={{ flex: 1 }} onClick={onChat}>
          <Icon name="chat" size={18} /> Chat
        </button>
        <button className="btn btn--ghost btn--md" style={{ flex: 1 }} onClick={onCall}>
          <Icon name="phone" size={18} /> Call
        </button>
      </div>
    </div>
  )
}

/* ── Chat sheet ───────────────────────────────────────────────── */
const SEED = [
  { from: 'them', text: `Hi! I'm ${EXPERT.name.split(' ')[0]} — I reviewed your Thailand itinerary. Day 1 around Big Buddha looks great. 👍` },
  { from: 'them', text: 'The main thing I\'d change is Day 2 — there\'s some backtracking we can fix with a couple of swaps.' },
  { from: 'them', text: 'Anything you definitely want to keep, no matter what?' },
]
const REPLIES = [
  'Got it — I\'ll keep that in. Check the Suggestions tab; I\'ve prioritised the swaps that save you the most time. 🙂',
  'Makes sense. The Wat Chalong swap alone saves ~45 mins of doubling back.',
  'Happy to lock that in for you. Want me to also book the early Big Buddha slot?',
]

export function ExpertChatSheet({ open, onClose }) {
  const [msgs, setMsgs] = useState(SEED)
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)
  const replyIdx = useRef(0)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs, typing])

  function send() {
    const t = text.trim()
    if (!t) return
    setMsgs((m) => [...m, { from: 'me', text: t }])
    setText('')
    setTyping(true)
    const reply = REPLIES[replyIdx.current % REPLIES.length]
    replyIdx.current += 1
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'them', text: reply }])
    }, 1300)
  }

  return (
    <Sheet open={open} onClose={onClose} height="86%">
      <div className="chat-head">
        <img className="chat-head__av" src={EXPERT.avatar} alt={EXPERT.name} />
        <div style={{ flex: 1 }}>
          <div className="t-hd-sm">{EXPERT.name}</div>
          <div className="chat-head__status"><span className="dot-online" /> Online now</div>
        </div>
      </div>

      <div className="chat-msgs" ref={scrollRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`bubble bubble--${m.from === 'me' ? 'me' : 'them'}`}>{m.text}</div>
        ))}
        {typing && (
          <div className="bubble bubble--them bubble--typing">
            <span /><span /><span />
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          placeholder="Message Aanya…"
        />
        <button className="chat-send" onClick={send} aria-label="Send"><Icon name="send" size={20} /></button>
      </div>
    </Sheet>
  )
}

/* ── Call overlay (full-screen, mock) ─────────────────────────── */
export function ExpertCallOverlay({ open, onClose }) {
  const [phase, setPhase] = useState('ringing') // ringing → connected
  const [secs, setSecs] = useState(0)

  useEffect(() => {
    if (!open) { setPhase('ringing'); setSecs(0); return }
    const toConnected = setTimeout(() => setPhase('connected'), 2400)
    return () => clearTimeout(toConnected)
  }, [open])

  useEffect(() => {
    if (phase !== 'connected') return
    const t = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  const mmss = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="call"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="call__top">
            <div className="call__avwrap">
              {phase === 'ringing' && <motion.span className="call__pulse" animate={{ scale: [1, 1.35], opacity: [0.5, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />}
              <img className="call__av" src={EXPERT.avatar} alt={EXPERT.name} />
            </div>
            <div className="call__name">{EXPERT.name}</div>
            <div className="call__status">{phase === 'ringing' ? 'Calling…' : mmss}</div>
            <div className="call__sub">{EXPERT.title}</div>
          </div>

          <div className="call__controls">
            <button className="call__btn"><Icon name="mic" size={24} /></button>
            <button className="call__end" onClick={onClose} aria-label="End call"><Icon name="phone" size={26} /></button>
            <button className="call__btn"><Icon name="speaker" size={24} /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

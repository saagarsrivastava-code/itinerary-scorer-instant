import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import { CATEGORIES, scoreBand } from '../data/trip.js'

/* ── Button ───────────────────────────────────────────────────── */
export function Button({ children, variant = 'primary', full, onClick, disabled, icon, size = 'lg' }) {
  return (
    <button
      className={`btn btn--${variant} btn--${size}${full ? ' btn--full' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {icon && <Icon name={icon} size={18} />}
    </button>
  )
}

/* ── Category pill ────────────────────────────────────────────── */
export function CategoryPill({ category }) {
  const c = CATEGORIES[category]
  if (!c) return null
  return (
    <span className="pill">
      <span className="pill__dot" style={{ background: c.color }} />
      {c.label}
    </span>
  )
}

/* ── Progress stepper ("2 of 5") ──────────────────────────────── */
export function Stepper({ current, total }) {
  return (
    <div className="stepper">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`stepper__seg${i < current ? ' is-on' : ''}`} />
      ))}
    </div>
  )
}

/* ── Dimension bar row (Screen 6) ─────────────────────────────── */
export function DimensionBar({ label, pct, band, delay = 0 }) {
  const tone =
    band === 'Needs work' ? 'var(--feedback-warning)' :
    band === 'Excellent' ? 'var(--feedback-positive)' : 'var(--brand-primary-bright)'
  return (
    <div className="dim">
      <div className="dim__head">
        <span className="t-p-med">{label}</span>
        <span className="t-p-small" style={{ color: 'var(--content-secondary)' }}>{band}</span>
      </div>
      <div className="dim__track">
        <motion.div
          className="dim__fill"
          style={{ background: tone }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

/* ── Score dial — animates 0 → value on mount ─────────────────── */
export function ScoreDial({ value, size = 168 }) {
  const band = scoreBand(value)
  const [display, setDisplay] = useState(0)
  const [sweep, setSweep] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const dur = 900
    let raf
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setDisplay(Math.round(eased * value))
      setSweep(eased * value)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])

  const ring = `conic-gradient(${band.color} 0 ${sweep}%, var(--bg-tertiary) ${sweep}% 100%)`
  const inner = size - 36
  return (
    <div className="dial" style={{ width: size, height: size, background: ring }}>
      <div className="dial__inner" style={{ width: inner, height: inner }}>
        <div className="dial__num" style={{ color: band.color }}>{display}</div>
        <div className="t-lb-sm muted">out of 100</div>
      </div>
    </div>
  )
}

/* ── Avatar stack (social proof) ──────────────────────────────── */
export function AvatarStack({ colors = ['#CFDBE9', '#BBC9D9', '#8C9AAA'] }) {
  return (
    <span className="avatars">
      {colors.map((c, i) => (
        <span key={i} className="avatars__a" style={{ background: c, marginLeft: i ? -9 : 0 }} />
      ))}
    </span>
  )
}

/* ── Bottom sheet ─────────────────────────────────────────────── */
export function Sheet({ open, onClose, children, height = '72%' }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="sheet__scrim"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />
          <motion.div
            className="sheet"
            style={{ maxHeight: height }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => { if (info.offset.y > 110) onClose() }}
          >
            <div className="sheet__handle" />
            <div className="sheet__content">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Photo — real image with gradient fallback while loading ──── */
export function Photo({ src, alt = '', tag, fallback, className = '', style, children }) {
  return (
    <div className={`photo ${className}`} style={{ '--ph': fallback, ...style }}>
      {src && <img src={src} alt={alt} loading="lazy" />}
      {tag && <span className="photo__tag">{tag}</span>}
      {children}
    </div>
  )
}

/* ── Score delta pill ─────────────────────────────────────────── */
export function ScorePill({ from, to, arrow }) {
  return (
    <span className="scorepill">
      Score: {from} <Icon name="arrowRight" size={14} /> {to}{arrow ? ' ↑' : ''}
    </span>
  )
}

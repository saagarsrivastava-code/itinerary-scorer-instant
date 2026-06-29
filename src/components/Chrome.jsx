import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'

/* Full-screen transition wrapper used by every screen.
   Top padding respects the device safe area (notch / status bar). */
export function Screen({ children, className = '' }) {
  return (
    <motion.div
      className={`screen ${className}`}
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute',
        inset: 0,
        paddingTop: 'env(safe-area-inset-top, 8px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </motion.div>
  )
}

export function AppBar({ title, subtitle, onBack, right }) {
  const navigate = useNavigate()
  return (
    <div className="appbar">
      {onBack !== null && (
        <button className="appbar__back" onClick={onBack || (() => navigate(-1))} aria-label="Back">
          <Icon name="back" size={22} />
        </button>
      )}
      <div className="appbar__titles">
        {title && <div className="t-hd-sm">{title}</div>}
        {subtitle && <div className="t-p-small muted">{subtitle}</div>}
      </div>
      {right && <div className="appbar__right">{right}</div>}
    </div>
  )
}

export function Footer({ children }) {
  return <div className="footer">{children}</div>
}

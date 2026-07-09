import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Screen } from '../components/Chrome.jsx'
import { Button, Sheet } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { useFlow } from '../state/FlowContext.jsx'
import heroIllustration from '../assets/hero-illustration.png'

const ROTATING_WORDS = ['good?', 'efficient?', 'worth it?']

/* Rotating word — mirrors the fade/slide cycle from the reference landing page. */
function RotatingWord() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % ROTATING_WORDS.length), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ position: 'relative', display: 'inline-block', height: '1.2em', minWidth: '6.5ch', overflow: 'hidden', verticalAlign: 'bottom' }}>
      <AnimatePresence>
        <motion.span
          key={i}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap' }}
        >
          {ROTATING_WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function UploadEntry() {
  const navigate = useNavigate()
  const { setSource, variant } = useFlow()
  const [sheet, setSheet] = useState(false)

  // Instant AI skips the parse-confirmation screen entirely — upload goes
  // straight into the questionnaire (wireframe flow). Expert review keeps it.
  const afterUpload = variant === 'noQuestions' ? '/scoring' : variant === 'instant' ? '/questions' : '/preview'

  return (
    <Screen>
      <div className="screen-body pad" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}>
        <div style={{ paddingTop: 14 }} className="wordmark">
          <span className="wordmark__dot"><Icon name="compass" size={17} /></span>
          <span className="wordmark__name">scapia<span> trips</span></span>
        </div>

        <motion.div
          initial="hide" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }}
          style={{ marginTop: 52 }}
        >
          <motion.h1
            variants={{ hide: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            style={{ font: '700 33px/1.18 var(--font-body)', letterSpacing: '-0.01em' }}
          >
            You built the itinerary.<br />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontStyle: 'italic', color: 'var(--brand-primary)' }}>
              Is it actually <RotatingWord />
            </span>
          </motion.h1>
          <motion.p
            variants={{ hide: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            className="t-p-large muted"
            style={{ marginTop: 14 }}
          >
            Most self-planned trips have hidden gaps. Find yours before you book.
          </motion.p>

          <motion.img
            variants={{ hide: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
            src={heroIllustration}
            alt="Preview of an itinerary scored 72/100 with pace, crowd and route ratings"
            style={{ display: 'block', width: '100%', maxWidth: 330, margin: '30px auto 0' }}
          />
        </motion.div>

        <div className="spacer" style={{ minHeight: 28 }} />

        <Button full icon="upload" onClick={() => setSheet(true)}>Upload my itinerary</Button>
        <div style={{ height: 10 }} />
        <Button full variant="ghost" onClick={() => { setSource('Pasted text'); setSheet(true) }}>
          Paste as text instead
        </Button>
      </div>

      <UploadSheet open={sheet} onClose={() => setSheet(false)} onConfirm={() => navigate(afterUpload)} />
    </Screen>
  )
}

/* ── Upload sheet with all states (S2) ────────────────────────── */
function UploadSheet({ open, onClose, onConfirm }) {
  // state: 'empty' | 'file' | 'uploading' | 'error' | 'text'
  const [state, setState] = useState('empty')
  const [text, setText] = useState('')

  function reset() { setState('empty'); setText('') }
  function close() { onClose(); setTimeout(reset, 300) }

  function pickFile() { setState('file') }
  function tooLarge() { setState('error') }

  function confirm() {
    setState('uploading')
    setTimeout(() => { close(); onConfirm() }, 1400)
  }

  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const canConfirm = state === 'file' || (state === 'text' && words > 0) || (state === 'empty' && words > 0)

  return (
    <Sheet open={open} onClose={close} height="78%">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2 className="t-hd-large">Add your itinerary</h2>
      </div>

      {state === 'error' ? (
        <div className="dropzone dropzone--err" style={{ marginTop: 14 }}>
          <span className="dropzone__icn" style={{ background: 'var(--warning-red-000)', color: 'var(--feedback-negative)' }}>
            <Icon name="warning" size={22} />
          </span>
          <div className="t-p-med" style={{ color: 'var(--feedback-negative)', fontWeight: 600 }}>Tap to upload PDF or image</div>
          <div className="t-p-small" style={{ color: 'var(--feedback-negative)' }}>File too large (max 10 MB). Try a smaller file or paste as text.</div>
        </div>
      ) : state === 'file' || state === 'uploading' ? (
        <div style={{ marginTop: 14 }}>
          <div className="filechip">
            <span className="filechip__icn"><Icon name="doc" size={22} /></span>
            <div style={{ flex: 1 }}>
              <div className="t-shd-sm">phuket-krabi-trip.pdf</div>
              <div className="t-lb-sm muted">1.2 MB</div>
            </div>
            {state === 'file' && <button onClick={reset} aria-label="Remove"><Icon name="close" size={18} /></button>}
          </div>
          {state === 'uploading' && (
            <div style={{ marginTop: 16 }}>
              <div className="t-p-small muted" style={{ marginBottom: 6 }}>Uploading… 60%</div>
              <div className="dim__track"><motion.div className="dim__fill" style={{ background: 'var(--brand-primary)' }} initial={{ width: '15%' }} animate={{ width: '95%' }} transition={{ duration: 1.3 }} /></div>
            </div>
          )}
        </div>
      ) : (
        <button className="dropzone" style={{ marginTop: 14 }} onClick={pickFile}>
          <span className="dropzone__icn"><Icon name="upload" size={22} /></span>
          <div className="t-p-large" style={{ color: 'var(--content-primary)', fontWeight: 500 }}>Tap to upload PDF or image</div>
          <div className="t-lb-sm muted">PDF, JPG, PNG supported</div>
        </button>
      )}

      {state !== 'uploading' && (
        <>
          <div className="divider-or">or</div>
          <textarea
            className="textbox"
            placeholder="Paste your itinerary here…"
            value={text}
            onChange={(e) => { setText(e.target.value); if (state === 'empty') setState('text') }}
          />
          <div className="t-lb-sm muted" style={{ textAlign: 'right', marginTop: 5 }}>{words} words</div>
        </>
      )}

      <div style={{ height: 18 }} />
      <Button full onClick={confirm} disabled={!canConfirm || state === 'uploading'}>
        {state === 'uploading' ? 'Uploading…' : 'Confirm'}
      </Button>
      <button className="btn btn--text" style={{ margin: '10px auto 0' }} onClick={close}>Cancel</button>

      {/* dev affordance to demo the error state */}
      {state === 'empty' && (
        <button className="btn btn--text" style={{ margin: '2px auto 0', fontSize: 11, opacity: 0.5 }} onClick={tooLarge}>
          (demo: simulate too-large file)
        </button>
      )}
    </Sheet>
  )
}

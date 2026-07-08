import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Screen, AppBar, Footer } from '../components/Chrome.jsx'
import { Button, CategoryPill } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { TRIP } from '../data/trip.js'
import { useFlow } from '../state/FlowContext.jsx'

export default function ParsedPreview() {
  const navigate = useNavigate()
  const { variant } = useFlow()
  const [empty, setEmpty] = useState(false)
  const [editing, setEditing] = useState(null)

  const backTarget = variant === 'noQuestions' ? '/score' : '/'

  if (empty) return <EmptyParse onRetry={() => setEmpty(false)} onBack={() => navigate(backTarget)} />

  return (
    <Screen>
      <AppBar title="Your itinerary" subtitle="Is this right? Tap any item to edit." onBack={() => navigate(backTarget)} />
      <div className="screen-body pad" style={{ paddingBottom: 90 }}>
        <div className="banner banner--warn" style={{ marginTop: 4 }}>
          <Icon name="warning" size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Something look off? Edit below or re-upload.</span>
        </div>

        {TRIP.days.map((day) => (
          <div key={day.label} style={{ marginTop: 18 }}>
            <div className="day-label">{day.label} · {day.date}</div>
            <div style={{ marginTop: 10 }}>
              {day.stops.map((stop) => (
                <div key={stop.id}>
                  <StopRow
                    stop={stop}
                    editing={editing === stop.id}
                    onEdit={() => setEditing(editing === stop.id ? null : stop.id)}
                  />
                  {stop.transitAfter && editing !== stop.id && (
                    <div className="transit">
                      <Icon name={stop.transitAfter.mode === 'Walk' ? 'walk' : stop.transitAfter.mode === 'Metro' ? 'metro' : 'car'} size={15} />
                      {stop.transitAfter.mode.toLowerCase()} · {stop.transitAfter.mins} min
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button className="btn btn--text" style={{ margin: '20px auto 0', fontSize: 11, opacity: 0.5 }} onClick={() => setEmpty(true)}>
          (demo: show empty-parse state)
        </button>
      </div>

      {/* Add-stop FAB */}
      <button
        aria-label="Add stop"
        style={{
          position: 'absolute', right: 18, bottom: 96, width: 52, height: 52, borderRadius: '50%',
          background: 'var(--brand-dark)', color: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: 'var(--shadow-float)', zIndex: 15,
        }}
      >
        <Icon name="plus" size={24} />
      </button>

      <Footer>
        <Button full onClick={() => navigate(variant === 'noQuestions' ? '/score' : '/questions')}>
          {variant === 'noQuestions' ? 'Done' : 'Looks good — continue'}
        </Button>
      </Footer>
    </Screen>
  )
}

function StopRow({ stop, editing, onEdit }) {
  return (
    <motion.div layout style={{ marginTop: 8 }}>
      <div className="stop" style={editing ? { borderColor: 'var(--content-primary)', boxShadow: 'none' } : undefined} onClick={onEdit}>
        <div className="stop__time">{stop.time || '—'}</div>
        <div className="stop__body">
          <div className="stop__name">{stop.name}</div>
          <div style={{ marginTop: 5 }}><CategoryPill category={stop.category} /></div>
        </div>
        <span className="stop__edit"><Icon name="pencil" size={18} /></span>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <EditForm stop={stop} onDone={onEdit} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function EditForm({ stop, onDone }) {
  return (
    <div className="card" style={{ padding: 14, marginTop: 8, background: 'var(--bg-secondary)', boxShadow: 'none' }}>
      <Field label="Name"><div className="textbox" style={{ minHeight: 0, padding: '10px 12px' }}>{stop.name}</div></Field>
      <div className="row" style={{ gap: 10, marginTop: 10, alignItems: 'flex-end' }}>
        <Field label="Category" style={{ flex: 1 }}>
          <div className="textbox" style={{ minHeight: 0, padding: '10px 12px', display: 'flex', justifyContent: 'space-between' }}>
            <CategoryPill category={stop.category} /><span>▾</span>
          </div>
        </Field>
        <Field label="Time" style={{ width: 100 }}>
          <div className="textbox" style={{ minHeight: 0, padding: '10px 12px' }}>{stop.time || '—'}</div>
        </Field>
      </div>
      <Field label="Date" style={{ marginTop: 10 }}>
        <div className="textbox" style={{ minHeight: 0, padding: '10px 12px' }}>Mon 14 Apr 2026</div>
      </Field>
      <div className="row" style={{ gap: 10, marginTop: 14 }}>
        <Button variant="ghost" size="md" full onClick={onDone}>Remove</Button>
        <Button size="md" full onClick={onDone}>Done</Button>
      </div>
    </div>
  )
}

function Field({ label, children, style }) {
  return (
    <label style={{ display: 'block', ...style }}>
      <div className="t-lb-sm muted" style={{ marginBottom: 4 }}>{label}</div>
      {children}
    </label>
  )
}

function EmptyParse({ onRetry, onBack }) {
  const navigate = useNavigate()
  return (
    <Screen>
      <AppBar title="Your itinerary" onBack={onBack} />
      <div className="empty">
        <div className="empty__art"><Icon name="image" size={34} /></div>
        <div className="t-hd-med" style={{ maxWidth: 250 }}>We couldn't read this itinerary.</div>
        <div className="t-p-med muted" style={{ maxWidth: 250 }}>Try pasting it as text instead — that usually works best.</div>
      </div>
      <Footer>
        <Button full onClick={onRetry}>Try again</Button>
        <div style={{ height: 10 }} />
        <Button full variant="ghost" onClick={() => navigate('/')}>Paste as text</Button>
      </Footer>
    </Screen>
  )
}

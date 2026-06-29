import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen, Footer } from '../components/Chrome.jsx'
import { Button, Sheet, ScorePill, AvatarStack, Photo } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { SUGGESTIONS, CATEGORIES, IMAGES } from '../data/trip.js'
import { useFlow } from '../state/FlowContext.jsx'

export default function SuggestionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { baseScore, applySuggestion, isApplied } = useFlow()
  const [sheet, setSheet] = useState(false)

  const s = SUGGESTIONS.find((x) => x.id === id)
  if (!s) { navigate('/suggestions'); return null }

  const isAdd = s.typeLabel.startsWith('Add')
  const ctaLabel = isAdd ? `Add to ${s.suggested.day}` : `Replace ${s.current.name}`

  return (
    <Screen>
      <div className="screen-body" style={{ paddingBottom: 92 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Photo className="detail-hero" src={s.suggested.image} alt={s.suggested.name} tag={CATEGORIES[s.suggested.category]?.label} fallback={photoFor(s.suggested.category)} />
          <button className="detail-hero__back" onClick={() => navigate(-1)} aria-label="Back"><Icon name="back" size={20} /></button>
        </div>

        <div className="pad" style={{ paddingTop: 16 }}>
          <h1 className="t-hd-large">{s.suggested.name}</h1>
          <div className="t-p-small muted" style={{ marginTop: 4 }}>
            {CATEGORIES[s.suggested.category]?.label}
            {s.suggested.rating ? ` · ${s.suggested.rating}★` : ''} · {s.suggested.area}
          </div>

          <div className="card" style={{ padding: 13, marginTop: 14, background: 'var(--primary-scapia-000)', border: '1.5px solid var(--brand-primary)', boxShadow: 'none' }}>
            <div className="t-p-med">
              {isAdd
                ? <>Adding this fills a gap and improves your score by <b>{s.scoreDelta} points</b>.</>
                : <>Swapping <b>{s.current.name}</b> for this {s.suggested.meta.includes('saves') ? '' : 'improves your trip and '}lifts your score by <b>{s.scoreDelta} points</b>.</>}
            </div>
          </div>

          <h3 className="t-hd-sm" style={{ marginTop: 18 }}>About</h3>
          <p className="t-p-med muted" style={{ marginTop: 6 }}>{s.suggested.about}</p>

          <div className="attrs">
            {s.suggested.attrs.map((a) => (
              <span className="attr" key={a}><Icon name="clock" size={13} />{a}</span>
            ))}
          </div>

          <h3 className="t-hd-sm" style={{ marginTop: 18 }}>What Scapia travellers say</h3>
          {s.quotes.map((q) => (
            <div className="quote" key={q.name}>
              <span className="quote__av" />
              <div>
                <div className="t-lb-sm muted">{q.name} · {q.trip}</div>
                <div className="t-p-med" style={{ marginTop: 2 }}>{q.text}</div>
              </div>
            </div>
          ))}
          <div className="row" style={{ gap: 8, marginTop: 10 }}>
            {s.social.count ? <AvatarStack /> : null}
            <span className="t-p-small muted">
              {s.social.count ? `${s.social.count} Scapia members have visited` : s.social.text}
              {s.suggested.rating ? ` · ${s.suggested.rating}★ from the tribe` : ''}
            </span>
          </div>

          {s.suggested.price && (
            <div className="banner banner--ok" style={{ marginTop: 14 }}>
              <Icon name="check" size={16} style={{ flexShrink: 0 }} />
              <span>Available on your travel dates · {s.suggested.price}</span>
            </div>
          )}

          <Photo className="mapsnip" src={IMAGES.mapSnippet} alt="Map showing the stop in route context" fallback="linear-gradient(135deg,#e7efe8,#dde8e2)">
            <span className="mapsnip__link">View full route</span>
          </Photo>
        </div>
      </div>

      <Footer>
        <div className="row" style={{ gap: 10 }}>
          <Button variant="ghost" size="md" onClick={() => navigate('/suggestions')}>Skip</Button>
          <Button size="md" full onClick={() => setSheet(true)}>{ctaLabel}</Button>
        </div>
      </Footer>

      <BookingSheet
        open={sheet}
        s={s}
        from={baseScore}
        to={Math.min(100, baseScore + s.scoreDelta)}
        applied={isApplied(s.id)}
        onApply={() => applySuggestion(s)}
        onClose={() => setSheet(false)}
        onDone={() => navigate('/updated')}
      />
    </Screen>
  )
}

function BookingSheet({ open, s, from, to, onApply, onClose, onDone }) {
  const [booked, setBooked] = useState(false)
  const bookable = !!s.suggested.price

  function close() { onClose(); setTimeout(() => setBooked(false), 300) }
  function update() { onApply(); onDone() }
  function updateAndBook() {
    onApply()
    setBooked(true)
  }

  return (
    <Sheet open={open} onClose={close} height="74%">
      {booked ? (
        <div className="col" style={{ alignItems: 'center', textAlign: 'center', paddingTop: 12 }}>
          <motion.div
            className="celebrate__tick" style={{ width: 64, height: 64 }}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          >
            <Icon name="check" size={32} />
          </motion.div>
          <h2 className="t-hd-large" style={{ marginTop: 18 }}>Booked</h2>
          <p className="t-p-med muted" style={{ marginTop: 8, maxWidth: 260 }}>
            {s.suggested.name} is on {s.suggested.day}, {s.suggested.slot}. Your itinerary and score are updated.
          </p>
          <div style={{ marginTop: 16 }}><ScorePill from={from} to={to} arrow /></div>
          <div style={{ width: '100%', marginTop: 24 }}>
            <Button full onClick={onDone}>View updated itinerary</Button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="t-hd-large">Update your itinerary?</h2>
          <div className="stack-8" style={{ marginTop: 14 }}>
            <div className="row" style={{ gap: 10 }}>
              <span className="t-lb-sm" style={{ color: 'var(--feedback-negative)', width: 58 }}>Remove</span>
              <span className="t-p-med">{s.current.name}</span>
            </div>
            <div className="row" style={{ gap: 10 }}>
              <span className="t-lb-sm" style={{ color: 'var(--feedback-positive)', width: 58 }}>Add</span>
              <span className="t-p-med">{s.suggested.name} — {s.suggested.day}, {s.suggested.slot}</span>
            </div>
          </div>
          <div style={{ marginTop: 14 }}><ScorePill from={from} to={to} /></div>

          <div style={{ height: 1, background: 'var(--border-opaque)', margin: '16px 0' }} />

          {bookable ? (
            <div className="row" style={{ gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--content-tertiary)', flexShrink: 0 }}>
                <Icon name="pin" size={18} />
              </div>
              <div>
                <div className="t-shd-sm">Book via [Partner]</div>
                <div className="t-lb-sm muted">{s.suggested.price} · Availability confirmed</div>
              </div>
            </div>
          ) : (
            <div className="banner banner--info">No booking needed — just show up.</div>
          )}

          <div style={{ height: 18 }} />
          {bookable
            ? <Button full onClick={updateAndBook}>Update + book now</Button>
            : <Button full onClick={update}>Update itinerary</Button>}
          <div style={{ height: 10 }} />
          {bookable && <Button full variant="ghost" onClick={update}>Update itinerary only</Button>}
          <button className="btn btn--text" style={{ margin: '10px auto 0' }} onClick={close}>Cancel</button>
        </>
      )}
    </Sheet>
  )
}

function photoFor(cat) {
  const c = (CATEGORIES[cat] || {}).color || 'var(--bg-tertiary)'
  return `linear-gradient(135deg, ${c}, #d7e0ec)`
}

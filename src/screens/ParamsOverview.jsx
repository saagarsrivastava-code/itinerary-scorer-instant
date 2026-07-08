import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Screen, AppBar, Footer } from '../components/Chrome.jsx'
import { Button } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { TRIP, getInferredParams, paramScoreColor } from '../data/trip.js'
import { useFlow } from '../state/FlowContext.jsx'

// v3 · "No questions" flow — this screen only infers what it can from the
// uploaded itinerary and shows it as read-only params. There's no score here:
// nothing is being graded, just picked up and (optionally) corrected via the
// questionnaire.
export default function ParamsOverview() {
  const navigate = useNavigate()
  const { params, answers } = useFlow()
  const [recalculating, setRecalculating] = useState(false)
  const paramsKey = `${params.pace}|${params.crowd}|${params.food}|${params.photogenic}|${params.offbeat}|${params.season}|${answers.party}`
  const prevKey = useRef(paramsKey)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const inferred = useMemo(() => getInferredParams(params, answers.party), [paramsKey])

  useEffect(() => {
    if (prevKey.current === paramsKey) return
    prevKey.current = paramsKey
    setRecalculating(true)
    const t = setTimeout(() => setRecalculating(false), 550)
    return () => clearTimeout(t)
  }, [paramsKey])

  return (
    <Screen>
      <AppBar
        title="Your itinerary"
        subtitle={`${TRIP.destination} · ${TRIP.durationDays} days`}
        onBack={() => navigate('/')}
        right={
          <>
            <button className="appbar__back" aria-label="View & edit itinerary" onClick={() => navigate('/preview')}>
              <Icon name="list" size={20} />
            </button>
            <button className="appbar__back" aria-label="Share"><Icon name="share" size={20} /></button>
          </>
        }
      />

      <div className="screen-body pad" style={{ paddingBottom: 96 }}>
        <AnimatePresence>
          {recalculating && (
            <motion.div
              initial={{ opacity: 0, y: -6, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="banner banner--info" style={{ marginBottom: 12, overflow: 'hidden' }}
            >
              <Icon name="sparkle" size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>Updating what we inferred…</span>
            </motion.div>
          )}
        </AnimatePresence>

        <h1 className="t-hd-large" style={{ marginTop: 4 }}>{inferred.title}</h1>
        <p className="t-p-med muted" style={{ marginTop: 6 }}>
          Here's what we picked up from your itinerary. Anything look off? Fix it in a couple of taps.
        </p>

        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 22 }}>
          <h3 className="t-hd-sm">What we inferred</h3>
          <button className="appbar__back" aria-label="Edit trip preferences" onClick={() => navigate('/questions')}>
            <Icon name="pencil" size={17} />
          </button>
        </div>

        <div className="paramtile-grid" style={{ marginTop: 10 }}>
          {inferred.params.map((p) => (
            <ParamTile key={p.key} icon={p.icon} label={p.label} value={p.value} tone={p.tone} pct={p.pct} />
          ))}
        </div>

        <div className="col" style={{ gap: 10, marginTop: 10 }}>
          {inferred.details.map((d) => (
            <DetailRow key={d.key} icon={d.icon} label={d.label} value={d.value} sub={d.sub} />
          ))}
        </div>

        <h3 className="t-hd-sm" style={{ marginTop: 24 }}>Flight insight</h3>
        <InsightCard score={inferred.flight.score} hits={inferred.flight.hits} misses={inferred.flight.misses} alternative={inferred.flight.alternative} pillStyle />

        <h3 className="t-hd-sm" style={{ marginTop: 20 }}>Hotel insight</h3>
        <InsightCard score={inferred.hotel.score} hits={inferred.hotel.hits} misses={inferred.hotel.misses} alternative={inferred.hotel.alternative} pillStyle />
      </div>

      <Footer>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFD1BD', borderRadius: 999, padding: '7px 12px', marginBottom: 10 }}>
          <Icon name="check" size={13} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
          <span className="t-lb-sm" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
            Itinerary improved with the help of a local destination expert
          </span>
        </div>
        <Button full onClick={() => navigate('/questions')}>Improve my itinerary</Button>
      </Footer>
    </Screen>
  )
}

/* ── Inferred-param tile — icon + label, value + colour-coded bar ─ */
function ParamTile({ icon, label, value, tone, pct }) {
  const color = tone === 'good' ? 'var(--feedback-positive)' : tone === 'bad' ? 'var(--feedback-negative)' : '#B18C13'
  return (
    <div className="card paramtile">
      <div className="paramtile__head">
        <span className="paramtile__icn"><Icon name={icon} size={16} /></span>
        <span className="paramtile__label">{label}</span>
      </div>
      <div className="paramtile__body">
        <span className="paramtile__value" style={{ color }}>{value}</span>
        <div className="paramtile__track">
          <div className="paramtile__fill" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    </div>
  )
}

/* ── Descriptive detail row — icon + label left, value + sub right ─ */
function DetailRow({ icon, label, value, sub }) {
  return (
    <div className="card detailrow">
      <div className="detailrow__left">
        <span className="detailrow__icn"><Icon name={icon} size={16} /></span>
        <span className="detailrow__label">{label}</span>
      </div>
      <div className="detailrow__right">
        <div className="detailrow__value">{value}</div>
        <div className="detailrow__sub">{sub}</div>
      </div>
    </div>
  )
}

function InsightCard({ score, hits, misses, alternative, pillStyle }) {
  return (
    <div className="card insight">
      <div className="insight__head">
        <span className="t-p-small muted">Score</span>
        <span className="insight__score" style={{ color: paramScoreColor(score) }}>{score}</span>
      </div>
      <div className="insight__col">
        <div className="insight__sub">Hit</div>
        {hits.map((h, i) => (
          <div key={i} className={`insight__line insight__line--hit${pillStyle ? ' insight__line--pill' : ''}`}>
            <Icon name="check" size={13} />{h}
          </div>
        ))}
      </div>
      <div className="insight__col">
        <div className="insight__sub">Miss</div>
        {misses.map((m, i) => (
          <div key={i} className={`insight__line insight__line--miss${pillStyle ? ' insight__line--pill' : ''}`}>
            <Icon name="close" size={13} />{m}
          </div>
        ))}
      </div>
      {alternative && (
        <div className="insight__col">
          <div className="insight__sub">Alternative · same price</div>
          <div className="insight__line insight__line--alt">
            <Icon name="route" size={13} />
            <span>
              <strong>{alternative.name}</strong>
              <span className="t-p-small muted" style={{ display: 'block' }}>{alternative.meta}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

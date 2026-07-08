import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen, AppBar } from '../components/Chrome.jsx'
import { Button, AvatarStack, Photo } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { SUGGESTIONS, FILTERS, CATEGORIES } from '../data/trip.js'
import { useFlow } from '../state/FlowContext.jsx'

// Suggestion types that matter most for a given pace/offbeat combination —
// used to float the most relevant fixes to the top once the "no questions"
// flow's questionnaire has been answered.
function relevantTypes(pace, offbeat) {
  const tags = []
  if (pace === 'Packed') tags.push('Route', 'Timing')
  if (pace === 'Unhurried') tags.push('Stays')
  if (offbeat === 'High') tags.push('Stops')
  return tags
}

export default function Suggestions() {
  const navigate = useNavigate()
  const { applySuggestion, isApplied, variant, params } = useFlow()
  const [filter, setFilter] = useState('All')

  const relevant = variant === 'noQuestions' ? relevantTypes(params.pace, params.offbeat) : []

  const list = useMemo(() => {
    const filtered = SUGGESTIONS.filter((s) => filter === 'All' || s.type === filter)
    if (!relevant.length) return filtered
    return [...filtered].sort((a, b) => (relevant.includes(b.type) ? 1 : 0) - (relevant.includes(a.type) ? 1 : 0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, variant, params.pace, params.offbeat])

  return (
    <Screen>
      <AppBar title="Suggested improvements" onBack={() => navigate('/score')} />

      {relevant.length > 0 && (
        <div className="pad" style={{ paddingTop: 4 }}>
          <div className="banner banner--info">
            <Icon name="sparkle" size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Sorted using the preferences you just picked.</span>
          </div>
        </div>
      )}

      <div className="pad" style={{ paddingBottom: 4 }}>
        <div className="teaser-row" style={{ gap: 8 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`chip${filter === f ? ' is-sel' : ''}`}
              style={{ flex: '0 0 auto', padding: '7px 14px' }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="screen-body pad" style={{ paddingTop: 14, paddingBottom: 20 }}>
        {list.length === 0 ? (
          <div className="banner banner--info" style={{ marginTop: 30, justifyContent: 'center', textAlign: 'center' }}>
            No suggestions of this type. Try a different filter.
          </div>
        ) : (
          list.map((s) => (
            <SuggestionCard
              key={s.id}
              s={s}
              applied={isApplied(s.id)}
              onAdd={() => applySuggestion(s)}
              onDetails={() => navigate(`/suggestions/${s.id}`)}
            />
          ))
        )}
      </div>
    </Screen>
  )
}

function SuggestionCard({ s, applied, onAdd, onDetails }) {
  return (
    <motion.div
      className="sug"
      style={{ marginTop: 14 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.4}
      onDragEnd={(_, info) => { if (info.offset.x > 90 && !applied) onAdd() }}
      whileDrag={{ scale: 0.99 }}
    >
      <div className="sug__band" style={{ background: bandTint(s.type) }}>
        <span className="sug__type">{s.typeLabel}</span>
        <span className="sug__impact">{s.impact}</span>
      </div>

      <div className="sug__body">
        <div className="compare-block compare-block--cur">
          <div className="compare-label">CURRENT</div>
          <div className="t-shd-sm" style={{ marginTop: 3 }}>{s.current.name}</div>
          <div className="t-p-small muted">{s.current.meta}</div>
        </div>

        <div className="compare-arrow"><Icon name="arrowDown" size={20} /></div>

        <div className="compare-block compare-block--sug">
          <Photo src={s.suggested.image} alt={s.suggested.name} tag={s.suggested.category} fallback={photoFor(s.suggested.category)} style={{ height: 88 }} />
          <div style={{ padding: 11 }}>
            <div className="compare-label" style={{ color: 'var(--brand-primary)' }}>SUGGESTED</div>
            <div className="t-shd-sm" style={{ marginTop: 3 }}>{s.suggested.name}</div>
            <div className="t-p-small muted">{s.suggested.meta}</div>
          </div>
        </div>
      </div>

      <div className="social">
        {s.social.count ? <AvatarStack /> : <Icon name="sparkle" size={16} style={{ color: 'var(--brand-primary)' }} />}
        <span>{s.social.text}</span>
      </div>

      <div className="sug__actions">
        <Button variant="ghost" size="sm" full onClick={onDetails}>See details</Button>
        {applied ? (
          <Button variant="soft" size="sm" full onClick={onDetails}>Added ✓</Button>
        ) : (
          <Button size="sm" full onClick={onAdd}>Add to itinerary</Button>
        )}
      </div>
    </motion.div>
  )
}

function bandTint(type) {
  switch (type) {
    case 'Route': return 'var(--secondary-blue-000)'
    case 'Stops': return 'var(--primary-scapia-000)'
    case 'Timing': return 'var(--alert-yellow-000)'
    case 'Stays': return 'var(--success-green-000)'
    default: return 'var(--bg-secondary)'
  }
}
function photoFor(cat) {
  const c = (CATEGORIES[cat] || {}).color || 'var(--bg-tertiary)'
  return `linear-gradient(135deg, ${c}, #d7e0ec)`
}

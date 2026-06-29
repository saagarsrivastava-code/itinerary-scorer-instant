import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Screen, AppBar, Footer } from '../components/Chrome.jsx'
import { Button, ScoreDial, DimensionBar, Photo } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { SCORE, SUGGESTIONS, TRIP, CATEGORIES } from '../data/trip.js'
import { useFlow } from '../state/FlowContext.jsx'

export default function ScoreOverview() {
  const navigate = useNavigate()
  const { baseScore } = useFlow()
  const teasers = SUGGESTIONS.slice(0, 3)

  return (
    <Screen>
      <AppBar
        title="Your itinerary score"
        subtitle={`${TRIP.destination} · ${TRIP.durationDays} days`}
        onBack={() => navigate('/preview')}
        right={<button className="appbar__back" aria-label="Share"><Icon name="share" size={20} /></button>}
      />

      <div className="screen-body pad" style={{ paddingBottom: 96 }}>
        <ScoreDial value={baseScore} />

        <motion.p
          className="t-p-large center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ marginTop: 16, color: 'var(--neutral-grey-700)' }}
        >
          {SCORE.summary}
        </motion.p>

        <h3 className="t-hd-sm" style={{ marginTop: 24 }}>What's working and what isn't</h3>
        <div>
          {SCORE.dimensions.map((d, i) => (
            <DimensionBar key={d.label} {...d} delay={0.4 + i * 0.08} />
          ))}
        </div>

        <h3 className="t-hd-sm" style={{ marginTop: 26 }}>We found {SUGGESTIONS.length} improvements</h3>
        <div className="teaser-row" style={{ marginTop: 12 }}>
          {teasers.map((s) => (
            <button key={s.id} className="teaser" onClick={() => navigate(`/suggestions/${s.id}`)}>
              <Photo className="teaser__img" src={s.suggested.image} alt={s.suggested.name} tag={s.suggested.category} fallback={photoFor(s.suggested.category)} />
              <div className="teaser__body">
                <div className="t-shd-sm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.suggested.name}</div>
                <div className="teaser__impact"><Icon name="sparkle" size={13} />{s.impact}</div>
                <div className="t-p-small" style={{ marginTop: 6, color: 'var(--brand-primary)', textDecoration: 'underline' }}>View</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <Button full variant="ghost" size="md" onClick={() => navigate('/suggestions')}>See all suggestions</Button>
        </div>
      </div>

      <Footer>
        <div className="row" style={{ gap: 10 }}>
          <Button full onClick={() => navigate('/suggestions')}>Improve my itinerary</Button>
          <button className="btn btn--ghost" style={{ width: 50, height: 50, padding: 0, flexShrink: 0 }} aria-label="Share">
            <Icon name="share" size={20} />
          </button>
        </div>
      </Footer>
    </Screen>
  )
}

function photoFor(cat) {
  const c = (CATEGORIES[cat] || {}).color || 'var(--bg-tertiary)'
  return `linear-gradient(135deg, ${c}, #d7e0ec)`
}

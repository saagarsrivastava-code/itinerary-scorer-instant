import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, AppBar, Footer } from '../components/Chrome.jsx'
import { Button, CategoryPill, ScoreBadge } from '../components/ui.jsx'
import Icon from '../components/Icon.jsx'
import { TRIP, SUGGESTIONS } from '../data/trip.js'
import { useFlow } from '../state/FlowContext.jsx'

const inr = (n) => '₹' + n.toLocaleString('en-IN')

// Final bookable itinerary as a cart checkout: every stop — including the
// added recommendations — is a line item with a price, followed by a price
// summary, with the payable total next to the "Book all" CTA.
export default function UpdatedItinerary() {
  const navigate = useNavigate()
  const { newScore, applied } = useFlow()
  const [removed, setRemoved] = useState([])
  const [booked, setBooked] = useState(false)

  const days = useMemo(() => {
    return TRIP.days.map((day) => {
      const dayKey = day.label.split(' — ')[0]
      const added = applied
        .map((a) => SUGGESTIONS.find((s) => s.id === a.id))
        .filter(Boolean)
        .filter((s) => (s.suggested.day?.startsWith('Day') ? s.suggested.day : 'Day 1') === dayKey)
        .map((s) => ({
          id: s.id, time: s.suggested.slot, name: s.suggested.name, category: s.suggested.category,
          amount: s.suggested.priceAmount ?? null, note: s.suggested.priceNote, isNew: true,
        }))
      const stops = day.stops.map((st) => ({
        id: st.id, time: st.time, name: st.name, category: st.category,
        amount: st.price ?? null, note: st.priceNote,
      }))
      return { ...day, items: [...stops, ...added] }
    })
  }, [applied])

  const remove = (id) => setRemoved((r) => [...r, id])
  const live = days.flatMap((d) => d.items).filter((i) => !removed.includes(i.id))
  const count = live.filter((i) => i.amount !== null).length
  const subtotal = live.reduce((n, i) => n + (i.amount || 0), 0)
  const taxes = Math.round(subtotal * 0.05)
  const total = subtotal + taxes
  const coins = Math.round(total / 10)

  return (
    <Screen>
      <AppBar
        title="Your final itinerary"
        subtitle={`${count} bookings · ${TRIP.dateRange}`}
        onBack={() => navigate('/recommendations')}
        right={<ScoreBadge value={newScore} />}
      />

      <div className="screen-body pad" style={{ paddingBottom: 96 }}>
        {booked && (
          <div className="banner banner--ok" style={{ marginTop: 4 }}>
            <Icon name="check" size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>All set! Your {count} bookings are confirmed — details on their way to your email.</span>
          </div>
        )}

        {days.map((day) => {
          const items = day.items.filter((i) => !removed.includes(i.id))
          if (items.length === 0) return null
          return (
            <div key={day.label} style={{ marginTop: 18 }}>
              <div className="day-label">{day.label} · {day.date}</div>
              <div style={{ marginTop: 10 }}>
                {items.map((i) => (
                  <div
                    key={i.id}
                    className="stop"
                    style={{ marginTop: 8, alignItems: 'flex-start', ...(i.isNew ? { borderColor: 'var(--feedback-positive)', background: 'var(--success-green-000)' } : null) }}
                  >
                    <div className="stop__time" style={{ paddingTop: 2 }}>{i.time || '—'}</div>
                    <div className="stop__body">
                      <div className="stop__name">{i.name}</div>
                      <div className="row" style={{ gap: 6, marginTop: 5 }}>
                        {i.category && <CategoryPill category={i.category} />}
                        {i.isNew && <span className="badge badge--new">New</span>}
                      </div>
                    </div>
                    <div className="stop__price">
                      {i.amount === null ? (
                        <span className="stop__note">Plan update</span>
                      ) : i.amount === 0 ? (
                        <span className="stop__amount stop__amount--free">Free</span>
                      ) : (
                        <span className="stop__amount">{inr(i.amount)}</span>
                      )}
                      {i.note && i.amount !== 0 && <span className="stop__note">{i.note}</span>}
                      {!booked && (
                        <button className="stop__remove" onClick={() => remove(i.id)}>Remove</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {count > 0 && (
          <>
            <h3 className="t-hd-sm" style={{ marginTop: 24 }}>Price details</h3>
            <div className="bill" style={{ marginTop: 10 }}>
              <div className="bill__row">
                <span>Subtotal · {count} bookings</span>
                <span className="bill__num">{inr(subtotal)}</span>
              </div>
              <div className="bill__row">
                <span>Taxes &amp; fees</span>
                <span className="bill__num">{inr(taxes)}</span>
              </div>
              <div className="bill__divider" />
              <div className="bill__row bill__row--total">
                <span>Total</span>
                <span className="bill__num">{inr(total)}</span>
              </div>
              <div className="bill__coins">
                <Icon name="sparkle" size={15} style={{ flexShrink: 0 }} />
                <span>Earn <b>{coins.toLocaleString('en-IN')} Scapia coins</b> on this trip — redeemable on flights &amp; stays.</span>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer>
        {booked ? (
          <Button full variant="soft" onClick={() => navigate('/')}>Done</Button>
        ) : (
          <div className="checkoutbar">
            <div className="checkoutbar__total">
              <span className="checkoutbar__amount">{inr(total)}</span>
              <span className="checkoutbar__sub">incl. taxes &amp; fees</span>
            </div>
            <Button icon="check" onClick={() => setBooked(true)} disabled={count === 0}>
              Book all ({count})
            </Button>
          </div>
        )}
      </Footer>
    </Screen>
  )
}

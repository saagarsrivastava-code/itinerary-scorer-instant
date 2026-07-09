import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { SCORE } from '../data/trip.js'

const FlowContext = createContext(null)

export function FlowProvider({ children }) {
  // Questionnaire answers
  const [answers, setAnswers] = useState({
    party: 'Partner',
  })

  // Which suggestion ids have been accepted/applied to the itinerary
  const [applied, setApplied] = useState([]) // [{id, scoreDelta}]

  // Upload source label, used on preview ("phuket-krabi-trip.pdf" / "Pasted text")
  const [source, setSource] = useState('phuket-krabi-trip.pdf')

  // Standalone "Instant AI" prototype (v1 — AI scores in ~5s). The variant is fixed
  // here; the other approaches live in sibling itinerary-scorer-* apps.
  const [variant, setVariant] = useState('instant')

  // Trip parameters gathered by the questionnaire (crowd is no longer asked —
  // it's inferred from the plan — but kept here so the score breakdown can
  // reference it).
  const [params, setParams] = useState({
    pace: 'Balanced',
    crowd: 'Busy',          // inferred, not asked
    food: 'Non-vegetarian',
    offbeat: 'Mix of both',
    transport: 'Private transfer',
    duration: '4–6 days',
    month: 'Dec',
  })
  const setParam = useCallback((key, value) => setParams((p) => ({ ...p, [key]: value })), [])

  const applySuggestion = useCallback((s) => {
    setApplied((prev) => (prev.find((a) => a.id === s.id) ? prev : [...prev, { id: s.id, scoreDelta: s.scoreDelta }]))
  }, [])

  const isApplied = useCallback((id) => applied.some((a) => a.id === id), [applied])

  const baseScore = SCORE.value
  const newScore = useMemo(
    () => Math.min(100, baseScore + applied.reduce((sum, a) => sum + a.scoreDelta, 0)),
    [applied],
  )

  const reset = useCallback(() => {
    setApplied([])
  }, [])

  const value = useMemo(
    () => ({
      answers, setAnswers,
      applied, applySuggestion, isApplied,
      source, setSource,
      variant, setVariant,
      params, setParam,
      baseScore, newScore,
      reset,
    }),
    [answers, applied, applySuggestion, isApplied, source, variant, params, setParam, newScore, reset],
  )

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}

export function useFlow() {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error('useFlow must be used within FlowProvider')
  return ctx
}

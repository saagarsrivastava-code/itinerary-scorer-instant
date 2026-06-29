import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { SCORE } from '../data/trip.js'

const FlowContext = createContext(null)

export function FlowProvider({ children }) {
  // Questionnaire answers
  const [answers, setAnswers] = useState({
    party: 'Partner',
    pace: 3,
    interests: ['Food & dining', 'Hidden gems'],
    budget: 'Mid-range',
    flexibility: 'Mostly set',
  })

  // Which suggestion ids have been accepted/applied to the itinerary
  const [applied, setApplied] = useState([]) // [{id, scoreDelta}]

  // Upload source label, used on preview ("paris-trip.pdf" / "Pasted text")
  const [source, setSource] = useState('paris-trip.pdf')

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
      baseScore, newScore,
      reset,
    }),
    [answers, applied, applySuggestion, isApplied, source, newScore, reset],
  )

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}

export function useFlow() {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error('useFlow must be used within FlowProvider')
  return ctx
}

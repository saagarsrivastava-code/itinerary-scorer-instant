import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import UploadEntry from './screens/UploadEntry.jsx'
import ParsedPreview from './screens/ParsedPreview.jsx'
import Questions from './screens/Questions.jsx'
import Scoring from './screens/Scoring.jsx'
import ScoreOverview from './screens/ScoreOverview.jsx'
import Recommendations from './screens/Recommendations.jsx'
import Suggestions from './screens/Suggestions.jsx'
import SuggestionDetail from './screens/SuggestionDetail.jsx'
import UpdatedItinerary from './screens/UpdatedItinerary.jsx'

export default function App() {
  const location = useLocation()

  return (
    <div className="app">
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<UploadEntry />} />
          <Route path="/preview" element={<ParsedPreview />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/scoring" element={<Scoring />} />
          <Route path="/score" element={<ScoreOverview />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/suggestions/:id" element={<SuggestionDetail />} />
          <Route path="/updated" element={<UpdatedItinerary />} />
          <Route path="*" element={<UploadEntry />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

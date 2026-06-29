# Itinerary Scorer — clickable prototype

A frontend-only React prototype of the Itinerary Scorer flow, built to test the
concept with people. No backend: every screen runs on dummy Paris data, and
"parsing", "scoring", and "booking" are simulated with timers and canned values.

Built on the **Scapia DLS** — colour, typography, and spacing tokens are ported
from the Flutter primitives in `../proto 1- /primitives` into
`src/styles/tokens.css`.

## Run it

```bash
npm install      # already done
npm run dev      # → http://localhost:5173
```

Open in a browser; the phone frame is sized for a 390px mobile screen. For the
most realistic test, open Chrome DevTools device mode (iPhone 14 Pro) or load it
on a phone via the Network URL printed by Vite.

## The flow (all 10 PRD screens)

`Upload → Parse & Confirm → 5 Trip Questions → Scoring → Score → Suggestions →
Detail → Booking → Updated itinerary`

Start at **Upload my itinerary** and tap straight through.

### Built-in states to demo
- **Upload sheet:** empty → file selected → uploading → (a "simulate too-large
  file" link triggers the error state)
- **Parsed preview:** tap any stop for the inline edit accordion; a link toggles
  the empty-parse error state
- **Questions:** grid select, 5-step pace slider, max-3 multi-select chips,
  budget cards, flexibility cards
- **Scoring:** rotating status messages + a "simulate error" link
- **Score:** animated dial (0→score, colour-banded), dimension bars
- **Suggestions:** filter chips, swipe a card right to add, empty-filter state
- **Detail → Booking sheet:** "Update + book" shows the Booked ✓ state
- **Updated itinerary:** score-improvement banner + confetti, Improved/New badges

## Structure

```
src/
  data/trip.js            dummy itinerary, suggestions, score, questions
  state/FlowContext.jsx   applied suggestions + live score delta
  styles/tokens.css       Scapia DLS tokens (ported from Dart primitives)
  styles/components.css   component styles
  components/             Chrome (status bar, app bar), Icon, ui (dial, sheet…)
  screens/                one file per screen
```

## Notes / not in scope
- Fonts: **Lexend Deca** (the DLS body face). The DLS display faces
  (GT Ultra Median / GT Flaire) are trial-licensed and not bundled — **Fraunces**
  stands in for the italic display moment on the hero. Swap in the real faces
  before any external use.
- No real photos — image areas use branded gradient placeholders.
- No auth, payments, or persistence.

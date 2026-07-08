// Dummy data for the prototype — Phuket & Krabi, Thailand, 5 days. Values mirror the wireframes.
// Photos: Unsplash CDN (keyless, ?w=… sized). Swap for licensed assets before release.

// Bundled locally (src/assets) so images work offline and inside the
// CSP-restricted artifact build — no external requests.
import imgWatChalong from '../assets/wat-chalong.jpg'
import imgIslandTour from '../assets/island-tour.jpg'
import imgSuayRestaurant from '../assets/suay-restaurant.jpg'
import imgKataResort from '../assets/kata-resort.jpg'
import imgTigerCave from '../assets/tiger-cave.jpg'
import imgMapSnippet from '../assets/map-snippet.jpg'
import imgExpertAvatar from '../assets/expert-avatar.jpg'

export const IMAGES = {
  watChalong:   imgWatChalong,
  islandTour:   imgIslandTour,
  suayRestaurant: imgSuayRestaurant,
  bigBuddha:    imgWatChalong,
  kataResort:   imgKataResort,
  tigerCave:    imgTigerCave,
  mapSnippet:   imgMapSnippet,
}

export const CATEGORIES = {
  food:      { label: 'Food',      color: 'var(--cat-food)' },
  culture:   { label: 'Culture',   color: 'var(--cat-culture)' },
  nature:    { label: 'Nature',    color: 'var(--cat-nature)' },
  stay:      { label: 'Stay',      color: 'var(--cat-stay)' },
  transport: { label: 'Transport', color: 'var(--cat-transport)' },
}

// Parsed itinerary (Screen 3). `id` lets suggestions target a stop.
export const TRIP = {
  destination: 'Phuket & Krabi',
  durationDays: 5,
  dateRange: 'Mon 14 – Fri 18 Dec',
  days: [
    {
      label: 'Day 1 — Phuket',
      date: 'Mon 14 Dec',
      stops: [
        { id: 's1', time: '09:30', name: 'Big Buddha Phuket', category: 'culture', price: 0, priceNote: 'Free entry', transitAfter: { mode: 'Car', mins: 12 } },
        { id: 's2', time: '13:00', name: 'Blue Elephant Restaurant', category: 'food', price: 4800, priceNote: 'Lunch for 2', transitAfter: { mode: 'Car', mins: 18 } },
        { id: 's3', time: null, name: 'JW Marriott Phuket Resort', category: 'stay', price: 36800, priceNote: '4 nights' },
      ],
    },
    {
      label: 'Day 2 — Phuket',
      date: 'Tue 15 Dec',
      stops: [
        { id: 's4', time: '09:00', name: 'Phi Phi Islands Day Tour', category: 'nature', price: 7200, priceNote: '2 guests', transitAfter: { mode: 'Car', mins: 9 } },
        { id: 's5', time: '13:30', name: 'Phuket Aquarium', category: 'culture', price: 1400, priceNote: '2 tickets', transitAfter: { mode: 'Car', mins: 22 } },
        { id: 's6', time: '19:30', name: 'Bangla Road Night Market', category: 'food', price: 0, priceNote: 'Free to explore' },
      ],
    },
    {
      label: 'Day 3 — Krabi',
      date: 'Wed 16 Dec',
      stops: [
        { id: 's7', time: '10:00', name: 'Railay Beach Viewpoint', category: 'nature', price: 0, priceNote: 'Free entry', transitAfter: { mode: 'Car', mins: 6 } },
        { id: 's8', time: '15:00', name: 'Wat Tham Suea (Tiger Cave Temple)', category: 'culture', price: 0, priceNote: 'Free entry' },
      ],
    },
  ],
}

export const SCORE = {
  value: 72,
  summary:
    'Well-paced, but the route has significant backtracking. A few swaps could make a big difference.',
  dimensions: [
    { label: 'Route efficiency',     pct: 45, band: 'Needs work' },
    { label: 'Logistics feasibility', pct: 72, band: 'Good' },
    { label: 'Personalisation fit',  pct: 68, band: 'Good' },
    { label: 'Experience variety',   pct: 88, band: 'Excellent' },
    { label: 'Completeness',         pct: 75, band: 'Good' },
  ],
}

// Suggestions (Screens 6/7/8). `type` drives the filter chips & banner colour.
export const SUGGESTIONS = [
  {
    id: 'g1',
    type: 'Stops',
    typeLabel: 'Swap this stop',
    impact: '4.8★ vs 3.9★',
    scoreDelta: 8,
    targetStopId: 's5',
    current: { name: 'Phuket Aquarium', meta: '3.9★ · 1h visit' },
    suggested: {
      name: 'Wat Chalong',
      image: IMAGES.watChalong,
      meta: '4.8★ · saves 45 mins backtracking',
      category: 'culture',
      rating: 4.8,
      area: 'Chalong, Phuket',
      about:
        "Phuket's most revered temple, with intricate murals and towering chedis. Lighter crowds before noon and right on your Day-2 route.",
      attrs: ['Avg visit: 1.5 hrs', 'Best: Morning', 'Booking: No'],
      price: 'Free entry (donations welcome)',
      priceAmount: 0, priceNote: 'Free entry',
      available: true,
      day: 'Day 2', slot: '1:30 PM',
    },
    social: { count: 247, text: '247 Scapia travellers booked this' },
    quotes: [
      { name: 'Aanya', trip: 'solo trip', text: '“Quieter than the beaches and the murals are unreal.”' },
      { name: 'Rohan', trip: 'with partner', text: '“We spent two hours and wished we had more.”' },
    ],
  },
  {
    id: 'g2',
    type: 'Route',
    typeLabel: 'Better route',
    impact: 'Saves 40 mins',
    scoreDelta: 6,
    targetStopId: 's4',
    current: { name: 'Day 2 zig-zag order', meta: 'Doubles back along the coast road' },
    suggested: {
      name: 'Cluster the island stops first',
      image: IMAGES.islandTour,
      meta: 'One loop · saves 40 mins',
      category: 'transport',
      rating: null,
      area: 'Day 2 reorder',
      about:
        'Reordering Day 2 to do the island tour and market together cuts backtracking and an extra transfer.',
      attrs: ['Saves: 40 mins', 'No new bookings', 'Same stops'],
      price: null,
      available: true,
      day: 'Day 2', slot: 're-ordered',
    },
    social: { text: 'Trending in Phuket this week' },
    quotes: [
      { name: 'Meera', trip: 'family', text: '“Way less time in the car with kids.”' },
    ],
  },
  {
    id: 'g3',
    type: 'Stops',
    typeLabel: 'Add this stop',
    impact: 'Fills your free evening',
    scoreDelta: 5,
    targetStopId: null,
    current: { name: 'Gap on Day 1 evening', meta: 'Nothing after 13:00' },
    suggested: {
      name: 'Suay Restaurant',
      image: IMAGES.suayRestaurant,
      meta: '4.6★ · beachfront dinner',
      category: 'food',
      rating: 4.6,
      area: 'Rawai, Phuket',
      about:
        'A celebrated beachfront restaurant a short drive from your hotel — fills the empty Day-1 evening.',
      attrs: ['Avg visit: 1.5 hrs', 'Best: Evening', 'Booking: Yes'],
      price: 'From ₹1,800 per person',
      priceAmount: 3600, priceNote: 'Dinner for 2',
      available: true,
      day: 'Day 1', slot: '8:00 PM',
    },
    social: { count: 1200, text: 'Saved by 1.2K people like you' },
    quotes: [
      { name: 'Karan', trip: 'friends', text: '“Book ahead — worth every minute of the wait otherwise.”' },
    ],
  },
  {
    id: 'g4',
    type: 'Timing',
    typeLabel: 'Better timing',
    impact: 'Skip the queue',
    scoreDelta: 3,
    targetStopId: 's1',
    current: { name: 'Big Buddha at 09:30', meta: 'Peak tour-bus queue' },
    suggested: {
      name: 'Big Buddha at 08:30 (early entry)',
      image: IMAGES.bigBuddha,
      meta: 'Save ~35 mins queuing',
      category: 'culture',
      rating: 4.7,
      area: 'Chalong, Phuket',
      about:
        'Shifting one hour earlier beats the tour-bus rush. Same stop, far less waiting.',
      attrs: ['Saves: 35 mins', 'Best: Early AM', 'Booking: Recommended'],
      price: null,
      available: true,
      day: 'Day 1', slot: '8:30 AM',
    },
    social: { count: 530, text: '530 travellers shifted this earlier' },
    quotes: [
      { name: 'Isha', trip: 'solo trip', text: '“Walked straight in. Felt like I had the place to myself.”' },
    ],
  },
  {
    id: 'g5',
    type: 'Stays',
    typeLabel: 'Better stay',
    impact: 'Cuts daily transit',
    scoreDelta: 4,
    targetStopId: 's3',
    current: { name: 'JW Marriott Phuket Resort', meta: '4.7★ · 25 min from stops' },
    suggested: {
      name: 'Kata Beach Resort & Spa',
      image: IMAGES.kataResort,
      meta: '4.6★ · 8 min from your stops',
      category: 'stay',
      rating: 4.6,
      area: 'Kata Beach, Phuket',
      about:
        'A central base that cuts daily transit — closer to three of your five planned stops.',
      attrs: ['Central', 'Free cancellation', 'Booking: Yes'],
      price: 'From ₹9,200 per night',
      priceAmount: 36800, priceNote: '4 nights',
      available: true,
      day: 'All nights', slot: 'check-in 15:00',
    },
    social: { count: 380, text: 'Saved by 380 people like you' },
    quotes: [
      { name: 'Devika', trip: 'with partner', text: '“Rolled out of bed and onto the route every morning.”' },
    ],
  },
  {
    id: 'g6',
    type: 'Route',
    typeLabel: 'Better route',
    impact: 'Saves 20 mins',
    scoreDelta: 2,
    targetStopId: 's7',
    current: { name: 'Railay Viewpoint then Tiger Cave Temple', meta: 'Two separate climbs' },
    suggested: {
      name: 'Tiger Cave Temple first, coastal walk down',
      image: IMAGES.tigerCave,
      meta: 'One climb · saves 20 mins',
      category: 'transport',
      rating: null,
      area: 'Day 3 reorder',
      about: "Start with the temple stairs while you're fresh, then ease into the coastal walk instead of climbing twice.",
      attrs: ['Saves: 20 mins', 'No new bookings', 'Easier on foot'],
      price: null,
      available: true,
      day: 'Day 3', slot: 're-ordered',
    },
    social: { text: 'Trending in Krabi this week' },
    quotes: [
      { name: 'Sana', trip: 'friends', text: '“So much better than climbing twice in that heat.”' },
    ],
  },
]

export const FILTERS = ['All', 'Route', 'Stops', 'Timing', 'Stays']

// Human expert shown in the "Expert review" variant (v2).
export const EXPERT = {
  name: 'Aanya Rao',
  title: 'Senior travel expert · Thailand specialist',
  avatar: imgExpertAvatar,
  reviewed: '1,400+ itineraries reviewed',
  eta: 'Usually ready in ~2 hours',
}

// Status stages for the expert-review waiting screen.
export const EXPERT_STAGES = [
  { key: 'submitted', label: 'Itinerary submitted', sub: 'Your Thailand plan is in the queue' },
  { key: 'assigned',  label: 'Expert assigned',     sub: 'Aanya is a Thailand specialist' },
  { key: 'reviewing', label: 'Reviewing your route & stops', sub: 'Checking pacing, backtracking and fit' },
  { key: 'ready',     label: 'Score ready',          sub: 'Putting together your suggestions' },
]

export const QUESTIONS_TOTAL = 3

// Loading status messages (Screen 5)
export const LOADING_MESSAGES = [
  'Checking your route efficiency…',
  'Looking at reviews from Scapia travellers for the spots on your itinerary…',
  'Comparing with similar travellers…',
  'Almost there…',
]

// ── "No questions" flow — inferred trip parameters ──────────────
// Instead of an upfront questionnaire, the itinerary screen shows what the AI
// picked up from the upload as a set of read-only inferred params. They can
// only be changed by going through the (3-screen) questionnaire.
export const PARAM_OPTIONS = {
  pace: ['Unhurried', 'Balanced', 'Packed'],
  crowd: ['Chill', 'Busy', 'Very busy'],
  food: ['Vegetarian', 'Non-vegetarian', 'All cuisines'],
  photogenic: ['Low', 'Medium', 'High'],
  offbeat: ['Low', 'Medium', 'High'],
  season: ['Cool & dry (Nov–Feb)', 'Hot (Mar–May)', 'Rainy (Jun–Oct)'],
}

// Each inferred param is displayed as {label, tone, pct} — tone drives the
// colour (good = green, neutral = gold, bad = red), pct drives the bar fill.
const PACE_DISPLAY = {
  Unhurried: { value: 'Relaxed', tone: 'good', pct: 25 },
  Balanced: { value: 'Balanced', tone: 'neutral', pct: 55 },
  Packed: { value: 'Packed', tone: 'bad', pct: 90 },
}
const CROWD_DISPLAY = {
  Chill: { value: 'Low', tone: 'good', pct: 18 },
  Busy: { value: 'Medium', tone: 'neutral', pct: 55 },
  'Very busy': { value: 'High', tone: 'bad', pct: 90 },
}
// Route efficiency isn't asked directly — it follows from how packed the trip is.
const ROUTE_EFFICIENCY_BY_PACE = {
  Unhurried: { value: 'Good', tone: 'good', pct: 88 },
  Balanced: { value: 'Needs work', tone: 'neutral', pct: 52 },
  Packed: { value: 'Poor', tone: 'bad', pct: 22 },
}
// Food diversity reflects how well Phuket & Krabi serve the traveller's stated preference.
const FOOD_DIVERSITY_BY_PREF = {
  Vegetarian: { value: 'High', tone: 'good', pct: 85 },
  'Non-vegetarian': { value: 'High', tone: 'good', pct: 90 },
  'All cuisines': { value: 'Medium', tone: 'neutral', pct: 55 },
}
const LEVEL_GOOD_HIGH = {
  Low: { tone: 'bad', pct: 18 },
  Medium: { tone: 'neutral', pct: 55 },
  High: { tone: 'good', pct: 90 },
}
// Weather, budget and "ideal for" are shown as descriptive detail rows
// (value + short sub-line) rather than a good/bad bar — they're facts, not
// something to grade.
const WEATHER_BY_SEASON = {
  'Cool & dry (Nov–Feb)': { value: '17°C – 23°C, sunny', sub: 'Perfect for beaches' },
  'Hot (Mar–May)': { value: '30°C – 35°C, hot & humid', sub: 'Stay hydrated, plan indoor breaks' },
  'Rainy (Jun–Oct)': { value: '24°C – 28°C, frequent showers', sub: 'Pack a light raincoat' },
}
const BUDGET_DETAIL = { value: '₹1L – ₹2L', sub: 'Lavish holiday · total for the trip' }
const IDEAL_FOR_BY_PARTY = {
  Solo: { value: 'Solo traveller', sub: 'Flexible, spontaneous spots' },
  Partner: { value: 'Couples', sub: 'Romantic getaways' },
  Friends: { value: 'Friends group', sub: 'Fun, social spots' },
  'Family (kids)': { value: 'Family with kids', sub: 'Relaxed spots' },
  'Family (teens)': { value: 'Family with teens', sub: 'Adventure-friendly spots' },
  Parents: { value: 'Multi-gen family', sub: 'Comfortable pacing' },
  'Group (6+)': { value: 'Large groups', sub: 'Group-friendly activities' },
}

const TONE_COLOR = {
  good: 'var(--feedback-positive)',
  neutral: '#B18C13',
  bad: 'var(--feedback-negative)',
}
export function toneColor(tone) {
  return TONE_COLOR[tone] || TONE_COLOR.neutral
}

// Builds the 6 inferred-param tiles (bar-style) plus 3 descriptive detail
// rows (weather, budget, ideal-for) shown on the itinerary screen, plus a
// short qualitative headline (no numeric score — this flow only infers).
export function getInferredParams({ pace, crowd, food, photogenic, offbeat, season }, party) {
  const paceD = PACE_DISPLAY[pace] || PACE_DISPLAY.Balanced
  const crowdD = CROWD_DISPLAY[crowd] || CROWD_DISPLAY.Busy
  const routeD = ROUTE_EFFICIENCY_BY_PACE[pace] || ROUTE_EFFICIENCY_BY_PACE.Balanced
  const foodD = FOOD_DIVERSITY_BY_PREF[food] || FOOD_DIVERSITY_BY_PREF['Non-vegetarian']
  const photoD = LEVEL_GOOD_HIGH[photogenic] || LEVEL_GOOD_HIGH.Medium
  const offbeatD = LEVEL_GOOD_HIGH[offbeat] || LEVEL_GOOD_HIGH.Medium
  const weatherD = WEATHER_BY_SEASON[season] || WEATHER_BY_SEASON['Cool & dry (Nov–Feb)']
  const idealForD = IDEAL_FOR_BY_PARTY[party] || IDEAL_FOR_BY_PARTY.Partner

  const title =
    pace === 'Unhurried' ? `Relaxed ${TRIP.destination} Getaway` :
    pace === 'Packed'    ? `Fast-Paced ${TRIP.destination} Adventure` :
                            `Classic ${TRIP.destination} Holiday`

  return {
    title,
    params: [
      { key: 'pace', icon: 'clock', label: 'Pace of trip', value: paceD.value, tone: paceD.tone, pct: paceD.pct },
      { key: 'crowd', icon: 'user', label: 'Crowd levels', value: crowdD.value, tone: crowdD.tone, pct: crowdD.pct },
      { key: 'route', icon: 'route', label: 'Route efficiency', value: routeD.value, tone: routeD.tone, pct: routeD.pct },
      { key: 'food', icon: 'star', label: 'Food diversity', value: foodD.value, tone: foodD.tone, pct: foodD.pct },
      { key: 'photogenic', icon: 'image', label: 'Photogenic spots', value: photogenic, tone: photoD.tone, pct: photoD.pct },
      { key: 'offbeat', icon: 'compass', label: 'Offbeat spots', value: offbeat, tone: offbeatD.tone, pct: offbeatD.pct },
    ],
    details: [
      { key: 'weather', icon: 'sun', label: 'Weather', value: weatherD.value, sub: weatherD.sub },
      { key: 'budget', icon: 'wallet', label: 'Total budget', value: BUDGET_DETAIL.value, sub: BUDGET_DETAIL.sub },
      { key: 'idealFor', icon: 'heart', label: 'Ideal for', value: idealForD.value, sub: idealForD.sub },
    ],
    flight: FLIGHT_INSIGHT,
    hotel: HOTEL_INSIGHT,
  }
}

export const FLIGHT_INSIGHT = {
  score: 6.8,
  hits: ['Direct routing into Phuket International (HKT) keeps total travel time reasonable.'],
  misses: ['The return leg has a ~3-hour layover.'],
  alternative: { name: 'AirAsia · 10:15 AM direct', meta: 'Same fare · seat selection included' },
}

export const HOTEL_INSIGHT = {
  score: 6.5,
  hits: ['JW Marriott Phuket Resort is a premium beachfront property with excellent amenities.'],
  misses: ["It's a 25-minute trip from most of your planned stops."],
  alternative: { name: 'Kata Beach Resort & Spa', meta: 'Same price range · 8 min from your stops' },
}

export function paramScoreColor(value) {
  if (value >= 8) return 'var(--success-green-700)'
  if (value >= 6.5) return 'var(--feedback-positive)'
  if (value >= 5) return 'var(--feedback-warning)'
  return 'var(--feedback-negative)'
}

// Instant-AI score screen — "What's working and what isn't" rows, scored /10
// with a note that ties each verdict back to the traveller's stated
// preference. Each row also carries `issues`: stop-anchored callouts shown in
// the bottom sheet against the date-wise itinerary (wireframe: "SINCE YOU
// PREFER RELAXED PACE — back-to-back stops … is hectic").
export function getScoreBreakdown({ pace, crowd, food, photogenic, offbeat }) {
  const paceRow =
    pace === 'Unhurried' ? { score: 4, note: 'Based on your preference, this pace is too fast.' } :
    pace === 'Packed'    ? { score: 8, note: 'You asked for a packed trip — this plan keeps every day full.' } :
                           { score: 6, note: 'Broadly the balanced pace you asked for, but Day 2 runs long.' }
  const crowdRow =
    crowd === 'Chill'     ? { score: 8, note: 'Since you wanted to avoid crowds, this plan is well suited to you.' } :
    crowd === 'Very busy' ? { score: 7, note: 'Most stops are lively and popular — matches what you asked for.' } :
                            { score: 7, note: 'A workable mix of busy landmarks and quieter stops.' }
  const routeRow = { score: 5, note: 'Day 2 doubles back along the coast road — a reorder saves ~40 mins.' }
  const foodRow =
    food === 'Vegetarian'   ? { score: 7, note: 'Good vegetarian coverage, though the night market is seafood-heavy.' } :
    food === 'All cuisines' ? { score: 6, note: 'Almost entirely Thai — little variety beyond local cuisine.' } :
                              { score: 8, note: 'A strong mix of Thai seafood, fine dining and street food.' }
  const photoRow =
    photogenic === 'Low' ? { score: 8, note: 'More scenic than you asked for — no complaints.' } :
                           { score: 8, note: 'Phi Phi and Railay are among the most photogenic stops in Thailand.' }
  const offbeatRow =
    offbeat === 'High' ? { score: 3, note: 'You asked for hidden gems, but most stops are mainstream favourites.' } :
    offbeat === 'Low'  ? { score: 8, note: 'Sticks to the well-known spots — exactly what you asked for.' } :
                         { score: 5, note: 'Mostly popular spots — one or two quieter corners would balance it.' }

  const paceTag = `Since you prefer a ${(pace || 'Balanced').toLowerCase()} pace`
  const crowdTag = crowd === 'Chill' ? 'Since you want to avoid crowds' : 'Crowd check'

  // Each issue lists the exact stops it concerns (`stopIds`) so the sheet
  // can show just that slice of the plan instead of the whole itinerary.
  return [
    { key: 'pace', label: 'Pace of the trip', ...paceRow, issues: [
      { stopIds: ['s1', 's2'], tag: paceTag, text: 'Back-to-back Big Buddha at 09:30 and Blue Elephant at 13:00 is hectic — travel between them takes ~45 mins.' },
      { stopIds: ['s4', 's5', 's6'], tag: paceTag, text: 'The island tour, aquarium and night market stretch Day 2 into a 12-hour day.' },
    ]},
    { key: 'crowd', label: 'Crowd level', ...crowdRow, issues: [
      { stopIds: ['s1'], tag: crowdTag, text: "Big Buddha's tour-bus rush peaks 09:00–11:00 — an 08:30 start skips most of it." },
      { stopIds: ['s6'], tag: crowdTag, text: 'Bangla Road is at its busiest after 19:00 — go early or embrace the buzz.' },
    ]},
    { key: 'route', label: 'Route efficiency', ...routeRow, issues: [
      { stopIds: ['s4', 's5'], tag: 'Route check', text: 'Day 2 heads west for the island tour, then doubles back east past your hotel for the aquarium — ~40 mins of backtracking.' },
    ]},
    { key: 'food', label: 'Food diversity', ...foodRow, issues: [
      { stopIds: ['s2'], tag: 'Food check', text: 'Blue Elephant is royal Thai fine dining — a standout meal.', good: true },
      { stopIds: ['s6'], tag: food === 'Vegetarian' ? 'Since you eat vegetarian' : 'Food check',
        text: food === 'Vegetarian' ? 'Bangla Road stalls are seafood-heavy — vegetarian options thin out late.' : 'Some of the best street food on the island.',
        good: food !== 'Vegetarian' },
    ]},
    { key: 'photogenic', label: 'Photogenic spots', ...photoRow, issues: [
      { stopIds: ['s4'], tag: 'Photo spot', text: 'Phi Phi viewpoints are postcard Thailand.', good: true },
      { stopIds: ['s7'], tag: 'Photo spot', text: "Railay's karst cliffs are the best photo stop of the trip.", good: true },
    ]},
    { key: 'offbeat', label: 'Offbeat spots', ...offbeatRow, issues: [
      { stopIds: ['s1'], tag: 'Offbeat check', text: 'One of the busiest attractions on the island — firmly on the tourist trail.', good: offbeat === 'Low' },
      { stopIds: ['s8'], tag: 'Offbeat check', text: 'The 1,237-step climb keeps crowds away — the most offbeat stop on your plan.', good: true },
    ]},
  ]
}

// Preference-aware tip shown on the recommendations screen.
export const PACE_TIPS = {
  Unhurried: "Since you prefer a relaxed pace, we've suggested earlier starts and kept your evenings free — no day should feel rushed.",
  Balanced: "To keep your days balanced, these swaps cut backtracking without dropping any stops.",
  Packed: "You like packed days — these swaps squeeze more in without adding travel time.",
}

export function scoreBand(value) {
  if (value < 50) return { name: 'low', color: 'var(--feedback-negative)', tint: 'var(--warning-red-000)' }
  if (value < 75) return { name: 'mid', color: 'var(--feedback-warning)', tint: 'var(--alert-yellow-000)' }
  if (value < 90) return { name: 'good', color: 'var(--feedback-positive)', tint: 'var(--success-green-000)' }
  return { name: 'great', color: 'var(--success-green-700)', tint: 'var(--success-green-000)' }
}

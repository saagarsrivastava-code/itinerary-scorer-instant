// Dummy data for the prototype — Paris, 5 days. Values mirror the wireframes.
// Photos: Unsplash CDN (keyless, ?w=… sized). Swap for licensed assets before release.

const IMG = (id, w = 800) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`

export const IMAGES = {
  museeOrsay:  IMG('1565099824688-e93eb20fe622'),
  leftBank:    IMG('1522093007474-d86e9bf7ba6f'),
  bistro:      IMG('1414235077428-338989a2e8c0'),
  louvre:      IMG('1431274172761-fca41d930114'),
  hotel:       IMG('1551882547-ff40c63fe5fa'),
  sacreCoeur:  IMG('1550340499-a6c60fc8287c'),
  mapSnippet:  IMG('1473951574080-01fe45ec8643'),
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
  destination: 'Paris',
  durationDays: 5,
  dateRange: 'Mon 14 – Fri 18 Apr',
  days: [
    {
      label: 'Day 1 — Paris',
      date: 'Mon 14 Apr',
      stops: [
        { id: 's1', time: '09:30', name: 'Louvre Museum', category: 'culture', transitAfter: { mode: 'Walk', mins: 12 } },
        { id: 's2', time: '13:00', name: 'Café de Flore', category: 'food', transitAfter: { mode: 'Metro', mins: 18 } },
        { id: 's3', time: null, name: 'Hôtel Le Marais', category: 'stay' },
      ],
    },
    {
      label: 'Day 2 — Paris',
      date: 'Tue 15 Apr',
      stops: [
        { id: 's4', time: '09:00', name: 'Eiffel Tower', category: 'culture', transitAfter: { mode: 'Walk', mins: 9 } },
        { id: 's5', time: '13:30', name: 'Musée Grévin', category: 'culture', transitAfter: { mode: 'Metro', mins: 22 } },
        { id: 's6', time: '19:30', name: 'Le Comptoir', category: 'food' },
      ],
    },
    {
      label: 'Day 3 — Paris',
      date: 'Wed 16 Apr',
      stops: [
        { id: 's7', time: '10:00', name: 'Montmartre Walk', category: 'nature', transitAfter: { mode: 'Walk', mins: 6 } },
        { id: 's8', time: '15:00', name: 'Sacré-Cœur', category: 'culture' },
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
    current: { name: 'Musée Grévin', meta: '3.9★ · 1h30 visit' },
    suggested: {
      name: "Musée d'Orsay",
      image: IMAGES.museeOrsay,
      meta: '4.8★ · saves 45 mins backtracking',
      category: 'culture',
      rating: 4.7,
      area: 'Rive Gauche, 7th',
      about:
        'Impressionist masterworks in a former railway station. Lighter crowds before noon and right on your Day-2 route.',
      attrs: ['Avg visit: 2 hrs', 'Best: Morning', 'Booking: No'],
      price: 'From ₹650 per person',
      available: true,
      day: 'Day 2', slot: '3:00 PM',
    },
    social: { count: 247, text: '247 Scapia travellers booked this' },
    quotes: [
      { name: 'Aanya', trip: 'solo trip', text: '“Quieter than the Louvre and the café upstairs is unreal.”' },
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
    current: { name: 'Day 2 zig-zag order', meta: '2 crossings of the Seine' },
    suggested: {
      name: 'Cluster the Left Bank first',
      image: IMAGES.leftBank,
      meta: 'One loop · saves 40 mins',
      category: 'transport',
      rating: null,
      area: 'Day 2 reorder',
      about:
        'Reordering Day 2 to do the Left Bank stops together cuts two river crossings and a metro change.',
      attrs: ['Saves: 40 mins', 'No new bookings', 'Same stops'],
      price: null,
      available: true,
      day: 'Day 2', slot: 're-ordered',
    },
    social: { text: 'Trending in Paris this week' },
    quotes: [
      { name: 'Meera', trip: 'family', text: '“Way less time on the metro with kids.”' },
    ],
  },
  {
    id: 'g3',
    type: 'Stops',
    typeLabel: 'Add this stop',
    impact: '+5 score points',
    scoreDelta: 5,
    targetStopId: null,
    current: { name: 'Gap on Day 1 evening', meta: 'Nothing after 13:00' },
    suggested: {
      name: 'Le Comptoir du Relais',
      image: IMAGES.bistro,
      meta: '4.6★ · classic bistro',
      category: 'food',
      rating: 4.6,
      area: 'Saint-Germain, 6th',
      about:
        'A beloved neighbourhood bistro a short walk from your hotel — fills the empty Day-1 evening.',
      attrs: ['Avg visit: 1.5 hrs', 'Best: Evening', 'Booking: Yes'],
      price: 'From ₹1,200 per person',
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
    current: { name: 'Louvre at 09:30', meta: 'Peak entry queue' },
    suggested: {
      name: 'Louvre at 08:30 (early entry)',
      image: IMAGES.louvre,
      meta: 'Save ~35 mins queuing',
      category: 'culture',
      rating: 4.7,
      area: '1st arr.',
      about:
        'Shifting one hour earlier beats the tour-group rush. Same stop, far less waiting.',
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
    impact: '+4 score points',
    scoreDelta: 4,
    targetStopId: 's3',
    current: { name: 'Hôtel Le Marais', meta: '3.8★ · 25 min from stops' },
    suggested: {
      name: 'Hôtel Saint-Germain',
      image: IMAGES.hotel,
      meta: '4.6★ · 8 min from your stops',
      category: 'stay',
      rating: 4.6,
      area: '6th arr.',
      about:
        'A central base that cuts daily transit — closer to three of your five planned stops.',
      attrs: ['Central', 'Free cancellation', 'Booking: Yes'],
      price: 'From ₹8,400 per night',
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
    current: { name: 'Montmartre then Sacré-Cœur', meta: 'Uphill twice' },
    suggested: {
      name: 'Sacré-Cœur first, downhill walk',
      image: IMAGES.sacreCoeur,
      meta: 'One climb · saves 20 mins',
      category: 'transport',
      rating: null,
      area: 'Day 3 reorder',
      about: 'Start at the top and wander down through Montmartre instead of climbing twice.',
      attrs: ['Saves: 20 mins', 'No new bookings', 'Easier on foot'],
      price: null,
      available: true,
      day: 'Day 3', slot: 're-ordered',
    },
    social: { text: 'Trending in Paris this week' },
    quotes: [
      { name: 'Sana', trip: 'friends', text: '“So much better than dragging ourselves up twice.”' },
    ],
  },
]

export const FILTERS = ['All', 'Route', 'Stops', 'Timing', 'Stays']

export const QUESTIONS_TOTAL = 5

// Loading status messages (Screen 5)
export const LOADING_MESSAGES = [
  'Checking your route efficiency…',
  'Comparing with similar travellers…',
  'Finding better options nearby…',
  'Almost there…',
]

export function scoreBand(value) {
  if (value < 50) return { name: 'low', color: 'var(--feedback-negative)', tint: 'var(--warning-red-000)' }
  if (value < 75) return { name: 'mid', color: 'var(--feedback-warning)', tint: 'var(--alert-yellow-000)' }
  if (value < 90) return { name: 'good', color: 'var(--feedback-positive)', tint: 'var(--success-green-000)' }
  return { name: 'great', color: 'var(--success-green-700)', tint: 'var(--success-green-000)' }
}

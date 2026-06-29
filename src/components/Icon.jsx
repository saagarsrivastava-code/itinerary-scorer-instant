// Lightweight stroke icon set. Inherits color via currentColor.
const PATHS = {
  back: <path d="M15 5l-7 7 7 7" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  share: <><circle cx="6" cy="12" r="2.4" /><circle cx="17" cy="6" r="2.4" /><circle cx="17" cy="18" r="2.4" /><path d="M8.1 11l6.8-3.6M8.1 13l6.8 3.6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 13l4 4L19 7" />,
  upload: <><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5" /><path d="M5 20h14" /></>,
  walk: <><circle cx="13" cy="4.5" r="1.6" /><path d="M11 21l1.5-5 2-2-1-4-3 2-1 3M14 14l3 3 1 4M11 9l-3 1" /></>,
  metro: <><rect x="6" y="4" width="12" height="13" rx="3" /><path d="M6 12h12M9 21l-1.5-2M15 21l1.5-2" /><circle cx="9" cy="14.5" r="0.6" fill="currentColor" stroke="none" /><circle cx="15" cy="14.5" r="0.6" fill="currentColor" stroke="none" /></>,
  car: <><path d="M4 13l1.5-4.5A2 2 0 017.4 7h9.2a2 2 0 011.9 1.5L20 13v5h-3v-2H7v2H4z" /><circle cx="7.5" cy="15.5" r="0.7" fill="currentColor" stroke="none" /><circle cx="16.5" cy="15.5" r="0.7" fill="currentColor" stroke="none" /></>,
  pencil: <path d="M4 20h4L18.5 9.5a2 2 0 000-3l-1-1a2 2 0 00-3 0L4 16v4z" />,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />,
  warning: <><path d="M12 4l9 16H3z" /><path d="M12 10v4M12 17v.5" /></>,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  pin: <><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.4" /></>,
  route: <><circle cx="6" cy="6" r="2.2" /><circle cx="18" cy="18" r="2.2" /><path d="M6 8.2v4.3a3.5 3.5 0 003.5 3.5H14M18 15.8V12" /></>,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4.5l3 2" /></>,
  home: <><path d="M4 11l8-7 8 7" /><path d="M6 10v9h12v-9" /></>,
  list: <><path d="M8 6h12M8 12h12M8 18h12" /><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" /></>,
  compass: <><circle cx="12" cy="12" r="8.5" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  user: <><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0113 0" /></>,
  doc: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M9 13h6M9 16h6" /></>,
  image: <><rect x="4" y="5" width="16" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M5 17l4.5-4 3 2.5L16 11l3 3.5" /></>,
}

export default function Icon({ name, size = 22, stroke = 1.8, className, style }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {PATHS[name] || null}
    </svg>
  )
}

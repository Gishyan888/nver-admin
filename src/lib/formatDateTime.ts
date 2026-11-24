const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

function formatParts(
  day: number,
  monthIndex: number,
  year: number,
  hours: number,
  minutes: number,
): string {
  const month = MONTHS[monthIndex]
  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  return `${day} ${month} ${year}, ${hh}:${mm}`
}

/**
 * Date and time as on the admin frames, e.g. "24 November 2026, 14:20".
 * UTC — used where the card has not decided the time zone (e.g. T-03-08 comments).
 */
export function formatAdminDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return formatParts(
    date.getUTCDate(),
    date.getUTCMonth(),
    date.getUTCFullYear(),
    date.getUTCHours(),
    date.getUTCMinutes(),
  )
}

/**
 * Timeline dates (T-05-09 / T-05-04): same shape, in the browser's time zone.
 */
export function formatBrowserDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return formatParts(
    date.getDate(),
    date.getMonth(),
    date.getFullYear(),
    date.getHours(),
    date.getMinutes(),
  )
}

/**
 * Review "Sent" day as on the frames, e.g. "24 November 2026".
 * Time zone is not decided on T-06-05 — browser local calendar day is used.
 */
export function formatReviewSentDay(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  const day = date.getDate()
  const month = MONTHS[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

/** Chat message time in the browser time zone, e.g. "14:20". */
export function formatChatTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

/** Chat date separator, e.g. "24 November 2026" (browser local day). */
export function formatChatDay(iso: string): string {
  return formatReviewSentDay(iso)
}

export function chatDayKey(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

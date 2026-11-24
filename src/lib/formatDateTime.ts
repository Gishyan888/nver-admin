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

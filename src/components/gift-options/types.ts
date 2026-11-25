/** Comment as shown under a gift option (T-03-06 / T-03-08). */
export type GiftOptionComment = {
  id: string
  text: string
  /** ISO 8601 UTC; shown as "24 November 2026, 14:20" (time zone not decided). */
  createdAt: string
}

/** One "Ask for alternatives" entry (T-03-06 / T-03-08). */
export type AlternativeRequest = {
  id: string
  /** Null or empty → "No note". */
  note: string | null
  createdAt: string
}

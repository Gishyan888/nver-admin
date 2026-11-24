/** UI model until T-03-06 Result fixes the API fields. */
export type GiftOptionComment = {
  id: string
  text: string
  /** ISO 8601; shown as "24 November 2026, 14:20". */
  createdAt: string
}

/** UI model until T-03-06 Result fixes the API fields. */
export type AlternativeRequest = {
  id: string
  /** Null or empty → "No note". */
  note: string | null
  createdAt: string
}

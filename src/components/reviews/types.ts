export type ReviewState = 'Waiting' | 'Approved' | 'Rejected'

/** UI model until T-06-04 Result. */
export type AdminReview = {
  id: string
  customerName: string
  orderId: string
  giftRequestId: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string | null
  /** ISO 8601 of the day the review was sent. */
  sentAt: string
  state: ReviewState
}

export const REVIEWS_PAGE_SIZE = 20

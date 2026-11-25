export type ReviewState = 'Waiting' | 'Approved' | 'Rejected'

/** Admin review as shown on the Reviews page and order details (T-06-04 / T-06-05). */
export type AdminReview = {
  id: string
  customerName: string
  orderId: string
  giftRequestId: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string | null
  /** ISO 8601 when the review was sent (createdAt from the API). */
  sentAt: string
  state: ReviewState
}

export const REVIEWS_PAGE_SIZE = 20

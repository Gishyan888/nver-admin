import type { ApiAdminReview } from '../../api/reviews'
import type { AdminReview, ReviewState } from './types'

function reviewStateFromApi(value: string): ReviewState | null {
  if (value === 'waiting') {
    return 'Waiting'
  }
  if (value === 'approved') {
    return 'Approved'
  }
  if (value === 'rejected') {
    return 'Rejected'
  }
  return null
}

export function adminReviewFromApi(dto: ApiAdminReview): AdminReview | null {
  const state = reviewStateFromApi(dto.state)
  const stars = dto.stars
  if (!state || stars < 1 || stars > 5) {
    return null
  }
  return {
    id: dto.id,
    customerName: dto.customerName,
    orderId: dto.orderId,
    giftRequestId: dto.giftRequestId,
    rating: stars as 1 | 2 | 3 | 4 | 5,
    text: dto.text,
    sentAt: dto.createdAt,
    state,
  }
}

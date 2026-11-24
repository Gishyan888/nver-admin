import type { AdminReview } from './types'

/** Waiting first, then the others, newest first within each group. */
export function sortReviewsForAdmin(reviews: AdminReview[]): AdminReview[] {
  return [...reviews].sort((a, b) => {
    const aWaiting = a.state === 'Waiting' ? 0 : 1
    const bWaiting = b.state === 'Waiting' ? 0 : 1
    if (aWaiting !== bWaiting) {
      return aWaiting - bWaiting
    }
    return b.sentAt.localeCompare(a.sentAt)
  })
}

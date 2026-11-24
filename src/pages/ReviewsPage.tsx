import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ReviewsPageContent } from '../components/reviews/ReviewsPageContent'
import { buildDemoReviews } from '../components/reviews/reviewsDemo'
import type { AdminReview, ReviewState } from '../components/reviews/types'
import { AdminShell } from '../components/standard/AdminShell'

/**
 * Admin "Reviews" page (T-06-05) — demo fixtures until T-06-04 Result.
 * Empty: /reviews?empty=1
 */
export function ReviewsPage() {
  const [params] = useSearchParams()
  const empty = params.get('empty') === '1'
  const [reviews, setReviews] = useState<AdminReview[]>(() =>
    empty ? [] : buildDemoReviews(),
  )

  function handleDecide(
    reviewId: string,
    state: Exclude<ReviewState, 'Waiting'>,
  ) {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, state } : review,
      ),
    )
  }

  return (
    <AdminShell title="Reviews" currentNav="Reviews">
      <ReviewsPageContent reviews={reviews} onDecide={handleDecide} />
    </AdminShell>
  )
}

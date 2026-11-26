import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  approveAdminReview,
  listAdminReviews,
  rejectAdminReview,
} from '../api/reviews'
import { ApiError, NetworkError } from '../api/types'
import { adminReviewFromApi } from '../components/reviews/mapAdminReview'
import { ReviewsPageContent } from '../components/reviews/ReviewsPageContent'
import { buildDemoReviews } from '../components/reviews/reviewsDemo'
import type { AdminReview, ReviewState } from '../components/reviews/types'
import { useAdminShell } from '../components/standard/AdminLayout'

type PageOverlay = 'none' | 'loading' | 'error' | 'offline'

/**
 * Admin "Reviews" page (T-06-05).
 * Empty fixture: /reviews?empty=1 · Demo list: /reviews?demo=1
 */
export function ReviewsPage() {
  const [params] = useSearchParams()
  const empty = params.get('empty') === '1'
  const demo = params.get('demo') === '1'
  const fixturesOnly = empty || demo

  const [page, setPage] = useState(1)
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [total, setTotal] = useState(0)
  const [overlay, setOverlay] = useState<PageOverlay>(
    fixturesOnly ? 'none' : 'loading',
  )
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (empty) {
      setReviews([])
      setTotal(0)
      setOverlay('none')
      return
    }
    if (demo) {
      const items = buildDemoReviews()
      setReviews(items)
      setTotal(items.length)
      setOverlay('none')
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setOverlay('loading')
    try {
      const result = await listAdminReviews(page)
      const mapped = result.items
        .map(adminReviewFromApi)
        .filter((item): item is AdminReview => item !== null)
      setReviews(mapped)
      setTotal(result.total)
      setOverlay('none')
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      setOverlay('error')
    }
  }, [demo, empty, page])

  useEffect(() => {
    void load()
  }, [load])

  async function handleDecide(
    reviewId: string,
    state: Exclude<ReviewState, 'Waiting'>,
  ) {
    if (fixturesOnly) {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId ? { ...review, state } : review,
        ),
      )
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setBusy(true)
    try {
      const result =
        state === 'Approved'
          ? await approveAdminReview(reviewId)
          : await rejectAdminReview(reviewId)
      const mapped = adminReviewFromApi(result)
      if (!mapped) {
        setOverlay('error')
        return
      }
      setReviews((prev) =>
        prev.map((review) => (review.id === reviewId ? mapped : review)),
      )
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      if (error instanceof ApiError) {
        setOverlay('error')
        return
      }
      setOverlay('error')
    } finally {
      setBusy(false)
    }
  }

  useAdminShell({ title: 'Reviews', currentNav: 'Reviews' })

  return (
    <ReviewsPageContent
      reviews={reviews}
      total={total}
      page={page}
      onPageChange={setPage}
      onDecide={handleDecide}
      busy={busy}
      overlay={overlay}
      serverPaged={!fixturesOnly}
    />
  )
}

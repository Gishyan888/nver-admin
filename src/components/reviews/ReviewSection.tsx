import { useCallback, useEffect, useState } from 'react'
import {
  approveAdminReview,
  getAdminGiftRequestReview,
  rejectAdminReview,
} from '../../api/reviews'
import { ApiError, NetworkError } from '../../api/types'
import { formatReviewSentDay } from '../../lib/formatDateTime'
import { StandardContentState } from '../standard/StandardContentState'
import { adminReviewFromApi } from './mapAdminReview'
import { ReviewDecisionDialog } from './ReviewDecisionDialog'
import { ReviewStateLabel } from './ReviewStateLabel'
import { StarRating } from './StarRating'
import type { AdminReview } from './types'

type SectionOverlay = 'none' | 'loading' | 'error' | 'offline'

type ReviewSectionProps = {
  giftRequestId: string
  /**
   * Fixture review for demos (`?review=waiting` etc.).
   * When set with fixturesOnly, skips the API.
   */
  fixtureReview?: AdminReview | null
  fixturesOnly?: boolean
}

/**
 * Order-details Review section (T-06-05).
 * Whether "No text" shows here is not decided — only the page column has a frame;
 * the section omits a text line when there is none.
 */
export function ReviewSection({
  giftRequestId,
  fixtureReview = null,
  fixturesOnly = false,
}: ReviewSectionProps) {
  const [review, setReview] = useState<AdminReview | null>(
    fixturesOnly ? fixtureReview : null,
  )
  const [overlay, setOverlay] = useState<SectionOverlay>(
    fixturesOnly ? 'none' : 'loading',
  )
  const [dialog, setDialog] = useState<'approve' | 'reject' | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (fixturesOnly) {
      setReview(fixtureReview)
      setOverlay('none')
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setOverlay('loading')
    try {
      const result = await getAdminGiftRequestReview(giftRequestId)
      if (result.review) {
        const mapped = adminReviewFromApi(result.review)
        if (!mapped) {
          setOverlay('error')
          return
        }
        setReview(mapped)
      } else {
        setReview(null)
      }
      setOverlay('none')
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      setOverlay('error')
    }
  }, [fixtureReview, fixturesOnly, giftRequestId])

  useEffect(() => {
    void load()
  }, [load])

  async function handleDecide(kind: 'approve' | 'reject') {
    if (!review) {
      return
    }
    if (fixturesOnly) {
      setReview({
        ...review,
        state: kind === 'approve' ? 'Approved' : 'Rejected',
      })
      setDialog(null)
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setBusy(true)
    try {
      const result =
        kind === 'approve'
          ? await approveAdminReview(review.id)
          : await rejectAdminReview(review.id)
      const mapped = adminReviewFromApi(result)
      if (!mapped) {
        setOverlay('error')
        return
      }
      setReview(mapped)
      setDialog(null)
      setOverlay('none')
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

  if (overlay === 'loading') {
    return (
      <div className="w-full max-w-[752px] rounded-lg border border-border-default bg-bg-default p-6">
        <StandardContentState kind="loading" />
      </div>
    )
  }

  if (overlay === 'error' || overlay === 'offline') {
    return (
      <div className="flex min-h-48 w-full max-w-[752px] flex-col rounded-lg border border-border-default bg-bg-default">
        <StandardContentState kind={overlay === 'offline' ? 'offline' : 'error'} />
      </div>
    )
  }

  if (!review) {
    return (
      <section className="flex w-full max-w-[752px] flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
        <h2 className="text-base font-semibold leading-6 text-text-primary">
          Review
        </h2>
        <p className="text-base leading-6 text-text-secondary">Not yet</p>
      </section>
    )
  }

  const waiting = review.state === 'Waiting'

  return (
    <>
      <section className="flex w-full max-w-[752px] flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold leading-6 text-text-primary">
            Review
          </h2>
          <ReviewStateLabel state={review.state} />
        </div>
        <StarRating rating={review.rating} />
        {review.text ? (
          <p className="w-full text-base leading-6 text-text-primary">
            {review.text}
          </p>
        ) : null}
        <p className="text-sm leading-5 text-text-secondary">
          {`Sent ${formatReviewSentDay(review.sentAt)}`}
        </p>
        {waiting ? (
          <div className="flex items-start gap-3 overflow-hidden">
            <button
              type="button"
              disabled={busy}
              onClick={() => setDialog('approve')}
              className="flex h-12 cursor-pointer items-center rounded-lg bg-bg-inverse px-6 text-base font-medium text-text-on-accent disabled:opacity-60"
            >
              Approve
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setDialog('reject')}
              className="flex h-12 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary disabled:opacity-60"
            >
              Reject
            </button>
          </div>
        ) : null}
      </section>

      {dialog ? (
        <ReviewDecisionDialog
          kind={dialog}
          busy={busy}
          onGoBack={() => setDialog(null)}
          onConfirm={() => {
            void handleDecide(dialog)
          }}
        />
      ) : null}
    </>
  )
}

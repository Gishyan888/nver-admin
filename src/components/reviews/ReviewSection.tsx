import { useState } from 'react'
import { formatReviewSentDay } from '../../lib/formatDateTime'
import { StandardContentState } from '../standard/StandardContentState'
import { ReviewDecisionDialog } from './ReviewDecisionDialog'
import { ReviewStateLabel } from './ReviewStateLabel'
import { StarRating } from './StarRating'
import type { AdminReview, ReviewState } from './types'

type SectionOverlay = 'none' | 'loading' | 'error' | 'offline'

type ReviewSectionProps = {
  /** Null → "Not yet". */
  review: AdminReview | null
  onDecide?: (reviewId: string, state: Exclude<ReviewState, 'Waiting'>) => void
  overlay?: SectionOverlay
}

/**
 * Order-details Review section (T-06-05).
 * Whether "No text" shows here is not decided — only the page column has a frame;
 * the section omits a text line when there is none.
 */
export function ReviewSection({
  review,
  onDecide,
  overlay = 'none',
}: ReviewSectionProps) {
  const [dialog, setDialog] = useState<'approve' | 'reject' | null>(null)

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
              onClick={() => setDialog('approve')}
              className="flex h-12 cursor-pointer items-center rounded-lg bg-bg-inverse px-6 text-base font-medium text-text-on-accent"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => setDialog('reject')}
              className="flex h-12 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary"
            >
              Reject
            </button>
          </div>
        ) : null}
      </section>

      {dialog ? (
        <ReviewDecisionDialog
          kind={dialog}
          onGoBack={() => setDialog(null)}
          onConfirm={() => {
            onDecide?.(
              review.id,
              dialog === 'approve' ? 'Approved' : 'Rejected',
            )
            setDialog(null)
          }}
        />
      ) : null}
    </>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatReviewSentDay } from '../../lib/formatDateTime'
import { StandardContentState } from '../standard/StandardContentState'
import { ReviewDecisionDialog } from './ReviewDecisionDialog'
import { ReviewStateLabel } from './ReviewStateLabel'
import { sortReviewsForAdmin } from './sortReviews'
import { StarRating } from './StarRating'
import type { AdminReview, ReviewState } from './types'
import { REVIEWS_PAGE_SIZE } from './types'

type PageOverlay = 'none' | 'loading' | 'error' | 'offline'

type ReviewsPageContentProps = {
  reviews: AdminReview[]
  onDecide: (reviewId: string, state: Exclude<ReviewState, 'Waiting'>) => void
  overlay?: PageOverlay
}

type PendingDecision = {
  reviewId: string
  kind: 'approve' | 'reject'
}

export function ReviewsPageContent({
  reviews,
  onDecide,
  overlay = 'none',
}: ReviewsPageContentProps) {
  const [page, setPage] = useState(0)
  const [pending, setPending] = useState<PendingDecision | null>(null)

  const sorted = useMemo(() => sortReviewsForAdmin(reviews), [reviews])
  const pageCount = Math.max(1, Math.ceil(sorted.length / REVIEWS_PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageRows = sorted.slice(
    safePage * REVIEWS_PAGE_SIZE,
    safePage * REVIEWS_PAGE_SIZE + REVIEWS_PAGE_SIZE,
  )
  const isFirst = safePage === 0
  const isLast = safePage >= pageCount - 1 || sorted.length === 0

  if (overlay === 'loading') {
    return <StandardContentState kind="loading" />
  }
  if (overlay === 'error' || overlay === 'offline') {
    return (
      <StandardContentState kind={overlay === 'offline' ? 'offline' : 'error'} />
    )
  }

  if (sorted.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-base leading-6 text-text-secondary">No reviews yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-8">
        <div className="w-full overflow-x-auto rounded-lg border border-border-default">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr className="bg-bg-subtle">
                {[
                  'Customer name',
                  'Order ID',
                  'Rating',
                  'Review',
                  'Sent',
                  'State',
                  '',
                ].map((label) => (
                  <th
                    key={label || 'actions'}
                    className="px-4 py-3 text-sm font-medium leading-5 text-text-secondary"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((review) => (
                <tr
                  key={review.id}
                  className="border-t border-border-default align-top"
                >
                  <td className="px-4 py-4 text-sm leading-5 text-text-primary">
                    {review.customerName}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      to={`/orders/${review.giftRequestId}`}
                      className="text-sm font-medium leading-5 text-accent-default"
                    >
                      {review.orderId}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <StarRating rating={review.rating} />
                  </td>
                  <td className="max-w-xs px-4 py-4 text-sm leading-5">
                    {review.text ? (
                      <span className="text-text-primary">{review.text}</span>
                    ) : (
                      <span className="text-text-secondary">No text</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm leading-5 text-text-primary">
                    {formatReviewSentDay(review.sentAt)}
                  </td>
                  <td className="px-4 py-4">
                    <ReviewStateLabel state={review.state} />
                  </td>
                  <td className="px-4 py-4">
                    {review.state === 'Waiting' ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setPending({ reviewId: review.id, kind: 'approve' })
                          }
                          className="flex h-9 cursor-pointer items-center rounded-lg bg-bg-inverse px-4 text-sm font-medium text-text-on-accent"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPending({ reviewId: review.id, kind: 'reject' })
                          }
                          className="flex h-9 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-4 text-sm font-medium text-text-primary"
                        >
                          Reject
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="flex h-12 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary disabled:cursor-default disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => setPage((p) => p + 1)}
            className="flex h-12 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary disabled:cursor-default disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {pending ? (
        <ReviewDecisionDialog
          kind={pending.kind}
          onGoBack={() => setPending(null)}
          onConfirm={() => {
            onDecide(
              pending.reviewId,
              pending.kind === 'approve' ? 'Approved' : 'Rejected',
            )
            setPending(null)
          }}
        />
      ) : null}
    </>
  )
}

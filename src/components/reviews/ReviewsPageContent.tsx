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
  total: number
  /** 1-based page index. */
  page: number
  onPageChange: (page: number) => void
  onDecide: (
    reviewId: string,
    state: Exclude<ReviewState, 'Waiting'>,
  ) => void | Promise<void>
  busy?: boolean
  overlay?: PageOverlay
  /** When true, `reviews` is already one server page; otherwise client-paged. */
  serverPaged?: boolean
}

type PendingDecision = {
  reviewId: string
  kind: 'approve' | 'reject'
}

export function ReviewsPageContent({
  reviews,
  total,
  page,
  onPageChange,
  onDecide,
  busy = false,
  overlay = 'none',
  serverPaged = false,
}: ReviewsPageContentProps) {
  const [pending, setPending] = useState<PendingDecision | null>(null)
  const [confirming, setConfirming] = useState(false)

  const sorted = useMemo(
    () => (serverPaged ? reviews : sortReviewsForAdmin(reviews)),
    [reviews, serverPaged],
  )

  const pageCount = Math.max(1, Math.ceil(total / REVIEWS_PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), pageCount)
  const pageRows = serverPaged
    ? sorted
    : sorted.slice(
        (safePage - 1) * REVIEWS_PAGE_SIZE,
        (safePage - 1) * REVIEWS_PAGE_SIZE + REVIEWS_PAGE_SIZE,
      )
  const isFirst = safePage <= 1
  const isLast = safePage >= pageCount || total === 0

  if (overlay === 'loading') {
    return <StandardContentState kind="loading" />
  }
  if (overlay === 'error' || overlay === 'offline') {
    return (
      <StandardContentState kind={overlay === 'offline' ? 'offline' : 'error'} />
    )
  }

  if (total === 0) {
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
                          disabled={busy}
                          onClick={() =>
                            setPending({ reviewId: review.id, kind: 'approve' })
                          }
                          className="flex h-9 cursor-pointer items-center rounded-lg bg-bg-inverse px-4 text-sm font-medium text-text-on-accent disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            setPending({ reviewId: review.id, kind: 'reject' })
                          }
                          className="flex h-9 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-4 text-sm font-medium text-text-primary disabled:opacity-60"
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
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
            className="flex h-12 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary disabled:cursor-default disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => onPageChange(safePage + 1)}
            className="flex h-12 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary disabled:cursor-default disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {pending ? (
        <ReviewDecisionDialog
          kind={pending.kind}
          busy={confirming || busy}
          onGoBack={() => setPending(null)}
          onConfirm={() => {
            void (async () => {
              setConfirming(true)
              try {
                await onDecide(
                  pending.reviewId,
                  pending.kind === 'approve' ? 'Approved' : 'Rejected',
                )
                setPending(null)
              } finally {
                setConfirming(false)
              }
            })()
          }}
        />
      ) : null}
    </>
  )
}

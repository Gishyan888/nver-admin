import { Link, useParams, useSearchParams } from 'react-router-dom'
import { GiftOptionsSection } from '../components/gift-options/GiftOptionsSection'
import { AdminShell } from '../components/standard/AdminShell'
import type { GiftRequestStatus } from '../lib/giftRequestStatus'

const STATUSES: GiftRequestStatus[] = [
  'Registered',
  'In Progress',
  'Approved',
  'Preparing',
  'Ready for Pickup',
  'Completed',
  'Canceled',
]

function parseStatus(value: string | null): GiftRequestStatus {
  if (value && STATUSES.includes(value as GiftRequestStatus)) {
    return value as GiftRequestStatus
  }
  return 'In Progress'
}

/**
 * Host for T-03-07 / T-03-08 until T-10-12 builds the full order details page.
 * Route: /orders/:giftRequestId?status=In%20Progress
 * Comments UI fixtures (until T-03-06): &demo=comments
 */
export function OrderDetailsGiftOptionsHost() {
  const { giftRequestId = '' } = useParams()
  const [params] = useSearchParams()
  const status = parseStatus(params.get('status'))
  const commentsDemo = params.get('demo') === 'comments'

  return (
    <AdminShell title="Order details">
      <div className="flex flex-col gap-6 p-8">
        <div>
          <Link
            to="/"
            className="text-sm font-medium leading-5 text-accent-default"
          >
            Back to orders
          </Link>
          <p className="mt-2 text-sm text-text-secondary">
            Gift options (T-03-07) and comments / requests for alternatives
            (T-03-08). Full order details: T-10-12. Status for this host:{' '}
            {status} (change with ?status=).
            {commentsDemo
              ? ' Showing frame fixtures for comments and requests (demo=comments); API wiring waits on T-03-06.'
              : ' Add &demo=comments for comment/request fixtures until T-03-06.'}
          </p>
        </div>
        {giftRequestId ? (
          <GiftOptionsSection
            giftRequestId={giftRequestId}
            status={status}
            commentsDemo={commentsDemo}
          />
        ) : (
          <p className="text-sm text-text-secondary">Missing gift request id.</p>
        )}
      </div>
    </AdminShell>
  )
}

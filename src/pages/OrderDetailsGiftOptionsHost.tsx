import { Link, useParams, useSearchParams } from 'react-router-dom'
import { GiftOptionsSection } from '../components/gift-options/GiftOptionsSection'
import { AdminShell } from '../components/standard/AdminShell'
import { TimelineSection } from '../components/timeline/TimelineSection'
import { demoTimelineForQuery } from '../components/timeline/timelineDemo'
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
 * Host for T-03-07 / T-03-08 / T-05-09 until T-10-12 builds the full order details page.
 * Route: /orders/:giftRequestId?status=In%20Progress
 * Comments fixtures: &demo=comments
 * Timeline fixtures: &demo=timeline | timeline-canceled | timeline-in-progress
 */
export function OrderDetailsGiftOptionsHost() {
  const { giftRequestId = '' } = useParams()
  const [params] = useSearchParams()
  const status = parseStatus(params.get('status'))
  const demo = params.get('demo')
  const commentsDemo = demo === 'comments'
  const timelineDemo = demoTimelineForQuery(demo)

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
            Gift options (T-03-07), comments / requests (T-03-08), timeline
            (T-05-09). Full order details: T-10-12. Status for this host:{' '}
            {status} (change with ?status=).
            {commentsDemo
              ? ' Showing comment/request fixtures (demo=comments).'
              : null}
            {timelineDemo
              ? ` Showing timeline fixtures (demo=${demo}).`
              : ' Add &demo=timeline or &demo=timeline-canceled for timeline fixtures until T-05-05.'}
          </p>
        </div>
        {giftRequestId ? (
          <div className="flex flex-wrap items-start gap-6">
            <GiftOptionsSection
              giftRequestId={giftRequestId}
              status={status}
              commentsDemo={commentsDemo}
            />
            {timelineDemo ? (
              <TimelineSection
                status={timelineDemo.status}
                reachedAt={timelineDemo.reachedAt}
              />
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">Missing gift request id.</p>
        )}
      </div>
    </AdminShell>
  )
}

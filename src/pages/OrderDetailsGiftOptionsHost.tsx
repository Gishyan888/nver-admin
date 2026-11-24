import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { GiftOptionsSection } from '../components/gift-options/GiftOptionsSection'
import { StatusSection } from '../components/status/StatusSection'
import { AdminShell } from '../components/standard/AdminShell'
import { TimelineSection } from '../components/timeline/TimelineSection'
import {
  DEMO_TIMELINE_CANCELED,
  DEMO_TIMELINE_IN_PROGRESS,
  DEMO_TIMELINE_PREPARING,
  demoTimelineForQuery,
} from '../components/timeline/timelineDemo'
import {
  TIMELINE_STAGES,
  type TimelineReachedAt,
} from '../components/timeline/types'
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

const DEMO_PICKUP_ADDRESS = 'Nvér Studio, 12 Abovyan Street, Yerevan'
const DEMO_PICKUP_NOTE = 'Open Monday to Saturday, 11:00 to 19:00.'

function parseStatus(value: string | null): GiftRequestStatus {
  if (value && STATUSES.includes(value as GiftRequestStatus)) {
    return value as GiftRequestStatus
  }
  return 'Registered'
}

function seedReachedAt(status: GiftRequestStatus): TimelineReachedAt {
  if (status === 'Canceled') {
    return { ...DEMO_TIMELINE_CANCELED.reachedAt }
  }
  if (status === 'Preparing') {
    return { ...DEMO_TIMELINE_PREPARING.reachedAt }
  }
  if (status === 'In Progress') {
    return { ...DEMO_TIMELINE_IN_PROGRESS.reachedAt }
  }
  const reached: TimelineReachedAt = {}
  for (const stage of TIMELINE_STAGES) {
    reached[stage] = '2026-11-22T10:12:00.000Z'
    if (stage === status) {
      break
    }
  }
  return reached
}

function seedPickup(status: GiftRequestStatus): {
  address: string | null
  note: string | null
} {
  if (status === 'Ready for Pickup' || status === 'Completed') {
    return { address: DEMO_PICKUP_ADDRESS, note: DEMO_PICKUP_NOTE }
  }
  return { address: null, note: null }
}

/**
 * Host for T-03-07 / T-03-08 / T-05-08 / T-05-09 until T-10-12.
 * /orders/:giftRequestId?status=Registered
 * &demo=comments | timeline | timeline-canceled | timeline-in-progress
 */
export function OrderDetailsGiftOptionsHost() {
  const { giftRequestId = '' } = useParams()
  const [params] = useSearchParams()
  const initialStatus = parseStatus(params.get('status'))
  const demo = params.get('demo')
  const commentsDemo = demo === 'comments'
  const timelineFixture = demoTimelineForQuery(demo)

  const initialPickup = useMemo(
    () => seedPickup(initialStatus),
    [initialStatus],
  )

  const [status, setStatus] = useState<GiftRequestStatus>(initialStatus)
  const [pickupAddress, setPickupAddress] = useState<string | null>(
    initialPickup.address,
  )
  const [pickupNote, setPickupNote] = useState<string | null>(
    initialPickup.note,
  )
  const [reachedAt, setReachedAt] = useState<TimelineReachedAt>(() =>
    seedReachedAt(initialStatus),
  )

  const timelineStatus = timelineFixture?.status ?? status
  const timelineReached = timelineFixture?.reachedAt ?? reachedAt

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
            Sections: gift options (T-03-07/08), status (T-05-08), timeline
            (T-05-09). Full page: T-10-12. Start with ?status=. Moves and cancel
            update local UI until T-05-05 / T-05-06.
            {commentsDemo ? ' demo=comments.' : null}
            {timelineFixture ? ` Fixed timeline fixture demo=${demo}.` : null}
          </p>
        </div>
        {giftRequestId ? (
          <div className="flex flex-wrap items-start gap-6">
            <GiftOptionsSection
              giftRequestId={giftRequestId}
              status={status}
              commentsDemo={commentsDemo}
            />
            <StatusSection
              status={status}
              pickupAddress={pickupAddress}
              pickupNote={pickupNote}
              onChange={(next) => {
                setStatus(next.status)
                setPickupAddress(next.pickupAddress)
                setPickupNote(next.pickupNote)
                setReachedAt((prev) => ({
                  ...prev,
                  [next.status]: new Date().toISOString(),
                }))
              }}
            />
            <TimelineSection
              status={timelineStatus}
              reachedAt={timelineReached}
            />
          </div>
        ) : (
          <p className="text-sm text-text-secondary">Missing gift request id.</p>
        )}
      </div>
    </AdminShell>
  )
}

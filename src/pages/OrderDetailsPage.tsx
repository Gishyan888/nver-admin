import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getAdminGiftRequest } from '../api/giftRequests'
import { NetworkError } from '../api/types'
import { OrderChat } from '../components/chat/OrderChat'
import { GiftOptionsSection } from '../components/gift-options/GiftOptionsSection'
import { GiftingTierSection } from '../components/order-details/GiftingTierSection'
import { InternalNotesSection } from '../components/order-details/InternalNotesSection'
import { orderDetailsFromApi } from '../components/order-details/mapOrderDetails'
import { OrderDetailsHeader } from '../components/order-details/OrderDetailsHeader'
import {
  DEMO_ORDER_DETAILS_NEW,
  DEMO_ORDER_DETAILS_PAID,
} from '../components/order-details/orderDetailsDemo'
import { PaymentSection } from '../components/order-details/PaymentSection'
import { RequestSection } from '../components/order-details/RequestSection'
import type {
  OrderDetailsDemo,
  PaymentState,
} from '../components/order-details/types'
import { ReviewSection } from '../components/reviews/ReviewSection'
import {
  DEMO_ORDER_REVIEW_APPROVED,
  DEMO_ORDER_REVIEW_REJECTED,
  DEMO_ORDER_REVIEW_WAITING,
} from '../components/reviews/reviewsDemo'
import { StatusSection } from '../components/status/StatusSection'
import { AdminShell } from '../components/standard/AdminShell'
import { StandardContentState } from '../components/standard/StandardContentState'
import { TimelineSection } from '../components/timeline/TimelineSection'
import {
  DEMO_TIMELINE_PREPARING,
  demoTimelineForQuery,
} from '../components/timeline/timelineDemo'
import type { TimelineReachedAt } from '../components/timeline/types'
import type { GiftRequestStatus } from '../lib/giftRequestStatus'

type PageOverlay = 'none' | 'loading' | 'error' | 'offline'

function parsePayment(value: string | null): PaymentState | null {
  if (value === 'not-yet') {
    return { kind: 'not-yet' }
  }
  if (value === 'paid') {
    return {
      kind: 'paid',
      amountUsd: 1250,
      paidOn: '2026-11-23T12:00:00.000Z',
    }
  }
  if (value === 'refunded') {
    return {
      kind: 'refunded',
      amountUsd: 1250,
      paidOn: '2026-11-23T12:00:00.000Z',
      refundedOn: '2026-11-25T12:00:00.000Z',
    }
  }
  if (value === 'refund-failed') {
    return { kind: 'refund-failed' }
  }
  return null
}

function resolveDemo(
  giftRequestId: string,
  variant: string | null,
): OrderDetailsDemo {
  const base =
    variant === 'new' ? DEMO_ORDER_DETAILS_NEW : DEMO_ORDER_DETAILS_PAID
  return {
    ...base,
    giftRequestId: giftRequestId || base.giftRequestId,
  }
}

/**
 * Order details page (T-10-12).
 * Fixtures: ?demo=1&variant=new · ?payment=… · ?state=loading|error|offline
 * · ?review=waiting|approved|rejected|none · ?unread=1
 */
export function OrderDetailsPage() {
  const { giftRequestId = '' } = useParams()
  const [params] = useSearchParams()
  const stateParam = params.get('state')
  const demoParam = params.get('demo')
  const timelineDemo = demoTimelineForQuery(demoParam)
  const fixturesOnly =
    demoParam === '1' ||
    demoParam === 'comments' ||
    params.has('variant') ||
    params.has('payment') ||
    Boolean(timelineDemo) ||
    stateParam === 'loading' ||
    stateParam === 'error' ||
    stateParam === 'offline'
  /** Gift-option / comments fixtures (API skipped). */
  const giftOptionsFixtures =
    fixturesOnly || demoParam === 'comments'

  const demo = useMemo(
    () => resolveDemo(giftRequestId, params.get('variant')),
    [giftRequestId, params],
  )
  const paymentOverride = parsePayment(params.get('payment'))

  /** Seed Preparing timeline for paid demo frame (98:1064) unless overridden. */
  const defaultDemoTimeline =
    fixturesOnly && !timelineDemo && params.get('variant') !== 'new'
      ? DEMO_TIMELINE_PREPARING
      : null
  const initialTimeline = timelineDemo ?? defaultDemoTimeline

  const [overlay, setOverlay] = useState<PageOverlay>(() => {
    if (stateParam === 'loading' || stateParam === 'error' || stateParam === 'offline') {
      return stateParam
    }
    return fixturesOnly ? 'none' : 'loading'
  })
  const [details, setDetails] = useState<OrderDetailsDemo | null>(
    fixturesOnly ? demo : null,
  )
  const [status, setStatus] = useState<GiftRequestStatus>(
    () => initialTimeline?.status ?? demo.status,
  )
  const [pickupAddress, setPickupAddress] = useState<string | null>(null)
  const [pickupNote, setPickupNote] = useState<string | null>(null)
  const [reachedAt, setReachedAt] = useState<TimelineReachedAt>(
    () => initialTimeline?.reachedAt ?? {},
  )
  const [hasUnreadMessage, setHasUnreadMessage] = useState(
    // Figma order-details frame shows unread chat by default for paid demo.
    params.get('unread') === '1' ||
      (fixturesOnly &&
        params.get('unread') !== '0' &&
        params.get('variant') !== 'new'),
  )

  const reviewParam = params.get('review')
  const reviewFixture =
    reviewParam === 'waiting'
      ? DEMO_ORDER_REVIEW_WAITING
      : reviewParam === 'approved'
        ? DEMO_ORDER_REVIEW_APPROVED
        : reviewParam === 'rejected'
          ? DEMO_ORDER_REVIEW_REJECTED
          : reviewParam === 'none'
            ? null
            : undefined
  const reviewFixturesOnly = reviewFixture !== undefined || fixturesOnly

  const load = useCallback(async () => {
    if (
      stateParam === 'loading' ||
      stateParam === 'error' ||
      stateParam === 'offline'
    ) {
      setOverlay(stateParam)
      return
    }
    if (fixturesOnly) {
      const timeline = timelineDemo ?? defaultDemoTimeline
      setDetails(demo)
      setStatus(timeline?.status ?? demo.status)
      if (timeline?.reachedAt) {
        setReachedAt(timeline.reachedAt)
      }
      setHasUnreadMessage(
        params.get('unread') === '1' ||
          (params.get('unread') !== '0' && params.get('variant') !== 'new'),
      )
      setOverlay('none')
      return
    }
    if (!giftRequestId) {
      setOverlay('error')
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setOverlay('loading')
    try {
      const result = await getAdminGiftRequest(giftRequestId)
      const mapped = orderDetailsFromApi(result)
      if (!mapped) {
        setOverlay('error')
        return
      }
      setDetails(mapped)
      setStatus(mapped.status)
      setPickupAddress(mapped.pickupAddress)
      setPickupNote(mapped.pickupNote)
      setHasUnreadMessage(mapped.hasUnreadMessage)
      setOverlay('none')
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      setOverlay('error')
    }
  }, [
    defaultDemoTimeline,
    demo,
    fixturesOnly,
    giftRequestId,
    params,
    stateParam,
    timelineDemo,
  ])

  useEffect(() => {
    void load()
  }, [load])

  if (overlay === 'loading' || overlay === 'error' || overlay === 'offline') {
    return (
      <AdminShell title="Orders" currentNav="Orders">
        <StandardContentState
          kind={
            overlay === 'loading'
              ? 'loading'
              : overlay === 'offline'
                ? 'offline'
                : 'error'
          }
        />
      </AdminShell>
    )
  }

  if (!details) {
    return (
      <AdminShell title="Orders" currentNav="Orders">
        <StandardContentState kind="error" />
      </AdminShell>
    )
  }

  const payment = paymentOverride ?? details.payment
  const activeId = details.giftRequestId

  return (
    <AdminShell
      currentNav="Orders"
      header={
        <OrderDetailsHeader
          orderId={details.orderId}
          status={status}
          customerName={details.customerName}
          createdAt={details.createdAt}
        />
      }
    >
      <div className="flex flex-col items-start gap-6 p-8 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <RequestSection answers={details.request} />
          <GiftingTierSection tier={details.tier} />
          <GiftOptionsSection
            giftRequestId={activeId}
            status={status}
            commentsDemo={giftOptionsFixtures}
          />
          <ReviewSection
            giftRequestId={activeId}
            fixturesOnly={reviewFixturesOnly}
            fixtureReview={
              reviewFixturesOnly ? (reviewFixture ?? null) : null
            }
          />
        </div>

        <div className="flex w-full max-w-[360px] shrink-0 flex-col gap-6">
          <StatusSection
            giftRequestId={activeId}
            status={status}
            pickupAddress={pickupAddress}
            pickupNote={pickupNote}
            fixturesOnly={fixturesOnly}
            onChange={(next) => {
              setStatus(next.status)
              setPickupAddress(next.pickupAddress)
              setPickupNote(next.pickupNote)
              if (next.reachedAt) {
                setReachedAt((prev) => ({ ...prev, ...next.reachedAt }))
              } else {
                setReachedAt((prev) => ({
                  ...prev,
                  [next.status]: new Date().toISOString(),
                }))
              }
            }}
          />
          <OrderChat
            giftRequestId={activeId}
            orderId={details.orderId}
            customerName={details.customerName}
            status={status}
            unread={hasUnreadMessage}
            onUnreadChange={setHasUnreadMessage}
            fixturesOnly={fixturesOnly}
          />
          <TimelineSection
            giftRequestId={activeId}
            status={status}
            reachedAt={reachedAt}
            fixturesOnly={fixturesOnly}
          />
          <PaymentSection payment={payment} />
          <InternalNotesSection
            giftRequestId={activeId}
            fixturesOnly={fixturesOnly}
            seedDemoNotes={params.get('demo') !== 'notes-empty'}
          />
        </div>
      </div>
    </AdminShell>
  )
}

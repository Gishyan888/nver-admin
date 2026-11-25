import { useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  buildDemoChatMessages,
  DEMO_ADMIN_EMAIL,
  DEMO_SHAREABLE_OPTIONS,
} from '../components/chat/chatDemo'
import { ChatPanel } from '../components/chat/ChatPanel'
import { ChatSection } from '../components/chat/ChatSection'
import type { ChatMessage } from '../components/chat/types'
import { GiftOptionsSection } from '../components/gift-options/GiftOptionsSection'
import { GiftingTierSection } from '../components/order-details/GiftingTierSection'
import { OrderDetailsHeader } from '../components/order-details/OrderDetailsHeader'
import {
  DEMO_ORDER_DETAILS_NEW,
  DEMO_ORDER_DETAILS_PAID,
} from '../components/order-details/orderDetailsDemo'
import { InternalNotesSection } from '../components/order-details/InternalNotesSection'
import { PaymentSection } from '../components/order-details/PaymentSection'
import { RequestSection } from '../components/order-details/RequestSection'
import type { OrderDetailsDemo, PaymentState } from '../components/order-details/types'
import { ReviewSection } from '../components/reviews/ReviewSection'
import {
  DEMO_ORDER_REVIEW_WAITING,
} from '../components/reviews/reviewsDemo'
import type { AdminReview, ReviewState } from '../components/reviews/types'
import { StatusSection } from '../components/status/StatusSection'
import { AdminShell } from '../components/standard/AdminShell'
import { StandardContentState } from '../components/standard/StandardContentState'
import { TimelineSection } from '../components/timeline/TimelineSection'
import { demoTimelineForQuery } from '../components/timeline/timelineDemo'
import type { TimelineReachedAt } from '../components/timeline/types'
import type { GiftRequestStatus } from '../lib/giftRequestStatus'

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
 * Order details page (T-10-12). Demo fixtures until T-10-07.
 * ?variant=new · ?payment=not-yet|paid|refunded|refund-failed
 * ?state=loading|error|offline · ?review=waiting · ?unread=1
 */
export function OrderDetailsPage() {
  const { giftRequestId = '' } = useParams()
  const [params] = useSearchParams()
  const overlay = params.get('state')
  const demo = useMemo(
    () => resolveDemo(giftRequestId, params.get('variant')),
    [giftRequestId, params],
  )
  const paymentOverride = parsePayment(params.get('payment'))

  const timelineDemo = demoTimelineForQuery(params.get('demo'))
  const [status, setStatus] = useState<GiftRequestStatus>(
    () => timelineDemo?.status ?? demo.status,
  )
  const [pickupAddress, setPickupAddress] = useState<string | null>(null)
  const [pickupNote, setPickupNote] = useState<string | null>(null)
  const [reachedAt, setReachedAt] = useState<TimelineReachedAt>(
    () => timelineDemo?.reachedAt ?? {},
  )
  const [orderReview, setOrderReview] = useState<AdminReview | null>(() =>
    params.get('review') === 'waiting'
      ? { ...DEMO_ORDER_REVIEW_WAITING }
      : null,
  )
  const [chatOpen, setChatOpen] = useState(false)
  const [chatUnread, setChatUnread] = useState(params.get('unread') === '1')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    buildDemoChatMessages(),
  )

  const payment = paymentOverride ?? demo.payment

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

  return (
    <AdminShell title="Orders" currentNav="Orders">
      <div className="flex flex-col gap-6 p-8">
        <OrderDetailsHeader
          orderId={demo.orderId}
          status={status}
          customerName={demo.customerName}
          createdAt={demo.createdAt}
        />

        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <RequestSection answers={demo.request} />
            <GiftingTierSection tier={demo.tier} />
            <GiftOptionsSection
              giftRequestId={demo.giftRequestId}
              status={status}
              commentsDemo={params.get('demo') === 'comments'}
            />
            <ReviewSection
              review={orderReview}
              onDecide={(reviewId, nextState) => {
                setOrderReview((prev) =>
                  prev && prev.id === reviewId
                    ? { ...prev, state: nextState as ReviewState }
                    : prev,
                )
              }}
            />
          </div>

          <div className="flex w-full max-w-[360px] shrink-0 flex-col gap-6">
            <StatusSection
              giftRequestId={demo.giftRequestId}
              status={status}
              pickupAddress={pickupAddress}
              pickupNote={pickupNote}
              fixturesOnly={Boolean(timelineDemo)}
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
            <ChatSection
              unread={chatUnread}
              onOpenChat={() => {
                setChatOpen(true)
                setChatUnread(false)
              }}
            />
            <TimelineSection
              giftRequestId={demo.giftRequestId}
              status={status}
              reachedAt={reachedAt}
              fixturesOnly={Boolean(timelineDemo)}
            />
            <PaymentSection payment={payment} />
            <InternalNotesSection
              seedDemoNotes={params.get('demo') !== 'notes-empty'}
            />
          </div>
        </div>
      </div>

      {chatOpen ? (
        <ChatPanel
          orderId={demo.orderId}
          customerName={demo.customerName}
          status={status}
          messages={chatMessages}
          giftOptions={DEMO_SHAREABLE_OPTIONS}
          onClose={() => setChatOpen(false)}
          onSendText={(text) => {
            setChatMessages((prev) => [
              ...prev,
              {
                id: `local-${Date.now()}`,
                kind: 'text',
                sender: 'admin',
                adminEmail: DEMO_ADMIN_EMAIL,
                text,
                sentAt: new Date().toISOString(),
              },
            ])
          }}
          onSendPhoto={(file) => {
            const url = URL.createObjectURL(file)
            setChatMessages((prev) => [
              ...prev,
              {
                id: `local-photo-${Date.now()}`,
                kind: 'photo',
                sender: 'admin',
                adminEmail: DEMO_ADMIN_EMAIL,
                photoUrl: url,
                sentAt: new Date().toISOString(),
              },
            ])
          }}
          onShareGiftOption={(option) => {
            setChatMessages((prev) => [
              ...prev,
              {
                id: `local-share-${Date.now()}`,
                kind: 'gift-option',
                sender: 'admin',
                adminEmail: DEMO_ADMIN_EMAIL,
                giftOption: { ...option },
                sentAt: new Date().toISOString(),
              },
            ])
          }}
          onTryAgain={(messageId) => {
            setChatMessages((prev) =>
              prev.map((message) =>
                message.id === messageId && 'failed' in message
                  ? { ...message, failed: false }
                  : message,
              ),
            )
          }}
        />
      ) : null}
    </AdminShell>
  )
}

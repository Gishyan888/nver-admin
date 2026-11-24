import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  buildDemoChatMessages,
  buildDemoDeletedGiftMessage,
  buildDemoFailedMessage,
  buildDemoSharedGiftMessage,
  DEMO_ADMIN_EMAIL,
  DEMO_CHAT_CUSTOMER_NAME,
  DEMO_CHAT_ORDER_ID,
  DEMO_SHAREABLE_OPTIONS,
} from '../components/chat/chatDemo'
import { ChatPanel } from '../components/chat/ChatPanel'
import { ChatSection } from '../components/chat/ChatSection'
import type { ChatGiftOptionRef, ChatMessage } from '../components/chat/types'
import { GiftOptionsSection } from '../components/gift-options/GiftOptionsSection'
import { ReviewSection } from '../components/reviews/ReviewSection'
import {
  DEMO_ORDER_REVIEW_APPROVED,
  DEMO_ORDER_REVIEW_REJECTED,
  DEMO_ORDER_REVIEW_WAITING,
} from '../components/reviews/reviewsDemo'
import type { AdminReview, ReviewState } from '../components/reviews/types'
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

function seedOrderReview(value: string | null): AdminReview | null {
  if (value === 'waiting') {
    return { ...DEMO_ORDER_REVIEW_WAITING }
  }
  if (value === 'approved') {
    return { ...DEMO_ORDER_REVIEW_APPROVED }
  }
  if (value === 'rejected') {
    return { ...DEMO_ORDER_REVIEW_REJECTED }
  }
  return null
}

function seedChatMessages(chatDemo: string | null): ChatMessage[] {
  if (chatDemo === 'empty') {
    return []
  }
  const base = buildDemoChatMessages()
  if (chatDemo === 'share') {
    return [...base, buildDemoSharedGiftMessage()]
  }
  if (chatDemo === 'deleted') {
    return [...base, buildDemoDeletedGiftMessage()]
  }
  if (chatDemo === 'failed') {
    return [...base, buildDemoFailedMessage()]
  }
  return base
}

/**
 * Host for section tasks until T-10-12.
 * ?status= · ?review= · ?chat=empty|share|deleted|failed · ?unread=1 · ?share=0
 */
export function OrderDetailsGiftOptionsHost() {
  const { giftRequestId = '' } = useParams()
  const [params] = useSearchParams()
  const initialStatus = parseStatus(params.get('status'))
  const demo = params.get('demo')
  const commentsDemo = demo === 'comments'
  const timelineFixture = demoTimelineForQuery(demo)
  const chatDemo = params.get('chat')
  const startUnread = params.get('unread') === '1'
  const noShareOptions = params.get('share') === '0'

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
  const [orderReview, setOrderReview] = useState<AdminReview | null>(() =>
    seedOrderReview(params.get('review')),
  )
  const [chatOpen, setChatOpen] = useState(false)
  const [chatUnread, setChatUnread] = useState(startUnread)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    seedChatMessages(chatDemo),
  )
  const shareOptions: ChatGiftOptionRef[] = noShareOptions
    ? []
    : DEMO_SHAREABLE_OPTIONS

  const timelineStatus = timelineFixture?.status ?? status
  const timelineReached = timelineFixture?.reachedAt ?? reachedAt

  function appendAdminText(text: string, failed = false) {
    setChatMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        kind: 'text',
        sender: 'admin',
        adminEmail: DEMO_ADMIN_EMAIL,
        text,
        sentAt: new Date().toISOString(),
        failed,
      },
    ])
  }

  return (
    <AdminShell title="Order details" currentNav="Orders">
      <div className="flex flex-col gap-6 p-8">
        <div>
          <Link
            to="/"
            className="text-sm font-medium leading-5 text-accent-default"
          >
            Back to orders
          </Link>
          <p className="mt-2 text-sm text-text-secondary">
            Sections incl. chat (T-07-05). Full page: T-10-12. ?unread=1 ·
            ?chat=empty|share|deleted|failed · ?share=0 · ?status=Completed
            {commentsDemo ? ' · demo=comments' : null}
            {timelineFixture ? ` · demo=${demo}` : null}
          </p>
        </div>
        {giftRequestId ? (
          <div className="flex flex-wrap items-start gap-6">
            <div className="flex min-w-0 flex-1 flex-col gap-6">
              <GiftOptionsSection
                giftRequestId={giftRequestId}
                status={status}
                commentsDemo={commentsDemo}
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
            <div className="flex w-full max-w-[360px] flex-col gap-6">
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
              <ChatSection
                unread={chatUnread}
                onOpenChat={() => {
                  setChatOpen(true)
                  setChatUnread(false)
                }}
              />
              <TimelineSection
                status={timelineStatus}
                reachedAt={timelineReached}
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">Missing gift request id.</p>
        )}
      </div>

      {chatOpen ? (
        <ChatPanel
          orderId={DEMO_CHAT_ORDER_ID}
          customerName={DEMO_CHAT_CUSTOMER_NAME}
          status={status}
          messages={chatMessages}
          giftOptions={shareOptions}
          onClose={() => setChatOpen(false)}
          onSendText={(text) => appendAdminText(text)}
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

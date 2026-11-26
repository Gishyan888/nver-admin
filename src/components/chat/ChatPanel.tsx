import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  chatDayKey,
  formatChatDay,
} from '../../lib/formatDateTime'
import type { GiftRequestStatus } from '../../lib/giftRequestStatus'
import { formatPriceUsd } from '../../lib/formatPrice'
import { AuthenticatedImage } from '../gift-options/AuthenticatedImage'
import { StandardContentState } from '../standard/StandardContentState'
import { ChatMessageBubble } from './ChatMessageBubble'
import type { ChatGiftOptionRef, ChatMessage } from './types'
import { CHAT_TEXT_MAX } from './types'

type PanelOverlay = 'none' | 'loading' | 'error' | 'offline'

type ChatPanelProps = {
  orderId: string
  customerName: string
  status: GiftRequestStatus
  /** When set, overrides status-based sendability (from GET canSend). */
  canSendOverride?: boolean
  messages: ChatMessage[]
  giftOptions: ChatGiftOptionRef[]
  overlay?: PanelOverlay
  onClose: () => void
  onSendText: (text: string) => void
  onSendPhoto: (file: File) => void
  onShareGiftOption: (option: ChatGiftOptionRef) => void
  onTryAgain: (messageId: string) => void
}

function canSendFromStatus(status: GiftRequestStatus): boolean {
  return status !== 'Completed' && status !== 'Canceled'
}

export function ChatPanel({
  orderId,
  customerName,
  status,
  canSendOverride,
  messages,
  giftOptions,
  overlay = 'none',
  onClose,
  onSendText,
  onSendPhoto,
  onShareGiftOption,
  onTryAgain,
}: ChatPanelProps) {
  const [draft, setDraft] = useState('')
  const [sharing, setSharing] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const writable = canSendOverride ?? canSendFromStatus(status)
  const shareDisabled = !writable || giftOptions.length === 0

  const rows = useMemo(() => {
    const ordered = [...messages].sort((a, b) =>
      a.sentAt.localeCompare(b.sentAt),
    )
    const out: Array<
      | { type: 'day'; key: string; label: string }
      | { type: 'message'; message: ChatMessage }
    > = []
    let lastDay: string | null = null
    for (const message of ordered) {
      const day = chatDayKey(message.sentAt)
      if (day !== lastDay) {
        out.push({
          type: 'day',
          key: day,
          label: formatChatDay(message.sentAt),
        })
        lastDay = day
      }
      out.push({ type: 'message', message })
    }
    return out
  }, [messages])

  useEffect(() => {
    const el = listRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages, sharing])

  function handleSend(event: FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || !writable) {
      return
    }
    onSendText(text)
    setDraft('')
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-panel-title"
        className="flex h-full w-full max-w-[480px] flex-col bg-bg-default shadow-lg"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border-default px-6 py-5">
          <div className="min-w-0">
            <h2
              id="chat-panel-title"
              className="text-base font-semibold leading-6 text-text-primary"
            >
              Chat
            </h2>
            <p className="truncate text-sm leading-5 text-text-secondary">
              {`${orderId} · ${customerName}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-xl leading-none text-text-secondary"
          >
            ×
          </button>
        </header>

        {overlay === 'loading' ||
        overlay === 'error' ||
        overlay === 'offline' ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <StandardContentState
              kind={
                overlay === 'loading'
                  ? 'loading'
                  : overlay === 'offline'
                    ? 'offline'
                    : 'error'
              }
            />
          </div>
        ) : sharing ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-border-default px-6 py-4">
              <p className="text-base font-semibold leading-6 text-text-primary">
                Share a gift option
              </p>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-6">
              {giftOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-3 rounded-lg border border-border-default p-3"
                >
                  {option.imageUrl ? (
                    <AuthenticatedImage
                      imageUrl={option.imageUrl}
                      alt=""
                      className="size-14 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="size-14 shrink-0 rounded-lg bg-bg-muted" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-5 text-text-primary">
                      {option.title}
                    </p>
                    <p className="text-sm leading-5 text-text-primary">
                      {formatPriceUsd(option.priceUsd)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onShareGiftOption(option)
                      setSharing(false)
                    }}
                    className="flex h-9 shrink-0 cursor-pointer items-center rounded-lg bg-bg-inverse px-4 text-sm font-medium text-text-on-accent"
                  >
                    Share
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t border-border-default p-6">
              <button
                type="button"
                onClick={() => setSharing(false)}
                className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-border-default bg-bg-default text-base font-medium text-text-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div
              ref={listRef}
              className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4"
            >
              {rows.length === 0 ? (
                <p className="py-8 text-center text-sm leading-5 text-text-secondary">
                  No messages yet.
                </p>
              ) : (
                rows.map((row) =>
                  row.type === 'day' ? (
                    <p
                      key={`day-${row.key}`}
                      className="py-1 text-center text-xs leading-4 text-text-secondary"
                    >
                      {row.label}
                    </p>
                  ) : (
                    <ChatMessageBubble
                      key={row.message.id}
                      message={row.message}
                      onTryAgain={onTryAgain}
                    />
                  ),
                )
              )}
            </div>

            {writable ? (
              <form
                onSubmit={handleSend}
                className="flex shrink-0 flex-col gap-3 border-t border-border-default p-4"
              >
                <textarea
                  value={draft}
                  maxLength={CHAT_TEXT_MAX}
                  rows={3}
                  placeholder="Write a message"
                  onChange={(event) =>
                    setDraft(event.target.value.slice(0, CHAT_TEXT_MAX))
                  }
                  className="w-full resize-none rounded-lg border border-border-default bg-bg-default px-4 py-3 text-base leading-6 text-text-primary outline-none placeholder:text-text-secondary"
                />
                <div className="flex items-center gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) {
                        onSendPhoto(file)
                      }
                      event.target.value = ''
                    }}
                  />
                  <button
                    type="button"
                    aria-label="Add photo"
                    onClick={() => fileRef.current?.click()}
                    className="flex size-12 cursor-pointer items-center justify-center rounded-lg border border-border-default bg-bg-default text-text-secondary"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden
                    >
                      <rect
                        x="2.5"
                        y="4.5"
                        width="15"
                        height="11"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="10"
                        cy="10"
                        r="2.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    disabled={shareDisabled}
                    onClick={() => setSharing(true)}
                    className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-lg border border-border-default bg-bg-default px-3 text-sm font-medium text-text-primary disabled:cursor-default disabled:opacity-40"
                  >
                    Share gift option
                  </button>
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="flex h-12 cursor-pointer items-center rounded-lg bg-bg-inverse px-5 text-base font-medium text-text-on-accent disabled:opacity-40"
                  >
                    Send
                  </button>
                </div>
              </form>
            ) : (
              <div className="shrink-0 border-t border-border-default px-6 py-5">
                <p className="text-sm leading-5 text-text-secondary">
                  {status === 'Canceled'
                    ? 'This gift request is Canceled. Nothing more can be sent.'
                    : 'This gift request is Completed. Nothing more can be sent.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

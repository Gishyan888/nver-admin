import { formatChatTime } from '../../lib/formatDateTime'
import { formatPriceUsd } from '../../lib/formatPrice'
import type { ChatMessage } from './types'

type ChatMessageBubbleProps = {
  message: ChatMessage
  onTryAgain?: (messageId: string) => void
}

export function ChatMessageBubble({
  message,
  onTryAgain,
}: ChatMessageBubbleProps) {
  if (message.kind === 'consultation') {
    return (
      <div className="flex w-full flex-col items-start gap-1">
        <div className="rounded-lg border border-border-default px-3 py-1.5">
          <p className="text-xs font-medium leading-4 text-text-secondary">
            Consultation requested
          </p>
        </div>
        <p className="text-xs leading-4 text-text-secondary">
          {formatChatTime(message.sentAt)}
        </p>
      </div>
    )
  }

  const isAdmin = message.sender === 'admin'
  const failed = Boolean(message.failed)

  const bubbleClass = isAdmin
    ? `rounded-lg bg-accent-subtle px-3 py-2 ${failed ? 'border border-danger-default' : ''}`
    : `rounded-lg bg-bg-muted px-3 py-2 ${failed ? 'border border-danger-default' : ''}`

  return (
    <div
      className={`flex w-full flex-col gap-1 ${
        isAdmin ? 'items-end' : 'items-start'
      }`}
    >
      {isAdmin && message.adminEmail ? (
        <p className="text-xs leading-4 text-text-secondary">
          {message.adminEmail}
        </p>
      ) : null}

      {message.kind === 'text' ? (
        <div className={`max-w-[85%] ${bubbleClass}`}>
          <p className="text-sm leading-5 break-words text-text-primary">
            {message.text}
          </p>
        </div>
      ) : null}

      {message.kind === 'photo' ? (
        <div
          className={`max-w-[85%] overflow-hidden rounded-lg ${
            failed ? 'border border-danger-default' : ''
          }`}
        >
          {message.photoUrl ? (
            <img
              src={message.photoUrl}
              alt=""
              className="max-h-48 w-full object-cover"
            />
          ) : (
            <div className="h-36 w-48 bg-bg-muted" />
          )}
        </div>
      ) : null}

      {message.kind === 'gift-option' ? (
        <div
          className={`flex max-w-[85%] gap-3 rounded-lg border p-3 ${
            message.giftOption.deleted
              ? 'border-border-default bg-bg-subtle opacity-60'
              : failed
                ? 'border-danger-default bg-bg-default'
                : 'border-border-default bg-bg-default'
          }`}
        >
          {message.giftOption.imageUrl ? (
            <img
              src={message.giftOption.imageUrl}
              alt=""
              className="size-16 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="size-16 shrink-0 rounded-lg bg-bg-muted" />
          )}
          <div className="flex min-w-0 flex-col gap-1">
            {message.giftOption.deleted ? (
              <p className="text-sm leading-5 text-text-secondary">
                This gift option is no longer available.
              </p>
            ) : (
              <>
                <p className="text-sm font-medium leading-5 text-text-primary">
                  {message.giftOption.title}
                </p>
                <p className="text-sm leading-5 text-text-primary">
                  {formatPriceUsd(message.giftOption.priceUsd)}
                </p>
              </>
            )}
          </div>
        </div>
      ) : null}

      <div
        className={`flex items-center gap-2 ${
          isAdmin ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <p className="text-xs leading-4 text-text-secondary">
          {formatChatTime(message.sentAt)}
        </p>
      </div>

      {failed ? (
        <div
          className={`flex items-center gap-2 ${
            isAdmin ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <p className="text-xs leading-4 text-danger-default">Not sent</p>
          <button
            type="button"
            onClick={() => onTryAgain?.(message.id)}
            className="cursor-pointer border-0 bg-transparent p-0 text-xs font-medium leading-4 text-accent-default"
          >
            Try again
          </button>
        </div>
      ) : null}
    </div>
  )
}

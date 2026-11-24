type ChatSectionProps = {
  unread?: boolean
  onOpenChat: () => void
}

/** Order-details way into chat (T-07-05). */
export function ChatSection({ unread = false, onOpenChat }: ChatSectionProps) {
  return (
    <section className="flex w-full max-w-[360px] flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
      <div className="flex w-full flex-col gap-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold leading-6 text-text-primary">
            Chat
          </h2>
          {unread ? (
            <span
              aria-label="Unread"
              className="size-2 shrink-0 rounded-full bg-accent-default"
            />
          ) : null}
        </div>
        {unread ? (
          <p className="text-sm leading-5 text-text-secondary">
            New message from the customer
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onOpenChat}
        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-border-default bg-bg-default text-base font-medium text-text-primary"
      >
        Open chat
      </button>
    </section>
  )
}

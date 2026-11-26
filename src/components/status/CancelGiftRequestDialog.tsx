import { dismissOnBackdrop } from '../../lib/dismissOnBackdrop'

type CancelGiftRequestDialogProps = {
  busy?: boolean
  onKeepIt: () => void
  onCancelGiftRequest: () => void
}

export function CancelGiftRequestDialog({
  busy = false,
  onKeepIt,
  onCancelGiftRequest,
}: CancelGiftRequestDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={(event) => dismissOnBackdrop(event, onKeepIt, busy)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-gift-request-title"
        className="flex w-full max-w-[480px] flex-col gap-6 rounded-xl bg-bg-default p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex w-full flex-col gap-2">
          <p
            id="cancel-gift-request-title"
            className="w-full text-xl font-semibold leading-7 text-text-primary"
          >
            Cancel this gift request?
          </p>
          <p className="w-full text-base leading-6 text-text-secondary">
            A paid gift request is refunded in full to the customer.
          </p>
        </div>
        <div className="flex w-full items-start justify-end gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onKeepIt}
            className="flex h-12 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary disabled:opacity-60"
          >
            Keep it
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onCancelGiftRequest}
            className="flex h-12 cursor-pointer items-center rounded-lg bg-bg-inverse px-6 text-base font-medium text-text-on-accent disabled:opacity-60"
          >
            Cancel gift request
          </button>
        </div>
      </div>
    </div>
  )
}

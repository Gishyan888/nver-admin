import { useState } from 'react'
import { dismissOnBackdrop } from '../../lib/dismissOnBackdrop'
import type { GiftRequestStatus } from '../../lib/giftRequestStatus'
import {
  moveQuestionTitle,
  PICKUP_FIELD_MAX,
} from '../../lib/statusControl'

type MoveStatusDialogProps = {
  nextStatus: GiftRequestStatus
  /** Preparing → Ready for Pickup asks for address + note. */
  requirePickupFields?: boolean
  busy?: boolean
  onGoBack: () => void
  onMove: (input?: { address: string; note: string }) => void
}

export function MoveStatusDialog({
  nextStatus,
  requirePickupFields = false,
  busy = false,
  onGoBack,
  onMove,
}: MoveStatusDialogProps) {
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [addressError, setAddressError] = useState<string | null>(null)

  function handleMove() {
    if (requirePickupFields) {
      const trimmed = address.trim()
      if (!trimmed) {
        setAddressError('Enter the pickup address.')
        return
      }
      onMove({ address: trimmed, note: note.trim() })
      return
    }
    onMove()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={(event) => dismissOnBackdrop(event, onGoBack, busy)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="move-status-title"
        className="flex w-full max-w-[480px] flex-col gap-6 rounded-xl bg-bg-default p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <p
          id="move-status-title"
          className="w-full text-xl font-semibold leading-7 text-text-primary"
        >
          {moveQuestionTitle(nextStatus)}
        </p>

        {requirePickupFields ? (
          <div className="flex w-full flex-col gap-4">
            <label className="flex w-full flex-col gap-2">
              <span className="text-sm font-medium leading-5 text-text-primary">
                Pickup address
              </span>
              <textarea
                value={address}
                maxLength={PICKUP_FIELD_MAX}
                rows={3}
                disabled={busy}
                onChange={(event) => {
                  setAddress(event.target.value.slice(0, PICKUP_FIELD_MAX))
                  if (addressError) {
                    setAddressError(null)
                  }
                }}
                className={`min-h-24 w-full resize-none rounded-lg border bg-bg-default px-4 py-3 text-base leading-6 text-text-primary outline-none ${
                  addressError
                    ? 'border-danger-default'
                    : 'border-border-default'
                }`}
              />
              {addressError ? (
                <span className="text-xs leading-4 text-danger-default">
                  {addressError}
                </span>
              ) : null}
            </label>
            <label className="flex w-full flex-col gap-2">
              <span className="text-sm font-medium leading-5 text-text-primary">
                Note (optional)
              </span>
              <textarea
                value={note}
                maxLength={PICKUP_FIELD_MAX}
                rows={3}
                disabled={busy}
                placeholder="For example, opening hours"
                onChange={(event) =>
                  setNote(event.target.value.slice(0, PICKUP_FIELD_MAX))
                }
                className="min-h-24 w-full resize-none rounded-lg border border-border-default bg-bg-default px-4 py-3 text-base leading-6 text-text-primary outline-none placeholder:text-text-secondary"
              />
            </label>
          </div>
        ) : null}

        <div className="flex w-full items-start justify-end gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onGoBack}
            className="flex h-12 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary disabled:opacity-60"
          >
            Go back
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleMove}
            className="flex h-12 cursor-pointer items-center rounded-lg bg-bg-inverse px-6 text-base font-medium text-text-on-accent disabled:opacity-60"
          >
            Move
          </button>
        </div>
      </div>
    </div>
  )
}

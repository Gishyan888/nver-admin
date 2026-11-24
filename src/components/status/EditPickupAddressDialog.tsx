import { useState } from 'react'
import { PICKUP_FIELD_MAX } from '../../lib/statusControl'

type EditPickupAddressDialogProps = {
  initialAddress: string
  initialNote: string
  busy?: boolean
  onGoBack: () => void
  onSave: (input: { address: string; note: string }) => void
}

/**
 * "Save" with an empty address is not decided on the card — dialog stays open,
 * nothing is saved, no invented error text.
 */
export function EditPickupAddressDialog({
  initialAddress,
  initialNote,
  busy = false,
  onGoBack,
  onSave,
}: EditPickupAddressDialogProps) {
  const [address, setAddress] = useState(initialAddress)
  const [note, setNote] = useState(initialNote)

  function handleSave() {
    const trimmed = address.trim()
    if (!trimmed) {
      return
    }
    onSave({ address: trimmed, note: note.trim() })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-pickup-title"
        className="flex w-full max-w-[480px] flex-col gap-6 rounded-xl bg-bg-default p-6"
      >
        <p
          id="edit-pickup-title"
          className="w-full text-xl font-semibold leading-7 text-text-primary"
        >
          Edit the pickup address
        </p>

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
              onChange={(event) =>
                setAddress(event.target.value.slice(0, PICKUP_FIELD_MAX))
              }
              className="min-h-24 w-full resize-none rounded-lg border border-border-default bg-bg-default px-4 py-3 text-base leading-6 text-text-primary outline-none"
            />
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
            onClick={handleSave}
            className="flex h-12 cursor-pointer items-center rounded-lg bg-bg-inverse px-6 text-base font-medium text-text-on-accent disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import type { GiftRequestStatus } from '../../lib/giftRequestStatus'
import {
  canCancelGiftRequest,
  canEditPickupAddress,
  moveButtonLabel,
  nextManualStatus,
  showsPickupAddressContent,
  showsPickupAddressRow,
} from '../../lib/statusControl'
import { StandardContentState } from '../standard/StandardContentState'
import { CancelGiftRequestDialog } from './CancelGiftRequestDialog'
import { EditPickupAddressDialog } from './EditPickupAddressDialog'
import { MoveStatusDialog } from './MoveStatusDialog'
import { StatusLabel } from './StatusLabel'

type SectionOverlay = 'none' | 'loading' | 'error' | 'offline'

export type StatusSectionChange = {
  status: GiftRequestStatus
  pickupAddress: string | null
  pickupNote: string | null
}

type StatusSectionProps = {
  status: GiftRequestStatus
  pickupAddress?: string | null
  pickupNote?: string | null
  /**
   * Local UI updates until T-05-05 / T-05-06 Results.
   * Parent keeps status in sync (e.g. with the timeline).
   */
  onChange: (next: StatusSectionChange) => void
  overlay?: SectionOverlay
}

type DialogKind = 'move' | 'edit-pickup' | 'cancel' | null

export function StatusSection({
  status,
  pickupAddress = null,
  pickupNote = null,
  onChange,
  overlay = 'none',
}: StatusSectionProps) {
  const [dialog, setDialog] = useState<DialogKind>(null)
  const [busy, setBusy] = useState(false)

  const next = nextManualStatus(status)
  const showCancel = canCancelGiftRequest(status)
  const showPickupRow = showsPickupAddressRow(status, Boolean(pickupAddress))
  const showPickupContent = showsPickupAddressContent(status)
  const showEdit = canEditPickupAddress(status)

  if (overlay === 'loading') {
    return (
      <div className="w-full max-w-[360px] rounded-lg border border-border-default bg-bg-default p-6">
        <StandardContentState kind="loading" />
      </div>
    )
  }

  if (overlay === 'error' || overlay === 'offline') {
    return (
      <div className="flex min-h-48 w-full max-w-[360px] flex-col rounded-lg border border-border-default bg-bg-default">
        <StandardContentState kind={overlay === 'offline' ? 'offline' : 'error'} />
      </div>
    )
  }

  function applyChange(nextChange: StatusSectionChange) {
    setBusy(true)
    try {
      onChange(nextChange)
      setDialog(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className="flex w-full max-w-[360px] flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
        <h2 className="text-base font-semibold leading-6 text-text-primary">
          Status
        </h2>

        <StatusLabel status={status} />

        {status === 'In Progress' ? (
          <p className="w-full text-sm leading-5 text-text-secondary">
            Moves to Approved when the customer pays.
          </p>
        ) : null}

        {next || showCancel ? (
          <div className="flex w-full flex-col gap-2 overflow-hidden">
            {next ? (
              <button
                type="button"
                onClick={() => setDialog('move')}
                className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-bg-inverse px-6 text-base font-medium text-text-on-accent"
              >
                {moveButtonLabel(next)}
              </button>
            ) : null}
            {showCancel ? (
              <button
                type="button"
                onClick={() => setDialog('cancel')}
                className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary"
              >
                Cancel gift request
              </button>
            ) : null}
          </div>
        ) : null}

        {showPickupRow ? (
          <div className="flex w-full flex-col gap-1 overflow-hidden">
            <div className="flex w-full items-start justify-between">
              <p className="text-sm leading-5 text-text-secondary">
                Pickup address
              </p>
              {showEdit ? (
                <button
                  type="button"
                  onClick={() => setDialog('edit-pickup')}
                  className="cursor-pointer border-0 bg-transparent p-0 text-sm font-medium leading-5 text-accent-default"
                >
                  Edit
                </button>
              ) : null}
            </div>
            {showPickupContent && pickupAddress ? (
              <>
                <p className="w-full text-base leading-6 text-text-primary">
                  {pickupAddress}
                </p>
                {pickupNote ? (
                  <p className="w-full text-sm leading-5 text-text-secondary">
                    {pickupNote}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="w-full text-base leading-6 text-text-secondary">
                Not yet
              </p>
            )}
          </div>
        ) : null}
      </section>

      {dialog === 'move' && next ? (
        <MoveStatusDialog
          nextStatus={next}
          requirePickupFields={next === 'Ready for Pickup'}
          busy={busy}
          onGoBack={() => setDialog(null)}
          onMove={(input) => {
            applyChange({
              status: next,
              pickupAddress: input?.address ?? pickupAddress,
              pickupNote: input?.note ?? pickupNote,
            })
          }}
        />
      ) : null}

      {dialog === 'edit-pickup' ? (
        <EditPickupAddressDialog
          initialAddress={pickupAddress ?? ''}
          initialNote={pickupNote ?? ''}
          busy={busy}
          onGoBack={() => setDialog(null)}
          onSave={(input) => {
            applyChange({
              status,
              pickupAddress: input.address,
              pickupNote: input.note || null,
            })
          }}
        />
      ) : null}

      {dialog === 'cancel' ? (
        <CancelGiftRequestDialog
          busy={busy}
          onKeepIt={() => setDialog(null)}
          onCancelGiftRequest={() => {
            applyChange({
              status: 'Canceled',
              pickupAddress,
              pickupNote,
            })
          }}
        />
      ) : null}
    </>
  )
}

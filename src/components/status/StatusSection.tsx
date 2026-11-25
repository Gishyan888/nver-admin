import { useCallback, useEffect, useRef, useState } from 'react'
import {
  cancelAdminGiftRequest,
  getAdminGiftRequestStatus,
  patchAdminPickup,
  postAdminGiftRequestStatus,
  type AdminGiftRequestStatusResponse,
} from '../../api/giftRequestStatus'
import { ApiError, NetworkError } from '../../api/types'
import {
  giftRequestStatusFromApi,
  giftRequestStatusToApi,
  type GiftRequestStatus,
} from '../../lib/giftRequestStatus'
import {
  canCancelGiftRequest,
  canEditPickupAddress,
  moveButtonLabel,
  nextManualStatus,
  showsPickupAddressContent,
  showsPickupAddressRow,
} from '../../lib/statusControl'
import { timelineReachedAtFromApi } from '../timeline/timelineFromApi'
import type { TimelineReachedAt } from '../timeline/types'
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
  reachedAt?: TimelineReachedAt
}

type StatusSectionProps = {
  giftRequestId: string
  status: GiftRequestStatus
  pickupAddress?: string | null
  pickupNote?: string | null
  onChange: (next: StatusSectionChange) => void
  /** Skip the status API (frame / timeline demos). */
  fixturesOnly?: boolean
}

type DialogKind = 'move' | 'edit-pickup' | 'cancel' | null

function changeFromStatusResponse(
  result: AdminGiftRequestStatusResponse,
): StatusSectionChange | null {
  const status = giftRequestStatusFromApi(result.status)
  if (!status) {
    return null
  }
  return {
    status,
    pickupAddress: result.pickup?.address ?? null,
    pickupNote: result.pickup?.note ?? null,
    reachedAt: timelineReachedAtFromApi(result.timeline),
  }
}

export function StatusSection({
  giftRequestId,
  status,
  pickupAddress = null,
  pickupNote = null,
  onChange,
  fixturesOnly = false,
}: StatusSectionProps) {
  const [dialog, setDialog] = useState<DialogKind>(null)
  const [busy, setBusy] = useState(false)
  const [overlay, setOverlay] = useState<SectionOverlay>(
    fixturesOnly ? 'none' : 'loading',
  )
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const next = nextManualStatus(status)
  const showCancel = canCancelGiftRequest(status)
  const showPickupRow = showsPickupAddressRow(status, Boolean(pickupAddress))
  const showPickupContent = showsPickupAddressContent(status)
  const showEdit = canEditPickupAddress(status)

  const load = useCallback(async () => {
    if (fixturesOnly) {
      setOverlay('none')
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setOverlay('loading')
    try {
      const result = await getAdminGiftRequestStatus(giftRequestId)
      const change = changeFromStatusResponse(result)
      if (!change) {
        setOverlay('error')
        return
      }
      onChangeRef.current(change)
      setOverlay('none')
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      setOverlay('error')
    }
  }, [fixturesOnly, giftRequestId])

  useEffect(() => {
    void load()
  }, [load])

  function applyLocalChange(nextChange: StatusSectionChange) {
    onChange(nextChange)
    setDialog(null)
  }

  async function handleMove(input?: { address: string; note: string }) {
    if (!next) {
      return
    }
    if (fixturesOnly) {
      applyLocalChange({
        status: next,
        pickupAddress: input?.address ?? pickupAddress,
        pickupNote: input?.note ?? pickupNote,
      })
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setBusy(true)
    try {
      const body: {
        status: string
        pickupAddress?: string
        pickupNote?: string | null
      } = {
        status: giftRequestStatusToApi(next),
      }
      if (next === 'Ready for Pickup') {
        body.pickupAddress = input?.address ?? ''
        body.pickupNote = input?.note?.trim() ? input.note.trim() : null
      }
      const result = await postAdminGiftRequestStatus(giftRequestId, body)
      const change = changeFromStatusResponse(result)
      if (!change) {
        setOverlay('error')
        return
      }
      onChange(change)
      setDialog(null)
      setOverlay('none')
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      if (error instanceof ApiError) {
        setOverlay('error')
        return
      }
      setOverlay('error')
    } finally {
      setBusy(false)
    }
  }

  async function handleSavePickup(input: { address: string; note: string }) {
    if (fixturesOnly) {
      applyLocalChange({
        status,
        pickupAddress: input.address,
        pickupNote: input.note || null,
      })
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setBusy(true)
    try {
      const result = await patchAdminPickup(giftRequestId, {
        pickupAddress: input.address,
        pickupNote: input.note.trim() ? input.note.trim() : null,
      })
      const change = changeFromStatusResponse(result)
      if (!change) {
        setOverlay('error')
        return
      }
      onChange(change)
      setDialog(null)
      setOverlay('none')
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      setOverlay('error')
    } finally {
      setBusy(false)
    }
  }

  async function handleCancel() {
    if (fixturesOnly) {
      applyLocalChange({
        status: 'Canceled',
        pickupAddress,
        pickupNote,
      })
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setBusy(true)
    try {
      const result = await cancelAdminGiftRequest(giftRequestId)
      onChange({
        status: 'Canceled',
        pickupAddress,
        pickupNote,
        reachedAt: { Canceled: result.canceledAt },
      })
      setDialog(null)
      setOverlay('none')
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      setOverlay('error')
    } finally {
      setBusy(false)
    }
  }

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
            void handleMove(input)
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
            void handleSavePickup(input)
          }}
        />
      ) : null}

      {dialog === 'cancel' ? (
        <CancelGiftRequestDialog
          busy={busy}
          onKeepIt={() => setDialog(null)}
          onCancelGiftRequest={() => {
            void handleCancel()
          }}
        />
      ) : null}
    </>
  )
}

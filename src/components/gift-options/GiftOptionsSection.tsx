import { useCallback, useEffect, useState } from 'react'
import {
  createGiftOption,
  deleteGiftOption,
  listGiftOptions,
  updateGiftOption,
  type GiftOption,
} from '../../api/giftOptions'
import { ApiError, NetworkError } from '../../api/types'
import { formatPriceUsd } from '../../lib/formatPrice'
import {
  canManageGiftOptions,
  isGiftOptionsReadOnlyPaid,
  type GiftRequestStatus,
} from '../../lib/giftRequestStatus'
import { StandardContentState } from '../standard/StandardContentState'
import { AuthenticatedImage } from './AuthenticatedImage'
import { DeleteGiftOptionDialog } from './DeleteGiftOptionDialog'
import { GiftOptionDialog } from './GiftOptionDialog'

type SectionOverlay = 'none' | 'loading' | 'error' | 'offline'

type GiftOptionsSectionProps = {
  giftRequestId: string
  status: GiftRequestStatus
}

export function GiftOptionsSection({
  giftRequestId,
  status,
}: GiftOptionsSectionProps) {
  const [items, setItems] = useState<GiftOption[]>([])
  const [overlay, setOverlay] = useState<SectionOverlay>('loading')
  const [dialog, setDialog] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<GiftOption | null>(null)
  const [deleting, setDeleting] = useState<GiftOption | null>(null)
  const [busy, setBusy] = useState(false)

  const editable = canManageGiftOptions(status)
  const paidReadOnly = isGiftOptionsReadOnlyPaid(status)
  const showCount = editable
  const showAdd = editable && items.length < 3

  const load = useCallback(async () => {
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setOverlay('loading')
    try {
      const result = await listGiftOptions(giftRequestId)
      setItems(result.items)
      setOverlay('none')
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      setOverlay('error')
    }
  }, [giftRequestId])

  useEffect(() => {
    void load()
  }, [load])

  async function handleSave(input: {
    title: string
    description: string
    priceUsd: number
    image: File | null
  }) {
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setBusy(true)
    try {
      if (dialog === 'create') {
        if (!input.image) {
          return
        }
        await createGiftOption(
          giftRequestId,
          {
            title: input.title,
            description: input.description,
            priceUsd: input.priceUsd,
          },
          input.image,
        )
      } else if (dialog === 'edit' && editing) {
        const data: {
          title?: string
          description?: string
          priceUsd?: number
        } = {}
        if (input.title !== editing.title) {
          data.title = input.title
        }
        if (input.description !== editing.description) {
          data.description = input.description
        }
        if (input.priceUsd !== editing.priceUsd) {
          data.priceUsd = input.priceUsd
        }
        if (!input.image && Object.keys(data).length === 0) {
          // Not decided what Save does when nothing changed — close without a call.
          setDialog(null)
          setEditing(null)
          return
        }
        await updateGiftOption(
          giftRequestId,
          editing.id,
          data,
          input.image,
        )
      }
      setDialog(null)
      setEditing(null)
      await load()
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

  async function handleDelete() {
    if (!deleting) {
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setBusy(true)
    try {
      await deleteGiftOption(giftRequestId, deleting.id)
      setDeleting(null)
      await load()
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
      <div className="w-full max-w-[752px] rounded-lg border border-border-default bg-bg-default p-6">
        <StandardContentState kind="loading" />
      </div>
    )
  }

  if (overlay === 'error' || overlay === 'offline') {
    return (
      <div className="flex min-h-48 w-full max-w-[752px] flex-col rounded-lg border border-border-default bg-bg-default">
        <StandardContentState kind={overlay === 'offline' ? 'offline' : 'error'} />
      </div>
    )
  }

  return (
    <>
      <section className="flex w-full max-w-[752px] flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold leading-6 text-text-primary">
            Gift options
          </h2>
          {showCount ? (
            <p className="text-sm leading-5 text-text-secondary">
              {`${items.length} of 3`}
            </p>
          ) : null}
        </div>

        {items.length === 0 ? (
          <p className="text-sm leading-5 text-text-secondary">
            No gift options yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((option) => {
              const selected = paidReadOnly && option.selected
              return (
                <article
                  key={option.id}
                  className={`flex gap-4 rounded-lg border bg-bg-default p-4 ${
                    selected
                      ? 'border-text-primary'
                      : 'border-border-default'
                  }`}
                >
                  <AuthenticatedImage
                    imageUrl={option.image.url}
                    alt=""
                    className="size-[120px] shrink-0 rounded-lg object-cover bg-bg-muted"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <p className="truncate text-base font-semibold leading-6 text-text-primary">
                          {option.title}
                        </p>
                        {selected ? (
                          <span className="rounded-full bg-success-subtle px-2 py-1 text-xs font-medium leading-4 text-text-primary">
                            Selected
                          </span>
                        ) : null}
                      </div>
                      {editable ? (
                        <div className="flex shrink-0 gap-4 text-sm font-medium leading-5">
                          <button
                            type="button"
                            className="cursor-pointer border-0 bg-transparent p-0 text-accent-default"
                            onClick={() => {
                              setEditing(option)
                              setDialog('edit')
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="cursor-pointer border-0 bg-transparent p-0 text-text-secondary"
                            onClick={() => setDeleting(option)}
                          >
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <p className="text-base font-medium leading-6 text-text-primary">
                      {formatPriceUsd(option.priceUsd)}
                    </p>
                    <p className="text-sm leading-5 text-text-secondary">
                      {option.description}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {showAdd ? (
          <button
            type="button"
            onClick={() => {
              setEditing(null)
              setDialog('create')
            }}
            className="flex h-12 w-fit cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary"
          >
            Add gift option
          </button>
        ) : null}
      </section>

      {dialog ? (
        <GiftOptionDialog
          key={`${dialog}-${editing?.id ?? 'new'}`}
          mode={dialog}
          initial={dialog === 'edit' ? editing : null}
          busy={busy}
          onGoBack={() => {
            setDialog(null)
            setEditing(null)
          }}
          onSave={handleSave}
        />
      ) : null}

      {deleting ? (
        <DeleteGiftOptionDialog
          busy={busy}
          onGoBack={() => setDeleting(null)}
          onDelete={() => {
            void handleDelete()
          }}
        />
      ) : null}
    </>
  )
}

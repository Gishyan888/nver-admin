import { useRef, useState, type FormEvent } from 'react'
import type { GiftOption } from '../../api/giftOptions'
import { dismissOnBackdrop } from '../../lib/dismissOnBackdrop'
import { formatCounter } from '../../lib/formatPrice'
import { AuthenticatedImage } from './AuthenticatedImage'

const TITLE_MAX = 100
const DESCRIPTION_MAX = 1000
const IMAGE_ACCEPT = 'image/jpeg,image/png,image/heic,image/webp,.heic,.heif,.webp'

const IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp',
])

type FieldErrors = {
  image?: string
  title?: string
  description?: string
  price?: string
}

type GiftOptionDialogProps = {
  mode: 'create' | 'edit'
  initial?: GiftOption | null
  busy?: boolean
  onGoBack: () => void
  onSave: (input: {
    title: string
    description: string
    priceUsd: number
    image: File | null
  }) => Promise<void> | void
}

function isAllowedImage(file: File): boolean {
  if (IMAGE_TYPES.has(file.type)) {
    return true
  }
  const name = file.name.toLowerCase()
  return (
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.png') ||
    name.endsWith('.heic') ||
    name.endsWith('.heif') ||
    name.endsWith('.webp')
  )
}

export function GiftOptionDialog({
  mode,
  initial,
  busy = false,
  onGoBack,
  onSave,
}: GiftOptionDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [priceText, setPriceText] = useState(
    initial ? String(initial.priceUsd) : '',
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})

  const heading = mode === 'create' ? 'New gift option' : 'Edit gift option'
  const imageActionLabel =
    mode === 'create' ? 'Choose an image' : 'Replace image'

  function pickImage(file: File | null) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    if (!file) {
      setImageFile(null)
      setPreviewUrl(null)
      return
    }
    if (!isAllowedImage(file)) {
      setErrors((current) => ({ ...current, image: 'Add an image.' }))
      return
    }
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setErrors((current) => ({ ...current, image: undefined }))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const next: FieldErrors = {}

    if (mode === 'create' && !imageFile) {
      next.image = 'Add an image.'
    }
    if (title.trim().length === 0) {
      next.title = 'Enter a title.'
    }
    if (description.trim().length === 0) {
      next.description = 'Enter a description.'
    }

    const priceTrimmed = priceText.trim()
    if (priceTrimmed.length === 0) {
      next.price = 'Enter a price.'
    } else if (!/^[1-9]\d*$/.test(priceTrimmed)) {
      next.price = 'Enter a whole number of dollars above 0.'
    }

    setErrors(next)
    if (Object.keys(next).length > 0) {
      return
    }

    await onSave({
      title: title.slice(0, TITLE_MAX),
      description: description.slice(0, DESCRIPTION_MAX),
      priceUsd: Number(priceTrimmed),
      image: imageFile,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 py-10"
      onClick={(event) => dismissOnBackdrop(event, onGoBack, busy)}
    >
      <form
        noValidate
        onSubmit={(event) => {
          void onSubmit(event)
        }}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[min(900px,calc(100vh-4rem))] w-full max-w-[560px] flex-col overflow-auto rounded-xl bg-bg-default p-6"
      >
        <h2 className="text-xl font-semibold leading-7 text-text-primary">
          {heading}
        </h2>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium leading-5 text-text-primary">
              Image
            </span>
            <button
              type="button"
              disabled={busy}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed bg-bg-default ${
                errors.image ? 'border-danger-default' : 'border-border-default'
              }`}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              ) : mode === 'edit' && initial ? (
                <AuthenticatedImage
                  imageUrl={initial.image.url}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              ) : null}
              <span className="relative z-10 text-sm font-medium text-accent-default">
                {imageActionLabel}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              className="hidden"
              onChange={(event) => {
                pickImage(event.target.files?.[0] ?? null)
                event.target.value = ''
              }}
            />
            {errors.image ? (
              <p className="text-xs leading-4 text-danger-default">
                {errors.image}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="gift-option-title"
              className="text-sm font-medium leading-5 text-text-primary"
            >
              Title
            </label>
            <input
              id="gift-option-title"
              maxLength={TITLE_MAX}
              value={title}
              disabled={busy}
              onChange={(event) => {
                setTitle(event.target.value.slice(0, TITLE_MAX))
                if (errors.title) {
                  setErrors((current) => ({ ...current, title: undefined }))
                }
              }}
              className={`h-12 w-full rounded-lg border px-4 text-base leading-6 text-text-primary outline-none ${
                errors.title ? 'border-danger-default' : 'border-border-default'
              }`}
            />
            <div className="flex items-start justify-between gap-2">
              {errors.title ? (
                <p className="text-xs leading-4 text-danger-default">
                  {errors.title}
                </p>
              ) : (
                <span />
              )}
              <p className="shrink-0 text-right text-xs leading-4 text-text-secondary">
                {formatCounter(title.length, TITLE_MAX)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="gift-option-description"
              className="text-sm font-medium leading-5 text-text-primary"
            >
              Description
            </label>
            <textarea
              id="gift-option-description"
              maxLength={DESCRIPTION_MAX}
              value={description}
              disabled={busy}
              rows={5}
              onChange={(event) => {
                setDescription(event.target.value.slice(0, DESCRIPTION_MAX))
                if (errors.description) {
                  setErrors((current) => ({
                    ...current,
                    description: undefined,
                  }))
                }
              }}
              className={`w-full resize-none rounded-lg border px-4 py-3 text-base leading-6 text-text-primary outline-none ${
                errors.description
                  ? 'border-danger-default'
                  : 'border-border-default'
              }`}
            />
            <div className="flex items-start justify-between gap-2">
              {errors.description ? (
                <p className="text-xs leading-4 text-danger-default">
                  {errors.description}
                </p>
              ) : (
                <span />
              )}
              <p className="shrink-0 text-right text-xs leading-4 text-text-secondary">
                {formatCounter(description.length, DESCRIPTION_MAX)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="gift-option-price"
              className="text-sm font-medium leading-5 text-text-primary"
            >
              Price
            </label>
            <div
              className={`flex h-12 w-[200px] items-center rounded-lg border px-4 ${
                errors.price ? 'border-danger-default' : 'border-border-default'
              }`}
            >
              <span className="text-base leading-6 text-text-primary">$</span>
              <input
                id="gift-option-price"
                inputMode="numeric"
                value={priceText}
                disabled={busy}
                onChange={(event) => {
                  setPriceText(event.target.value.replace(/[^\d.]/g, ''))
                  if (errors.price) {
                    setErrors((current) => ({ ...current, price: undefined }))
                  }
                }}
                className="ml-1 w-full border-0 bg-transparent text-base leading-6 text-text-primary outline-none"
              />
            </div>
            {errors.price ? (
              <p className="text-xs leading-4 text-danger-default">
                {errors.price}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onGoBack}
            className="flex h-12 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary disabled:opacity-60"
          >
            Go back
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex h-12 cursor-pointer items-center rounded-lg bg-bg-inverse px-6 text-base font-medium text-text-on-accent disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

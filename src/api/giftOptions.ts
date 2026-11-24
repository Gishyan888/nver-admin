import { apiBlob, apiRequest, apiUrl } from './client'

export type GiftOptionImage = {
  id: string
  contentType: string
  sizeBytes: number
  url: string
}

export type GiftOption = {
  id: string
  title: string
  description: string
  priceUsd: number
  image: GiftOptionImage
  selected: boolean
  createdAt: string
  updatedAt: string
}

export type GiftOptionListResponse = {
  items: GiftOption[]
}

export type GiftOptionPayload = {
  title: string
  description: string
  priceUsd: number
}

function basePath(giftRequestId: string) {
  return `/api/v1/admin/gift-requests/${giftRequestId}/gift-options`
}

export async function listGiftOptions(giftRequestId: string) {
  return apiRequest<GiftOptionListResponse>(basePath(giftRequestId))
}

export async function createGiftOption(
  giftRequestId: string,
  data: GiftOptionPayload,
  image: File,
) {
  const formData = new FormData()
  formData.append('data', JSON.stringify(data))
  formData.append('image', image)
  return apiRequest<GiftOption>(basePath(giftRequestId), {
    method: 'POST',
    formData,
  })
}

export async function updateGiftOption(
  giftRequestId: string,
  giftOptionId: string,
  data: Partial<GiftOptionPayload>,
  image?: File | null,
) {
  const path = `${basePath(giftRequestId)}/${giftOptionId}`
  if (image) {
    const formData = new FormData()
    if (Object.keys(data).length > 0) {
      formData.append('data', JSON.stringify(data))
    }
    formData.append('image', image)
    return apiRequest<GiftOption>(path, { method: 'PATCH', formData })
  }
  return apiRequest<GiftOption>(path, { method: 'PATCH', body: data })
}

export async function deleteGiftOption(
  giftRequestId: string,
  giftOptionId: string,
) {
  return apiRequest<void>(`${basePath(giftRequestId)}/${giftOptionId}`, {
    method: 'DELETE',
  })
}

/** Absolute or same-origin path for an image url from the API. */
export function giftOptionImagePath(imageUrl: string) {
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  return apiUrl(imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`)
}

export async function fetchGiftOptionImageBlob(imageUrl: string) {
  const path =
    imageUrl.startsWith('http://') || imageUrl.startsWith('https://')
      ? new URL(imageUrl).pathname
      : imageUrl.startsWith('/')
        ? imageUrl
        : `/${imageUrl}`
  return apiBlob(path)
}

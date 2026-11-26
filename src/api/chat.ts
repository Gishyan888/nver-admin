import { apiBlob, apiRequest } from './client'
import type { GiftOption } from './giftOptions'

export type ApiChatMessageKind = 'text' | 'photo' | 'gift_option' | string

export type ApiChatMessageFrom = 'customer' | 'concierge' | string

export type ApiChatPhoto = {
  contentType: string
  sizeBytes: number
  url: string
}

export type ApiChatMessage = {
  id: string
  kind: ApiChatMessageKind
  from: ApiChatMessageFrom
  text: string | null
  photo: ApiChatPhoto | null
  giftOption: GiftOption | null
  sentAt: string
  adminEmail?: string | null
}

export type AdminChatMessagesResponse = {
  canSend: boolean
  items: ApiChatMessage[]
}

export type AdminChatUnreadResponse = {
  unread: boolean
}

function messagesPath(giftRequestId: string) {
  return `/api/v1/admin/gift-requests/${giftRequestId}/chat/messages`
}

export async function listAdminChatMessages(giftRequestId: string) {
  return apiRequest<AdminChatMessagesResponse>(messagesPath(giftRequestId))
}

export async function sendAdminChatText(
  giftRequestId: string,
  text: string,
) {
  return apiRequest<ApiChatMessage>(messagesPath(giftRequestId), {
    method: 'POST',
    body: { text },
  })
}

export async function sendAdminChatPhoto(
  giftRequestId: string,
  photo: File,
) {
  const formData = new FormData()
  formData.append('photo', photo)
  return apiRequest<ApiChatMessage>(messagesPath(giftRequestId), {
    method: 'POST',
    formData,
  })
}

export async function shareAdminChatGiftOption(
  giftRequestId: string,
  giftOptionId: string,
) {
  return apiRequest<ApiChatMessage>(messagesPath(giftRequestId), {
    method: 'POST',
    body: { giftOptionId },
  })
}

export async function markAdminChatRead(giftRequestId: string) {
  return apiRequest<void>(
    `/api/v1/admin/gift-requests/${giftRequestId}/chat/read`,
    { method: 'POST' },
  )
}

export async function getAdminChatUnread(giftRequestId: string) {
  return apiRequest<AdminChatUnreadResponse>(
    `/api/v1/admin/gift-requests/${giftRequestId}/chat/unread`,
  )
}

export async function fetchAdminChatPhotoBlob(photoUrl: string) {
  const path =
    photoUrl.startsWith('http://') || photoUrl.startsWith('https://')
      ? new URL(photoUrl).pathname
      : photoUrl.startsWith('/')
        ? photoUrl
        : `/${photoUrl}`
  return apiBlob(path)
}

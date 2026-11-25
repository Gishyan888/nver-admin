import { apiRequest } from './client'

/** Snake_case status values from T-05-05. */
export type ApiGiftRequestStatus =
  | 'registered'
  | 'in_progress'
  | 'approved'
  | 'preparing'
  | 'ready_for_pickup'
  | 'completed'
  | 'canceled'

export type ApiTimelineEntry = {
  status: ApiGiftRequestStatus | string
  reachedAt: string
}

export type ApiPickup = {
  address: string
  note: string | null
}

export type AdminGiftRequestStatusResponse = {
  status: ApiGiftRequestStatus | string
  nextMove: ApiGiftRequestStatus | string | null
  pickup: ApiPickup | null
  timeline: ApiTimelineEntry[]
}

function statusPath(giftRequestId: string) {
  return `/api/v1/admin/gift-requests/${giftRequestId}/status`
}

export async function getAdminGiftRequestStatus(giftRequestId: string) {
  return apiRequest<AdminGiftRequestStatusResponse>(statusPath(giftRequestId))
}

export type PostAdminStatusBody = {
  status: ApiGiftRequestStatus | string
  pickupAddress?: string
  pickupNote?: string | null
}

export async function postAdminGiftRequestStatus(
  giftRequestId: string,
  body: PostAdminStatusBody,
) {
  return apiRequest<AdminGiftRequestStatusResponse>(statusPath(giftRequestId), {
    method: 'POST',
    body,
  })
}

export type PatchAdminPickupBody = {
  pickupAddress?: string
  pickupNote?: string | null
}

export async function patchAdminPickup(
  giftRequestId: string,
  body: PatchAdminPickupBody,
) {
  return apiRequest<AdminGiftRequestStatusResponse>(
    `/api/v1/admin/gift-requests/${giftRequestId}/pickup`,
    { method: 'PATCH', body },
  )
}

export type AdminCancelGiftRequestResponse = {
  id: string
  status: 'canceled' | string
  canceledAt: string
  payment: unknown
}

export async function cancelAdminGiftRequest(giftRequestId: string) {
  return apiRequest<AdminCancelGiftRequestResponse>(
    `/api/v1/admin/gift-requests/${giftRequestId}/cancel`,
    { method: 'POST' },
  )
}

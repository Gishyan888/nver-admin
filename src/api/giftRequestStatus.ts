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

export async function getAdminGiftRequestStatus(giftRequestId: string) {
  return apiRequest<AdminGiftRequestStatusResponse>(
    `/api/v1/admin/gift-requests/${giftRequestId}/status`,
  )
}

import { apiRequest } from './client'

export type ApiAdminGiftRequestListItem = {
  id: string
  orderId: string
  customerName: string
  status: string
  createdAt: string
  hasUnreadMessage: boolean
}

export type ApiAdminInspirationPhoto = {
  id: string
  contentType: string
  sizeBytes: number
  url: string
}

export type ApiAdminPaymentRefund = {
  status: 'pending' | 'succeeded' | 'failed' | string
  refundedAt: string | null
}

export type ApiAdminPayment = {
  amountUsd: number
  paidAt: string
  refund: ApiAdminPaymentRefund | null
}

export type ApiAdminPickup = {
  address: string
  note: string | null
}

export type ApiAdminGiftRequestReview = {
  id: string
  stars: number
  text: string | null
  state: string
  createdAt: string
  decidedAt: string | null
}

export type ApiAdminGiftRequestDetails = {
  id: string
  orderId: string
  status: string
  customerId: string
  customerName: string
  createdAt: string
  occasion: string
  occasionOther: string | null
  occasionDate: string
  recipientRelation: string
  recipientRelationOther: string | null
  recipientAge: number | string
  recipientGender: string | null
  likes: string | null
  hobbies: string | null
  avoid: string | null
  inspirationText: string | null
  inspirationLinks: string[]
  photos: ApiAdminInspirationPhoto[]
  tier: string
  payment: ApiAdminPayment | null
  pickup: ApiAdminPickup | null
  review: ApiAdminGiftRequestReview | null
  hasUnreadMessage: boolean
  consultationRequestedAt: string | null
}

export type AdminGiftRequestsListResponse = {
  items: ApiAdminGiftRequestListItem[]
  page: number
  pageSize: number
  total: number
}

export type ListAdminGiftRequestsParams = {
  page?: number
  search?: string
  from?: string | null
  to?: string | null
  timeZone?: string
}

export async function listAdminGiftRequests(
  params: ListAdminGiftRequestsParams = {},
) {
  const query = new URLSearchParams()
  query.set('page', String(params.page ?? 1))
  const search = params.search?.trim()
  if (search) {
    query.set('search', search.slice(0, 100))
  }
  if (params.from) {
    query.set('from', params.from)
  }
  if (params.to) {
    query.set('to', params.to)
  }
  const timeZone =
    params.timeZone ??
    Intl.DateTimeFormat().resolvedOptions().timeZone
  if (timeZone) {
    query.set('timeZone', timeZone)
  }
  return apiRequest<AdminGiftRequestsListResponse>(
    `/api/v1/admin/gift-requests?${query.toString()}`,
  )
}

export async function getAdminGiftRequest(giftRequestId: string) {
  return apiRequest<ApiAdminGiftRequestDetails>(
    `/api/v1/admin/gift-requests/${giftRequestId}`,
  )
}

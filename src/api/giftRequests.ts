import { apiRequest } from './client'

export type ApiAdminGiftRequestListItem = {
  id: string
  orderId: string
  customerName: string
  status: string
  createdAt: string
  hasUnreadMessage: boolean
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

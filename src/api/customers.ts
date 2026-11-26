import { apiRequest } from './client'

export type ApiAdminCustomerListItem = {
  id: string
  fullName: string
  email: string
  registeredAt: string
  giftRequestCount: number
}

export type AdminCustomersListResponse = {
  items: ApiAdminCustomerListItem[]
  page: number
  pageSize: number
  total: number
}

export type ApiAdminCustomerGiftRequest = {
  id: string
  orderId: string
  status: string
  createdAt: string
  hasUnreadMessage: boolean
}

export type ApiAdminCustomerDetails = {
  id: string
  fullName: string
  email: string
  giftRequests: ApiAdminCustomerGiftRequest[]
}

export async function listAdminCustomers(page = 1) {
  const query = new URLSearchParams({ page: String(page) })
  return apiRequest<AdminCustomersListResponse>(
    `/api/v1/admin/customers?${query.toString()}`,
  )
}

export async function getAdminCustomer(customerId: string) {
  return apiRequest<ApiAdminCustomerDetails>(
    `/api/v1/admin/customers/${customerId}`,
  )
}

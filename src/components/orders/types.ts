import type { GiftRequestStatus } from '../../lib/giftRequestStatus'

export type OrderListItem = {
  id: string
  orderId: string
  giftRequestId: string
  customerName: string
  status: GiftRequestStatus
  /** ISO date-time the gift request was created (UTC from API). */
  createdAt: string
  hasUnreadCustomerMessage: boolean
}

export const ORDERS_PAGE_SIZE = 20
export const ORDERS_SEARCH_MAX = 100

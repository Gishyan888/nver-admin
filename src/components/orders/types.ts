import type { GiftRequestStatus } from '../../lib/giftRequestStatus'

/** UI model until T-10-06 Result. */
export type OrderListItem = {
  id: string
  orderId: string
  giftRequestId: string
  customerName: string
  status: GiftRequestStatus
  /** ISO calendar day the gift request was created, e.g. 2026-11-24T12:00:00.000Z */
  createdAt: string
  hasUnreadCustomerMessage: boolean
}

export const ORDERS_PAGE_SIZE = 20

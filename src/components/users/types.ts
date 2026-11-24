import type { GiftRequestStatus } from '../../lib/giftRequestStatus'

/** UI model until T-10-09 Result. */
export type UserListItem = {
  id: string
  name: string
  email: string
  /** ISO day the customer registered, e.g. 2026-11-24T12:00:00.000Z */
  registeredAt: string
  giftRequestCount: number
}

/** One gift request on a customer page (no customer-name column). */
export type CustomerOrderItem = {
  id: string
  orderId: string
  giftRequestId: string
  status: GiftRequestStatus
  createdAt: string
  hasUnreadCustomerMessage: boolean
}

export type CustomerDemo = {
  id: string
  name: string
  email: string
  orders: CustomerOrderItem[]
}

export const USERS_PAGE_SIZE = 20

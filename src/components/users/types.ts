import type { GiftRequestStatus } from '../../lib/giftRequestStatus'

export type UserListItem = {
  id: string
  name: string
  email: string
  /** ISO date-time the customer registered (UTC from API). */
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

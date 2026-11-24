import type { GiftRequestStatus } from '../../lib/giftRequestStatus'
import type { OrderListItem } from './types'

const NAMES = [
  'Anna Petrosyan',
  'Mark Johnson',
  'Sofia Martirosyan',
  'Lilit Sargsyan',
  'Hasmik Sargsyan',
  'James Miller',
  'Nare Abrahamyan',
  'David Brown',
  'Emma Wilson',
  'Samvel Aslanyan',
  'Maria Garcia',
  'Hayk Grigoryan',
]

const STATUSES: GiftRequestStatus[] = [
  'Registered',
  'In Progress',
  'Approved',
  'Preparing',
  'Ready for Pickup',
  'Completed',
  'Canceled',
]

/** 45 fixtures — three pages for QA (20 + 20 + 5). Newest first by order number. */
export function buildDemoOrders(): OrderListItem[] {
  const items: OrderListItem[] = []
  for (let i = 0; i < 45; i += 1) {
    const orderNum = 10120 - i
    const day = 24 - (i % 20)
    const monthDay = Math.max(1, day)
    items.push({
      id: `demo-order-${orderNum}`,
      orderId: `NV-${orderNum}`,
      giftRequestId: `demo-gr-${orderNum}`,
      customerName: NAMES[i % NAMES.length],
      status: STATUSES[i % STATUSES.length],
      createdAt: `2026-11-${String(monthDay).padStart(2, '0')}T12:00:00.000Z`,
      hasUnreadCustomerMessage: i === 2 || i === 6,
    })
  }
  return items
}

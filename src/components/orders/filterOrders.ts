import type { OrderListItem } from './types'

function dayStamp(iso: string): string {
  const date = new Date(iso)
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Client-side filter matching what T-10-06 will do: search + date range together.
 * Dates compared as calendar days (UTC of fixture ISO until API decides TZ).
 */
export function filterOrders(
  orders: OrderListItem[],
  search: string,
  fromDay: string | null,
  toDay: string | null,
): OrderListItem[] {
  const q = search.trim().toLowerCase()
  return orders
    .filter((order) => {
      if (q) {
        const nameHit = order.customerName.toLowerCase().includes(q)
        const idHit = order.orderId.toLowerCase().includes(q)
        if (!nameHit && !idHit) {
          return false
        }
      }
      const created = dayStamp(order.createdAt)
      if (fromDay && created < fromDay) {
        return false
      }
      if (toDay && created > toDay) {
        return false
      }
      return true
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/** Local calendar day → YYYY-MM-DD for range compare. */
export function localDayKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

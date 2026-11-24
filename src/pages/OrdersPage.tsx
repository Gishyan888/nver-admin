import { useSearchParams } from 'react-router-dom'
import { buildDemoOrders } from '../components/orders/ordersDemo'
import { OrdersListContent } from '../components/orders/OrdersListContent'
import { AdminShell } from '../components/standard/AdminShell'
import type { StandardContentKind } from '../components/standard/StandardContentState'

function parseOverlay(
  value: string | null,
): StandardContentKind | 'none' {
  if (value === 'loading' || value === 'error' || value === 'offline') {
    return value
  }
  return 'none'
}

/**
 * Admin Orders list (T-10-11) — demo fixtures until T-10-06 Result.
 * Empty: /?empty=1 · Standard states: /?state=loading|error|offline
 */
export function OrdersPage() {
  const [params] = useSearchParams()
  const empty = params.get('empty') === '1'
  const overlay = parseOverlay(params.get('state'))
  const orders = empty ? [] : buildDemoOrders()

  return (
    <AdminShell title="Orders" currentNav="Orders">
      <OrdersListContent
        orders={orders}
        overlay={overlay === 'none' ? 'none' : overlay}
      />
    </AdminShell>
  )
}

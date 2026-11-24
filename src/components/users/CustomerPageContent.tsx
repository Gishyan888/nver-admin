import { useNavigate } from 'react-router-dom'
import { formatReviewSentDay } from '../../lib/formatDateTime'
import { StatusLabel } from '../status/StatusLabel'
import { StandardContentState } from '../standard/StandardContentState'
import type { CustomerOrderItem } from './types'

type PageOverlay = 'none' | 'loading' | 'error' | 'offline'

type CustomerPageContentProps = {
  orders: CustomerOrderItem[]
  overlay?: PageOverlay
}

export function CustomerPageContent({
  orders,
  overlay = 'none',
}: CustomerPageContentProps) {
  const navigate = useNavigate()

  if (overlay === 'loading') {
    return <StandardContentState kind="loading" />
  }
  if (overlay === 'error' || overlay === 'offline') {
    return (
      <StandardContentState kind={overlay === 'offline' ? 'offline' : 'error'} />
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-1 p-8">
        <p className="text-base leading-6 text-text-secondary">
          No gift requests yet.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col p-8">
      <div className="w-full overflow-x-auto rounded-lg border border-border-default">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="bg-bg-subtle">
              {['Order ID', 'Status', 'Date'].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-sm font-medium leading-5 text-text-secondary"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => navigate(`/orders/${order.giftRequestId}`)}
                className="h-[52px] cursor-pointer border-t border-border-default hover:bg-bg-muted"
              >
                <td className="px-4 text-sm font-medium leading-5 text-text-primary">
                  <span className="inline-flex items-center gap-2">
                    {order.hasUnreadCustomerMessage ? (
                      <span
                        aria-label="Unread"
                        className="size-2 shrink-0 rounded-full bg-accent-default"
                      />
                    ) : (
                      <span className="size-2 shrink-0" aria-hidden />
                    )}
                    {order.orderId}
                  </span>
                </td>
                <td className="px-4">
                  <StatusLabel status={order.status} />
                </td>
                <td className="px-4 text-sm leading-5 whitespace-nowrap text-text-primary">
                  {formatReviewSentDay(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

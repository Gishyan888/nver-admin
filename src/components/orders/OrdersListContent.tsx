import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatReviewSentDay } from '../../lib/formatDateTime'
import { StatusLabel } from '../status/StatusLabel'
import { StandardContentState } from '../standard/StandardContentState'
import { DateField } from './DateField'
import { filterOrders } from './filterOrders'
import type { OrderListItem } from './types'
import { ORDERS_PAGE_SIZE } from './types'

type PageOverlay = 'none' | 'loading' | 'error' | 'offline'

type OrdersListContentProps = {
  orders: OrderListItem[]
  overlay?: PageOverlay
}

export function OrdersListContent({
  orders,
  overlay = 'none',
}: OrdersListContentProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [fromDay, setFromDay] = useState<string | null>(null)
  const [fromLabel, setFromLabel] = useState<string | null>(null)
  const [toDay, setToDay] = useState<string | null>(null)
  const [toLabel, setToLabel] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  const filtered = useMemo(
    () => filterOrders(orders, search, fromDay, toDay),
    [orders, search, fromDay, toDay],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / ORDERS_PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageRows = filtered.slice(
    safePage * ORDERS_PAGE_SIZE,
    safePage * ORDERS_PAGE_SIZE + ORDERS_PAGE_SIZE,
  )
  const isFirst = safePage === 0
  const isLast = safePage >= pageCount - 1 || filtered.length === 0

  if (overlay === 'loading') {
    return <StandardContentState kind="loading" />
  }
  if (overlay === 'error' || overlay === 'offline') {
    return (
      <StandardContentState kind={overlay === 'offline' ? 'offline' : 'error'} />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[280px] flex-1">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-secondary">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <circle
                cx="7"
                cy="7"
                r="4.5"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M10.5 10.5L13.5 13.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            type="search"
            value={search}
            placeholder="Search by customer name or order ID"
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(0)
            }}
            className="h-12 w-full rounded-lg border border-border-default bg-bg-default py-3 pr-4 pl-10 text-base leading-6 text-text-primary outline-none placeholder:text-text-secondary"
          />
        </label>
        <DateField
          label="From"
          valueLabel={fromLabel}
          dayKey={fromDay}
          onChange={(key, label) => {
            setFromDay(key)
            setFromLabel(label)
            setPage(0)
          }}
        />
        <DateField
          label="To"
          valueLabel={toLabel}
          dayKey={toDay}
          onChange={(key, label) => {
            setToDay(key)
            setToLabel(label)
            setPage(0)
          }}
        />
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-24">
          <p className="text-base leading-6 text-text-secondary">
            No gift requests yet.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-24">
          <p className="text-base leading-6 text-text-secondary">
            No gift requests match your search.
          </p>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto rounded-lg border border-border-default">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="bg-bg-subtle">
                  {['Order ID', 'Customer name', 'Status', 'Date'].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-sm font-medium leading-5 text-text-secondary"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() =>
                      navigate(`/orders/${order.giftRequestId}`)
                    }
                    className="h-[52px] cursor-pointer border-t border-border-default hover:bg-bg-muted"
                  >
                    <td className="px-4 text-sm leading-5 text-text-primary">
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
                    <td className="px-4 text-sm leading-5 text-text-primary">
                      {order.customerName}
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

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="flex h-12 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary disabled:cursor-default disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => setPage((p) => p + 1)}
              className="flex h-12 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary disabled:cursor-default disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatReviewSentDay } from '../../lib/formatDateTime'
import { StatusLabel } from '../status/StatusLabel'
import { StandardContentState } from '../standard/StandardContentState'
import { DateField } from './DateField'
import { filterOrders } from './filterOrders'
import type { OrderListItem } from './types'
import { ORDERS_PAGE_SIZE, ORDERS_SEARCH_MAX } from './types'

type PageOverlay = 'none' | 'loading' | 'error' | 'offline'

type OrdersListContentProps = {
  orders: OrderListItem[]
  /** Total matching rows (server) or unfiltered count (demo). */
  total: number
  /** 1-based page index. */
  page: number
  onPageChange: (page: number) => void
  search: string
  onSearchChange: (value: string) => void
  fromDay: string | null
  fromLabel: string | null
  onFromChange: (dayKey: string | null, label: string | null) => void
  toDay: string | null
  toLabel: string | null
  onToChange: (dayKey: string | null, label: string | null) => void
  overlay?: PageOverlay
  /** When true, `orders` is already one server page. */
  serverPaged?: boolean
}

export function OrdersListContent({
  orders,
  total,
  page,
  onPageChange,
  search,
  onSearchChange,
  fromDay,
  fromLabel,
  onFromChange,
  toDay,
  toLabel,
  onToChange,
  overlay = 'none',
  serverPaged = false,
}: OrdersListContentProps) {
  const navigate = useNavigate()

  const filtered = useMemo(
    () =>
      serverPaged ? orders : filterOrders(orders, search, fromDay, toDay),
    [orders, search, fromDay, toDay, serverPaged],
  )

  const listTotal = serverPaged ? total : filtered.length
  const sourceTotal = serverPaged ? total : orders.length
  const filtersActive = Boolean(search.trim() || fromDay || toDay)

  const pageCount = Math.max(1, Math.ceil(listTotal / ORDERS_PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), pageCount)
  const pageRows = serverPaged
    ? filtered
    : filtered.slice(
        (safePage - 1) * ORDERS_PAGE_SIZE,
        (safePage - 1) * ORDERS_PAGE_SIZE + ORDERS_PAGE_SIZE,
      )
  const isFirst = safePage <= 1
  const isLast = safePage >= pageCount || listTotal === 0

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
            maxLength={ORDERS_SEARCH_MAX}
            placeholder="Search by customer name or order ID"
            onChange={(event) => {
              onSearchChange(event.target.value.slice(0, ORDERS_SEARCH_MAX))
            }}
            className="h-12 w-full rounded-lg border border-border-default bg-bg-default py-3 pr-4 pl-10 text-base leading-6 text-text-primary outline-none placeholder:text-text-secondary"
          />
        </label>
        <DateField
          label="From"
          valueLabel={fromLabel}
          dayKey={fromDay}
          onChange={onFromChange}
        />
        <DateField
          label="To"
          valueLabel={toLabel}
          dayKey={toDay}
          onChange={onToChange}
        />
      </div>

      {sourceTotal === 0 && !filtersActive ? (
        <div className="flex flex-1 items-center justify-center py-24">
          <p className="text-base leading-6 text-text-secondary">
            No gift requests yet.
          </p>
        </div>
      ) : listTotal === 0 ? (
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
              onClick={() => onPageChange(Math.max(1, safePage - 1))}
              className="flex h-12 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary disabled:cursor-default disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => onPageChange(safePage + 1)}
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

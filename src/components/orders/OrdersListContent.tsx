import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatReviewSentDay } from '../../lib/formatDateTime'
import { IconSearch } from '../icons/FigmaIcons'
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
      <div className="flex shrink-0 items-start gap-3">
        <label className="flex h-12 w-[360px] shrink-0 cursor-text items-center gap-2 overflow-hidden rounded-lg border border-border-default bg-bg-default px-4">
          <IconSearch className="shrink-0 text-text-secondary" />
          <input
            type="search"
            value={search}
            maxLength={ORDERS_SEARCH_MAX}
            placeholder="Search by customer name or order ID"
            onChange={(event) => {
              onSearchChange(event.target.value.slice(0, ORDERS_SEARCH_MAX))
            }}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-base leading-6 text-text-primary outline-none placeholder:text-text-secondary"
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
            <div role="table" className="flex w-full min-w-[760px] flex-col">
              <div
                role="row"
                className="flex h-11 shrink-0 items-center gap-4 border-b border-border-default bg-bg-subtle px-4"
              >
                <div
                  role="columnheader"
                  className="w-[200px] shrink-0 pl-4 text-sm font-medium leading-5 text-text-secondary"
                >
                  Order ID
                </div>
                <div
                  role="columnheader"
                  className="min-w-0 flex-1 text-sm font-medium leading-5 text-text-secondary"
                >
                  Customer name
                </div>
                <div
                  role="columnheader"
                  className="w-[200px] shrink-0 text-sm font-medium leading-5 text-text-secondary"
                >
                  Status
                </div>
                <div
                  role="columnheader"
                  className="w-[160px] shrink-0 text-sm font-medium leading-5 text-text-secondary"
                >
                  Date
                </div>
              </div>
              {pageRows.map((order) => (
                <div
                  key={order.id}
                  role="row"
                  tabIndex={0}
                  onClick={() => navigate(`/orders/${order.giftRequestId}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/orders/${order.giftRequestId}`)
                    }
                  }}
                  className="flex h-[52px] shrink-0 cursor-pointer items-center gap-4 border-b border-border-default bg-bg-default px-4 hover:bg-bg-subtle"
                >
                  <div
                    role="cell"
                    className="flex h-5 w-[200px] shrink-0 items-center gap-2"
                  >
                    {order.hasUnreadCustomerMessage ? (
                      <span
                        aria-label="Unread"
                        className="size-2 shrink-0 rounded-full bg-accent-default"
                      />
                    ) : (
                      <span className="size-2 shrink-0" aria-hidden />
                    )}
                    <span className="text-sm font-medium leading-5 whitespace-nowrap text-text-primary">
                      {order.orderId}
                    </span>
                  </div>
                  <div
                    role="cell"
                    className="min-w-0 flex-1 truncate text-sm leading-5 text-text-primary"
                  >
                    {order.customerName}
                  </div>
                  <div role="cell" className="flex h-6 w-[200px] shrink-0 items-start">
                    <StatusLabel status={order.status} />
                  </div>
                  <div
                    role="cell"
                    className="w-[160px] shrink-0 text-sm leading-5 whitespace-nowrap text-text-primary"
                  >
                    {formatReviewSentDay(order.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => onPageChange(Math.max(1, safePage - 1))}
              className="flex h-10 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-4 text-sm font-medium leading-5 text-text-primary disabled:cursor-default disabled:text-text-tertiary"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => onPageChange(safePage + 1)}
              className="flex h-10 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-4 text-sm font-medium leading-5 text-text-primary disabled:cursor-default disabled:text-text-tertiary"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

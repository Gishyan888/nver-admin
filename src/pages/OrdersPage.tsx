import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { listAdminGiftRequests } from '../api/giftRequests'
import { NetworkError } from '../api/types'
import { orderListItemFromApi } from '../components/orders/mapOrderListItem'
import { OrdersListContent } from '../components/orders/OrdersListContent'
import { buildDemoOrders } from '../components/orders/ordersDemo'
import type { OrderListItem } from '../components/orders/types'
import { AdminShell } from '../components/standard/AdminShell'

type PageOverlay = 'none' | 'loading' | 'error' | 'offline'

const SEARCH_DEBOUNCE_MS = 300

/**
 * Admin Orders list (T-10-11).
 * Empty fixture: /?empty=1 · Demo list: /?demo=1
 */
export function OrdersPage() {
  const [params] = useSearchParams()
  const empty = params.get('empty') === '1'
  const demo = params.get('demo') === '1'
  const fixturesOnly = empty || demo

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [fromDay, setFromDay] = useState<string | null>(null)
  const [fromLabel, setFromLabel] = useState<string | null>(null)
  const [toDay, setToDay] = useState<string | null>(null)
  const [toLabel, setToLabel] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [total, setTotal] = useState(0)
  const [overlay, setOverlay] = useState<PageOverlay>(
    fixturesOnly ? 'none' : 'loading',
  )

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearch((prev) => {
        if (prev !== search) {
          setPage(1)
        }
        return search
      })
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(handle)
  }, [search])

  const load = useCallback(async () => {
    if (empty) {
      setOrders([])
      setTotal(0)
      setOverlay('none')
      return
    }
    if (demo) {
      const items = buildDemoOrders()
      setOrders(items)
      setTotal(items.length)
      setOverlay('none')
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setOverlay('loading')
    try {
      const result = await listAdminGiftRequests({
        page,
        search: debouncedSearch,
        from: fromDay,
        to: toDay,
      })
      const mapped = result.items
        .map(orderListItemFromApi)
        .filter((item): item is OrderListItem => item !== null)
      setOrders(mapped)
      setTotal(result.total)
      setOverlay('none')
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      setOverlay('error')
    }
  }, [demo, empty, page, debouncedSearch, fromDay, toDay])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <AdminShell title="Orders" currentNav="Orders">
      <OrdersListContent
        orders={orders}
        total={total}
        page={page}
        onPageChange={setPage}
        search={search}
        onSearchChange={setSearch}
        fromDay={fromDay}
        fromLabel={fromLabel}
        onFromChange={(key, label) => {
          setFromDay(key)
          setFromLabel(label)
          setPage(1)
        }}
        toDay={toDay}
        toLabel={toLabel}
        onToChange={(key, label) => {
          setToDay(key)
          setToLabel(label)
          setPage(1)
        }}
        overlay={overlay}
        serverPaged={!fixturesOnly}
      />
    </AdminShell>
  )
}

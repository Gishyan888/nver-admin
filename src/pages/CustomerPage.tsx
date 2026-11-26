import { useCallback, useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getAdminCustomer } from '../api/customers'
import { NetworkError } from '../api/types'
import { AdminShell } from '../components/standard/AdminShell'
import { StandardContentState } from '../components/standard/StandardContentState'
import { CustomerPageContent } from '../components/users/CustomerPageContent'
import { customerFromApi } from '../components/users/mapCustomer'
import type { CustomerDemo } from '../components/users/types'
import { resolveDemoCustomer } from '../components/users/usersDemo'

type PageOverlay = 'none' | 'loading' | 'error' | 'offline'

/**
 * Page of one customer (T-10-14).
 * Fixtures: /users/:id?demo=1 · No gift requests: ?empty=1
 * Standard states: ?state=loading|error|offline
 */
export function CustomerPage() {
  const { customerId = '' } = useParams()
  const [params] = useSearchParams()
  const stateParam = params.get('state')
  const emptyOrders = params.get('empty') === '1'
  const demo = params.get('demo') === '1'
  const fixturesOnly =
    demo ||
    stateParam === 'loading' ||
    stateParam === 'error' ||
    stateParam === 'offline'

  const [overlay, setOverlay] = useState<PageOverlay>(() => {
    if (
      stateParam === 'loading' ||
      stateParam === 'error' ||
      stateParam === 'offline'
    ) {
      return stateParam
    }
    return fixturesOnly ? 'none' : 'loading'
  })
  const [customer, setCustomer] = useState<CustomerDemo | null>(() =>
    fixturesOnly ? resolveDemoCustomer(customerId) : null,
  )

  const load = useCallback(async () => {
    if (
      stateParam === 'loading' ||
      stateParam === 'error' ||
      stateParam === 'offline'
    ) {
      setOverlay(stateParam)
      return
    }
    if (fixturesOnly) {
      const demoCustomer = resolveDemoCustomer(customerId)
      setCustomer({
        ...demoCustomer,
        orders: emptyOrders ? [] : demoCustomer.orders,
      })
      setOverlay('none')
      return
    }
    if (!customerId) {
      setOverlay('error')
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setOverlay('loading')
    try {
      const result = await getAdminCustomer(customerId)
      const mapped = customerFromApi(result)
      if (!mapped) {
        setOverlay('error')
        return
      }
      setCustomer(mapped)
      setOverlay('none')
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      setOverlay('error')
    }
  }, [customerId, emptyOrders, fixturesOnly, stateParam])

  useEffect(() => {
    void load()
  }, [load])

  if (overlay === 'loading' || overlay === 'error' || overlay === 'offline') {
    return (
      <AdminShell title="Users" currentNav="Users">
        <StandardContentState
          kind={
            overlay === 'loading'
              ? 'loading'
              : overlay === 'offline'
                ? 'offline'
                : 'error'
          }
        />
      </AdminShell>
    )
  }

  if (!customer) {
    return (
      <AdminShell title="Users" currentNav="Users">
        <StandardContentState kind="error" />
      </AdminShell>
    )
  }

  return (
    <AdminShell
      currentNav="Users"
      header={
        <div className="flex flex-col gap-2">
          <Link
            to="/users"
            className="w-fit text-sm font-medium leading-5 text-text-secondary"
          >
            ← Users
          </Link>
          <h1 className="text-xl font-semibold leading-7 text-text-primary">
            {customer.name}
          </h1>
          <p className="text-sm leading-5 text-text-secondary">
            {customer.email}
          </p>
        </div>
      }
    >
      <CustomerPageContent orders={customer.orders} overlay="none" />
    </AdminShell>
  )
}

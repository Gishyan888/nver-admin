import { Link, useParams, useSearchParams } from 'react-router-dom'
import { AdminShell } from '../components/standard/AdminShell'
import type { StandardContentKind } from '../components/standard/StandardContentState'
import { CustomerPageContent } from '../components/users/CustomerPageContent'
import { resolveDemoCustomer } from '../components/users/usersDemo'

function parseOverlay(
  value: string | null,
): StandardContentKind | 'none' {
  if (value === 'loading' || value === 'error' || value === 'offline') {
    return value
  }
  return 'none'
}

/**
 * Page of one customer (T-10-14) — demo fixtures until T-10-09 Result.
 * No gift requests: /users/:id?empty=1
 * Standard states: /users/:id?state=loading|error|offline
 */
export function CustomerPage() {
  const { customerId = '' } = useParams()
  const [params] = useSearchParams()
  const overlay = parseOverlay(params.get('state'))
  const emptyOrders = params.get('empty') === '1'
  const customer = resolveDemoCustomer(customerId)
  const orders = emptyOrders ? [] : customer.orders

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
      <CustomerPageContent
        orders={orders}
        overlay={overlay === 'none' ? 'none' : overlay}
      />
    </AdminShell>
  )
}

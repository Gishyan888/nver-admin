import type { CustomerDemo, CustomerOrderItem, UserListItem } from './types'

const NAMES = [
  'Lilit Sargsyan',
  'Sofia Martirosyan',
  'Anna Petrosyan',
  'Hasmik Sargsyan',
  'Nare Abrahamyan',
  'Samvel Aslanyan',
  'Hayk Grigoryan',
  'Mark Johnson',
  'James Miller',
  'David Brown',
  'Emma Wilson',
  'Maria Garcia',
]

function slugName(name: string, index: number): string {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${index}`
}

function emailFor(name: string, index: number): string {
  const local = name.toLowerCase().replace(/\s+/g, '.')
  if (index === 0) {
    return 'lilit.sargsyan@example.com'
  }
  return `${local}${index > 11 ? index : ''}@example.com`
}

/**
 * 45 verified customers — three pages for QA (20 + 20 + 5).
 * Newest registration first. Counts include 0.
 */
export function buildDemoUsers(): UserListItem[] {
  const items: UserListItem[] = []
  for (let i = 0; i < 45; i += 1) {
    const name = NAMES[i % NAMES.length]
    const day = 24 - (i % 20)
    const monthDay = Math.max(1, day)
    const giftRequestCount = i === 0 ? 2 : i === 1 ? 0 : (i % 5) + 1
    items.push({
      id: slugName(name, i),
      name,
      email: emailFor(name, i),
      registeredAt: `2026-11-${String(monthDay).padStart(2, '0')}T12:00:00.000Z`,
      giftRequestCount,
    })
  }
  return items
}

const DEMO_LILIT_ORDERS: CustomerOrderItem[] = [
  {
    id: 'cust-order-10118',
    orderId: 'NV-10118',
    giftRequestId: 'demo-gr-10118',
    status: 'In Progress',
    createdAt: '2026-11-24T12:00:00.000Z',
    hasUnreadCustomerMessage: true,
  },
  {
    id: 'cust-order-10042',
    orderId: 'NV-10042',
    giftRequestId: 'demo-gr-10042',
    status: 'Completed',
    createdAt: '2026-10-09T12:00:00.000Z',
    hasUnreadCustomerMessage: false,
  },
]

/** Demo customer matching the T-10-05 Customer frame. */
export const DEMO_CUSTOMER_LILIT: CustomerDemo = {
  id: 'lilit-sargsyan-0',
  name: 'Lilit Sargsyan',
  email: 'lilit.sargsyan@example.com',
  orders: DEMO_LILIT_ORDERS,
}

export function resolveDemoCustomer(customerId: string): CustomerDemo {
  const users = buildDemoUsers()
  const match = users.find((user) => user.id === customerId)
  if (!match) {
    return DEMO_CUSTOMER_LILIT
  }
  if (match.id === DEMO_CUSTOMER_LILIT.id) {
    return DEMO_CUSTOMER_LILIT
  }
  if (match.giftRequestCount === 0) {
    return {
      id: match.id,
      name: match.name,
      email: match.email,
      orders: [],
    }
  }
  const orders: CustomerOrderItem[] = []
  for (let i = 0; i < match.giftRequestCount; i += 1) {
    const orderNum = 10100 - i
    orders.push({
      id: `cust-${match.id}-order-${orderNum}`,
      orderId: `NV-${orderNum}`,
      giftRequestId: `demo-gr-${orderNum}`,
      status: i === 0 ? 'In Progress' : 'Completed',
      createdAt: `2026-11-${String(Math.max(1, 24 - i)).padStart(2, '0')}T12:00:00.000Z`,
      hasUnreadCustomerMessage: i === 0 && match.giftRequestCount > 1,
    })
  }
  return {
    id: match.id,
    name: match.name,
    email: match.email,
    orders,
  }
}

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { listAdminCustomers } from '../api/customers'
import { NetworkError } from '../api/types'
import { useAdminShell } from '../components/standard/AdminLayout'
import { userListItemFromApi } from '../components/users/mapCustomer'
import type { UserListItem } from '../components/users/types'
import { UsersListContent } from '../components/users/UsersListContent'
import { buildDemoUsers } from '../components/users/usersDemo'

type PageOverlay = 'none' | 'loading' | 'error' | 'offline'

/**
 * Admin Users list (T-10-14).
 * Empty fixture: /users?empty=1 · Demo list: /users?demo=1
 */
export function UsersPage() {
  const [params] = useSearchParams()
  const empty = params.get('empty') === '1'
  const demo = params.get('demo') === '1'
  const fixturesOnly = empty || demo

  const [page, setPage] = useState(1)
  const [users, setUsers] = useState<UserListItem[]>([])
  const [total, setTotal] = useState(0)
  const [overlay, setOverlay] = useState<PageOverlay>(
    fixturesOnly ? 'none' : 'loading',
  )

  const load = useCallback(async () => {
    if (empty) {
      setUsers([])
      setTotal(0)
      setOverlay('none')
      return
    }
    if (demo) {
      const items = buildDemoUsers()
      setUsers(items)
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
      const result = await listAdminCustomers(page)
      setUsers(result.items.map(userListItemFromApi))
      setTotal(result.total)
      setOverlay('none')
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      setOverlay('error')
    }
  }, [demo, empty, page])

  useEffect(() => {
    void load()
  }, [load])

  useAdminShell({ title: 'Users', currentNav: 'Users' })

  return (
    <UsersListContent
      users={users}
      total={total}
      page={page}
      onPageChange={setPage}
      overlay={overlay}
      serverPaged={!fixturesOnly}
    />
  )
}

import { useSearchParams } from 'react-router-dom'
import { AdminShell } from '../components/standard/AdminShell'
import type { StandardContentKind } from '../components/standard/StandardContentState'
import { UsersListContent } from '../components/users/UsersListContent'
import { buildDemoUsers } from '../components/users/usersDemo'

function parseOverlay(
  value: string | null,
): StandardContentKind | 'none' {
  if (value === 'loading' || value === 'error' || value === 'offline') {
    return value
  }
  return 'none'
}

/**
 * Admin Users list (T-10-14) — demo fixtures until T-10-09 Result.
 * Empty: /users?empty=1 · Standard states: /users?state=loading|error|offline
 */
export function UsersPage() {
  const [params] = useSearchParams()
  const empty = params.get('empty') === '1'
  const overlay = parseOverlay(params.get('state'))
  const users = empty ? [] : buildDemoUsers()

  return (
    <AdminShell title="Users" currentNav="Users">
      <UsersListContent
        users={users}
        overlay={overlay === 'none' ? 'none' : overlay}
      />
    </AdminShell>
  )
}

import { useNavigate } from 'react-router-dom'
import { formatReviewSentDay } from '../../lib/formatDateTime'
import { StandardContentState } from '../standard/StandardContentState'
import type { UserListItem } from './types'
import { USERS_PAGE_SIZE } from './types'

type PageOverlay = 'none' | 'loading' | 'error' | 'offline'

type UsersListContentProps = {
  users: UserListItem[]
  total: number
  /** 1-based page index. */
  page: number
  onPageChange: (page: number) => void
  overlay?: PageOverlay
  /** When true, `users` is already one server page. */
  serverPaged?: boolean
}

export function UsersListContent({
  users,
  total,
  page,
  onPageChange,
  overlay = 'none',
  serverPaged = false,
}: UsersListContentProps) {
  const navigate = useNavigate()

  const listTotal = serverPaged ? total : users.length
  const pageCount = Math.max(1, Math.ceil(listTotal / USERS_PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), pageCount)
  const pageRows = serverPaged
    ? users
    : users.slice(
        (safePage - 1) * USERS_PAGE_SIZE,
        (safePage - 1) * USERS_PAGE_SIZE + USERS_PAGE_SIZE,
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

  if (listTotal === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-base leading-6 text-text-secondary">
          No customers yet.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <div className="w-full overflow-x-auto rounded-lg border border-border-default">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="bg-bg-subtle">
              {['Name', 'E-mail', 'Registered', 'Gift requests'].map(
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
            {pageRows.map((user) => (
              <tr
                key={user.id}
                onClick={() => navigate(`/users/${user.id}`)}
                className="h-[52px] cursor-pointer border-t border-border-default hover:bg-bg-muted"
              >
                <td className="px-4 text-sm leading-5 text-text-primary">
                  {user.name}
                </td>
                <td className="px-4 text-sm leading-5 text-text-primary">
                  {user.email}
                </td>
                <td className="px-4 text-sm leading-5 whitespace-nowrap text-text-primary">
                  {formatReviewSentDay(user.registeredAt)}
                </td>
                <td className="px-4 text-sm leading-5 text-text-primary">
                  {user.giftRequestCount}
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
    </div>
  )
}

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
        <div role="table" className="flex w-full min-w-[760px] flex-col">
          <div
            role="row"
            className="flex h-11 shrink-0 items-center gap-4 border-b border-border-default bg-bg-subtle px-4"
          >
            <div
              role="columnheader"
              className="w-[280px] shrink-0 text-sm font-medium leading-5 text-text-secondary"
            >
              Name
            </div>
            <div
              role="columnheader"
              className="min-w-0 flex-1 text-sm font-medium leading-5 text-text-secondary"
            >
              E-mail
            </div>
            <div
              role="columnheader"
              className="w-[200px] shrink-0 text-sm font-medium leading-5 text-text-secondary"
            >
              Registered
            </div>
            <div
              role="columnheader"
              className="w-[160px] shrink-0 text-sm font-medium leading-5 text-text-secondary"
            >
              Gift requests
            </div>
          </div>
          {pageRows.map((user) => (
            <div
              key={user.id}
              role="row"
              tabIndex={0}
              onClick={() => navigate(`/users/${user.id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  navigate(`/users/${user.id}`)
                }
              }}
              className="flex h-[52px] shrink-0 cursor-pointer items-center gap-4 border-b border-border-default bg-bg-default px-4 hover:bg-bg-subtle"
            >
              <div
                role="cell"
                className="w-[280px] shrink-0 truncate text-sm font-medium leading-5 text-text-primary"
              >
                {user.name}
              </div>
              <div
                role="cell"
                className="min-w-0 flex-1 truncate text-sm leading-5 text-text-primary"
              >
                {user.email}
              </div>
              <div
                role="cell"
                className="w-[200px] shrink-0 text-sm leading-5 whitespace-nowrap text-text-primary"
              >
                {formatReviewSentDay(user.registeredAt)}
              </div>
              <div
                role="cell"
                className="w-[160px] shrink-0 text-sm leading-5 text-text-primary"
              >
                {user.giftRequestCount}
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
    </div>
  )
}

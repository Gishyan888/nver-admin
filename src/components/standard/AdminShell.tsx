import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type AdminNavItem = 'Orders' | 'Users' | 'Reviews'

type MenuItemProps = {
  label: AdminNavItem | 'Log out'
  current?: boolean
  to?: string
}

/**
 * Stand-in menu and page header from the standard-state frames (T-01-09).
 * Real menu / header come in T-10-10; pages keep using this shell until then.
 */
function MenuItem({ label, current = false, to }: MenuItemProps) {
  const className = `flex h-9 w-full items-center rounded-lg px-3 ${
    current ? 'bg-accent-subtle' : ''
  }`
  const textClass = `text-sm font-medium leading-5 whitespace-nowrap ${
    current ? 'text-text-primary' : 'text-border-default'
  }`

  if (to) {
    return (
      <Link to={to} className={className}>
        <span className={textClass}>{label}</span>
      </Link>
    )
  }

  return (
    <div className={className}>
      <span className={textClass}>{label}</span>
    </div>
  )
}

type AdminShellProps = {
  title?: string
  currentNav?: AdminNavItem
  children: ReactNode
}

export function AdminShell({
  title = '[Page title]',
  currentNav = 'Orders',
  children,
}: AdminShellProps) {
  return (
    <div className="flex min-h-screen items-stretch bg-bg-default">
      <aside className="flex w-60 shrink-0 flex-col justify-between bg-bg-inverse p-4">
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full items-start px-3 py-1">
            <p className="text-xl font-semibold leading-7 text-text-on-accent">
              Nvér
            </p>
          </div>
          <nav className="flex w-full flex-col gap-1">
            <MenuItem
              label="Orders"
              current={currentNav === 'Orders'}
              to="/"
            />
            <MenuItem label="Users" current={currentNav === 'Users'} />
            <MenuItem
              label="Reviews"
              current={currentNav === 'Reviews'}
              to="/reviews"
            />
          </nav>
        </div>
        <div className="flex w-full flex-col">
          <MenuItem label="Log out" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center border-b border-border-default px-8 py-5">
          <h1 className="text-xl font-semibold leading-7 text-text-primary">
            {title}
          </h1>
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

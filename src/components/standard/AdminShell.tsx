import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError, NetworkError } from '../../api/types'
import { useAuth } from '../../auth/useAuth'
import { NverLogo } from '../brand/NverLogo'
import { StandardContentState } from './StandardContentState'

export type AdminNavItem = 'Orders' | 'Users' | 'Reviews'

const NAV_PATH: Record<AdminNavItem, string> = {
  Orders: '/',
  Users: '/users',
  Reviews: '/reviews',
}

type MenuItemProps = {
  label: AdminNavItem | 'Log out'
  current?: boolean
  to?: string
  onClick?: () => void
  disabled?: boolean
}

/**
 * Admin panel frame (T-10-10): fixed menu, page header, Log out.
 */
function MenuItem({
  label,
  current = false,
  to,
  onClick,
  disabled = false,
}: MenuItemProps) {
  const className = `flex h-9 w-full items-center rounded-lg px-3 text-left text-sm font-medium leading-5 whitespace-nowrap ${
    current
      ? 'bg-accent-subtle text-text-primary'
      : 'text-border-default hover:bg-text-secondary hover:text-text-on-accent'
  } ${disabled ? 'cursor-default opacity-60' : 'cursor-pointer'}`

  if (current) {
    return (
      <div className={className} aria-current="page">
        {label}
      </div>
    )
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={className}
      >
        {label}
      </button>
    )
  }

  if (to) {
    return (
      <Link to={to} className={className}>
        {label}
      </Link>
    )
  }

  return <div className={className}>{label}</div>
}

type FrameOverlay = 'none' | 'loading' | 'error' | 'offline'

type AdminShellProps = {
  title?: string
  /** Replaces the default page-title header (e.g. customer page identity). */
  header?: ReactNode
  currentNav?: AdminNavItem
  children: ReactNode
}

export function AdminShell({
  title = '[Page title]',
  header,
  currentNav = 'Orders',
  children,
}: AdminShellProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [overlay, setOverlay] = useState<FrameOverlay>('none')
  const loggingOut = overlay === 'loading'

  async function handleLogout() {
    if (loggingOut) {
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setOverlay('loading')
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      if (error instanceof ApiError) {
        setOverlay('error')
        return
      }
      setOverlay('error')
    }
  }

  return (
    <div className="flex h-screen items-stretch overflow-hidden bg-bg-default">
      <aside className="flex h-full w-60 shrink-0 flex-col justify-between bg-bg-inverse p-4">
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full items-start px-3 py-1">
            <NverLogo variant="white" className="h-7 w-[23.333px]" />
          </div>
          <nav className="flex w-full flex-col gap-1">
            {(Object.keys(NAV_PATH) as AdminNavItem[]).map((item) => (
              <MenuItem
                key={item}
                label={item}
                current={currentNav === item}
                to={NAV_PATH[item]}
              />
            ))}
          </nav>
        </div>
        <div className="flex w-full flex-col">
          <MenuItem
            label="Log out"
            onClick={() => {
              void handleLogout()
            }}
            disabled={loggingOut}
          />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className={`flex shrink-0 border-b border-border-default px-8 ${
            header
              ? 'flex-col items-start py-6'
              : 'items-center py-5'
          }`}
        >
          {header ??
            (title ? (
              <h1 className="text-xl font-semibold leading-7 text-text-primary">
                {title}
              </h1>
            ) : null)}
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          {overlay === 'none' ? (
            children
          ) : (
            <StandardContentState
              kind={
                overlay === 'loading'
                  ? 'loading'
                  : overlay === 'offline'
                    ? 'offline'
                    : 'error'
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}

import type { AdminNavItem } from './AdminShell'

export function adminNavFromPath(pathname: string): AdminNavItem {
  if (pathname.startsWith('/users')) {
    return 'Users'
  }
  if (pathname.startsWith('/reviews')) {
    return 'Reviews'
  }
  return 'Orders'
}

/** Order or customer detail routes — not list pages. */
export function isDetailPath(pathname: string): boolean {
  return /^\/orders\/[^/]+/.test(pathname) || /^\/users\/[^/]+/.test(pathname)
}

export function defaultTitleFromPath(pathname: string): string {
  if (pathname.startsWith('/reviews')) {
    return 'Reviews'
  }
  if (pathname === '/users') {
    return 'Users'
  }
  if (isDetailPath(pathname)) {
    return ''
  }
  return 'Orders'
}

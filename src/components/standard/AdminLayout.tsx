import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AdminShell, type AdminNavItem } from './AdminShell'
import {
  adminNavFromPath,
  defaultTitleFromPath,
  isDetailPath,
} from './adminNav'
import {
  DetailHeaderSkeleton,
  StandardContentState,
} from './StandardContentState'

type ShellChrome = {
  title?: string
  header?: ReactNode
  currentNav: AdminNavItem
}

type ShellApi = {
  setChrome: (chrome: {
    title?: string
    header?: ReactNode
    currentNav?: AdminNavItem
  }) => void
}

const ShellApiContext = createContext<ShellApi | null>(null)

/**
 * Keep one AdminShell mounted across auth boot and route changes so the
 * sidebar/header do not remount into a different page's loading UI.
 */
export function AdminLayout({ boot = false }: { boot?: boolean }) {
  const location = useLocation()
  const [chrome, setChromeState] = useState<ShellChrome>(() => ({
    currentNav: adminNavFromPath(location.pathname),
    title: defaultTitleFromPath(location.pathname),
  }))

  useLayoutEffect(() => {
    setChromeState({
      currentNav: adminNavFromPath(location.pathname),
      title: defaultTitleFromPath(location.pathname),
      header: undefined,
    })
  }, [location.pathname])

  const api = useMemo<ShellApi>(
    () => ({
      setChrome: (next) => {
        setChromeState((prev) => {
          const currentNav = next.currentNav ?? prev.currentNav
          if (next.header !== undefined) {
            return {
              currentNav,
              header: next.header,
              title: undefined,
            }
          }
          return {
            currentNav,
            title: next.title ?? prev.title,
            header: undefined,
          }
        })
      },
    }),
    [],
  )

  const detailBoot = boot && isDetailPath(location.pathname)

  return (
    <ShellApiContext.Provider value={api}>
      <AdminShell
        currentNav={chrome.currentNav}
        title={
          detailBoot || chrome.header ? undefined : chrome.title
        }
        header={
          detailBoot ? <DetailHeaderSkeleton /> : chrome.header
        }
      >
        {boot ? (
          <StandardContentState
            kind="loading"
            contentShape={detailBoot ? 'detail' : 'panel'}
          />
        ) : (
          <Outlet />
        )}
      </AdminShell>
    </ShellApiContext.Provider>
  )
}

/** Pages declare chrome; shell stays mounted in AdminLayout. */
export function useAdminShell(chrome: {
  title?: string
  header?: ReactNode
  currentNav?: AdminNavItem
}) {
  const api = useContext(ShellApiContext)
  if (!api) {
    throw new Error('useAdminShell must be used within AdminLayout')
  }

  useLayoutEffect(() => {
    api.setChrome(chrome)
  }, [api, chrome.title, chrome.header, chrome.currentNav])
}

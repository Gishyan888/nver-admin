import type { ReactNode } from 'react'

type MenuItemProps = {
  label: string
  current?: boolean
}

/**
 * Stand-in menu and page header from the standard-state frames (T-01-09).
 * Real menu / header come in their own tasks; pages keep using this shell until then.
 */
function MenuItem({ label, current = false }: MenuItemProps) {
  return (
    <div
      className={`flex h-9 w-full items-center rounded-lg px-3 ${
        current ? 'bg-accent-subtle' : ''
      }`}
    >
      <span
        className={`text-sm font-medium leading-5 whitespace-nowrap ${
          current ? 'text-text-primary' : 'text-border-default'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

type AdminShellProps = {
  title?: string
  children: ReactNode
}

export function AdminShell({
  title = '[Page title]',
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
            <MenuItem label="Orders" current />
            <MenuItem label="Users" />
            <MenuItem label="Reviews" />
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

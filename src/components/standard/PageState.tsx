import type { ReactNode } from 'react'

/** Content-area standard states (T-01-09). Auth pages have no menu/header. */

type PageStateKind = 'loading' | 'error' | 'offline'

type PageStateProps = {
  kind: PageStateKind
  /** When true, show a login-form-shaped skeleton instead of the panel table skeleton. */
  loginShape?: boolean
}

function LoginFormSkeleton() {
  return (
    <div className="flex w-[400px] flex-col gap-6 rounded-xl border border-border-default bg-bg-default p-8">
      <div className="h-8 w-24 rounded bg-bg-muted" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-5 w-14 rounded bg-bg-muted" />
          <div className="h-12 w-full rounded-lg bg-bg-muted" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-5 w-20 rounded bg-bg-muted" />
          <div className="h-12 w-full rounded-lg bg-bg-muted" />
        </div>
      </div>
      <div className="h-12 w-full rounded-lg bg-bg-muted" />
      <div className="mx-auto h-5 w-32 rounded bg-bg-muted" />
    </div>
  )
}

function PanelContentSkeleton() {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div className="h-10 w-80 rounded-lg bg-bg-muted" />
        <div className="h-10 w-[120px] rounded-lg bg-bg-muted" />
      </div>
      <div className="flex flex-col">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex gap-8 border-b border-border-default py-5"
          >
            <div className="h-4 max-w-40 flex-1 rounded bg-bg-muted" />
            <div className="h-4 max-w-[120px] flex-1 rounded bg-bg-muted" />
            <div className="h-4 max-w-[120px] flex-1 rounded bg-bg-muted" />
            <div className="h-4 max-w-[120px] flex-1 rounded bg-bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function PageState({ kind, loginShape = false }: PageStateProps) {
  if (kind === 'loading') {
    return loginShape ? <LoginFormSkeleton /> : <PanelContentSkeleton />
  }

  const text =
    kind === 'offline'
      ? 'No internet connection'
      : 'Something went wrong — try again'

  return (
    <p className="text-center text-base font-medium leading-6 text-text-primary">
      {text}
    </p>
  )
}

export function AuthPageFrame({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-subtle px-6 py-10">
      {children}
    </main>
  )
}

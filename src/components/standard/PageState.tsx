import type { ReactNode } from 'react'
import {
  StandardContentState,
  type StandardContentKind,
} from './StandardContentState'

export type PageStateKind = StandardContentKind

type PageStateProps = {
  kind: PageStateKind
  /** Auth pages: loading skeleton shaped like the login / forgot-password card. */
  loginShape?: boolean
}

/** Content-area standard states — same texts on every admin page (T-01-09). */
export function PageState({ kind, loginShape = false }: PageStateProps) {
  return (
    <StandardContentState
      kind={kind}
      contentShape={loginShape ? 'auth' : 'panel'}
    />
  )
}

export function AuthPageFrame({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-subtle px-6 py-10">
      {children}
    </main>
  )
}

export { AdminShell } from './AdminShell'
export { StandardContentState } from './StandardContentState'
export {
  STANDARD_ERROR_TEXT,
  STANDARD_OFFLINE_TEXT,
} from './texts'

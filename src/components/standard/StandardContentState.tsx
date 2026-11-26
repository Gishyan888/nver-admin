import {
  STANDARD_ERROR_TEXT,
  STANDARD_OFFLINE_TEXT,
} from './texts'

export type StandardContentKind = 'loading' | 'error' | 'offline'

type StandardContentStateProps = {
  kind: StandardContentKind
  /**
   * Loading skeleton shape:
   * - panel: toolbar + table (list pages / Figma 5:45)
   * - auth: login card
   * - detail: order/customer two-column cards (not the Orders table)
   */
  contentShape?: 'panel' | 'auth' | 'detail'
}

function AuthFormSkeleton() {
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

/** Toolbar + table skeleton from Figma 5:45 — not a spinner. */
function PanelContentSkeleton() {
  const columns = 5
  const dataRows = 8

  return (
    <div className="flex w-full flex-col gap-6 p-8">
      <div className="flex w-full items-center justify-between overflow-hidden">
        <div className="h-10 w-80 shrink-0 rounded-lg bg-bg-muted" />
        <div className="h-10 w-[120px] shrink-0 rounded-lg bg-bg-muted" />
      </div>
      <div className="flex w-full flex-col overflow-hidden">
        <div className="flex gap-8 border-b border-border-default py-5">
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={`head-${index}`}
              className="min-w-0 flex-1 overflow-hidden"
            >
              <div className="h-3 w-20 rounded bg-bg-muted" />
            </div>
          ))}
        </div>
        {Array.from({ length: dataRows }).map((_, row) => (
          <div
            key={`row-${row}`}
            className="flex gap-8 border-b border-border-default py-5"
          >
            {Array.from({ length: columns }).map((_, col) => (
              <div
                key={`cell-${row}-${col}`}
                className="min-w-0 flex-1 overflow-hidden"
              >
                <div
                  className={`h-4 rounded bg-bg-muted ${
                    col === 0 ? 'w-40' : 'w-[120px]'
                  }`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Two-column card skeleton for order / customer detail pages. */
function DetailContentSkeleton() {
  return (
    <div className="flex flex-col items-start gap-6 p-8 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
          <div className="h-6 w-24 rounded bg-bg-muted" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-20 rounded bg-bg-muted" />
              <div className="h-5 w-40 rounded bg-bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-4 w-28 rounded bg-bg-muted" />
              <div className="h-5 w-36 rounded bg-bg-muted" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 rounded bg-bg-muted" />
            <div className="h-5 w-full rounded bg-bg-muted" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-16 rounded bg-bg-muted" />
            <div className="h-5 w-3/4 rounded bg-bg-muted" />
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
          <div className="h-6 w-28 rounded bg-bg-muted" />
          <div className="h-5 w-56 rounded bg-bg-muted" />
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
          <div className="h-6 w-32 rounded bg-bg-muted" />
          <div className="h-28 w-full rounded-lg bg-bg-muted" />
        </div>
      </div>
      <div className="flex w-full max-w-[360px] shrink-0 flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
          <div className="h-6 w-16 rounded bg-bg-muted" />
          <div className="h-8 w-28 rounded-full bg-bg-muted" />
          <div className="h-4 w-full rounded bg-bg-muted" />
          <div className="h-4 w-2/3 rounded bg-bg-muted" />
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
          <div className="h-6 w-14 rounded bg-bg-muted" />
          <div className="h-10 w-full rounded-lg bg-bg-muted" />
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
          <div className="h-6 w-24 rounded bg-bg-muted" />
          <div className="flex flex-col gap-3">
            <div className="h-4 w-full rounded bg-bg-muted" />
            <div className="h-4 w-5/6 rounded bg-bg-muted" />
            <div className="h-4 w-4/6 rounded bg-bg-muted" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function DetailHeaderSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="h-5 w-20 rounded bg-bg-muted" />
      <div className="flex items-center gap-3">
        <div className="h-7 w-28 rounded bg-bg-muted" />
        <div className="h-6 w-20 rounded-full bg-bg-muted" />
      </div>
      <div className="h-5 w-72 rounded bg-bg-muted" />
    </div>
  )
}

/**
 * The three standard content-area states (T-01-09 / Figma 5:45).
 * Used inside AdminShell on panel pages, and alone on auth pages.
 */
export function StandardContentState({
  kind,
  contentShape = 'panel',
}: StandardContentStateProps) {
  if (kind === 'loading') {
    if (contentShape === 'auth') {
      return <AuthFormSkeleton />
    }
    if (contentShape === 'detail') {
      return <DetailContentSkeleton />
    }
    return <PanelContentSkeleton />
  }

  const text = kind === 'offline' ? STANDARD_OFFLINE_TEXT : STANDARD_ERROR_TEXT

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <p className="text-center text-base font-medium leading-6 text-text-primary whitespace-nowrap">
        {text}
      </p>
    </div>
  )
}

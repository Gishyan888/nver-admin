import {
  STANDARD_ERROR_TEXT,
  STANDARD_OFFLINE_TEXT,
} from './texts'

export type StandardContentKind = 'loading' | 'error' | 'offline'

type StandardContentStateProps = {
  kind: StandardContentKind
  /**
   * Loading skeleton shaped like the auth card (login / forgot password).
   * Panel pages use the toolbar + table skeleton from the frames.
   */
  contentShape?: 'panel' | 'auth'
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
      <div className="flex items-center justify-between">
        <div className="h-10 w-80 shrink-0 rounded-lg bg-bg-muted" />
        <div className="h-10 w-[120px] shrink-0 rounded-lg bg-bg-muted" />
      </div>
      <div className="flex w-full flex-col">
        <div className="flex gap-8 border-b border-border-default py-5">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={`head-${index}`} className="min-w-0 flex-1">
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
              <div key={`cell-${row}-${col}`} className="min-w-0 flex-1">
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

/**
 * The three standard content-area states (T-01-09).
 * Used inside AdminShell on panel pages, and alone on auth pages.
 */
export function StandardContentState({
  kind,
  contentShape = 'panel',
}: StandardContentStateProps) {
  if (kind === 'loading') {
    return contentShape === 'auth' ? (
      <AuthFormSkeleton />
    ) : (
      <PanelContentSkeleton />
    )
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

import { Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { AdminShell } from '../components/standard/AdminShell'
import {
  StandardContentState,
  type StandardContentKind,
} from '../components/standard/StandardContentState'

function parsePreviewState(
  value: string | null,
): StandardContentKind | null {
  if (value === 'loading' || value === 'error' || value === 'offline') {
    return value
  }
  return null
}

/**
 * Post-login landing. Panel pages are out of scope; this host shows the
 * AdminShell stand-ins and the shared standard content states (T-01-09).
 * Preview: `/?state=loading|error|offline`
 */
export function HomePlaceholder() {
  const { status } = useAuth()
  const [params] = useSearchParams()
  const preview = parsePreviewState(params.get('state'))

  if (status === 'booting') {
    return (
      <AdminShell>
        <StandardContentState kind="loading" />
      </AdminShell>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />
  }

  if (preview) {
    return (
      <AdminShell>
        <StandardContentState kind={preview} />
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <p className="text-base font-medium leading-6 text-text-primary">
          Admin panel
        </p>
      </div>
    </AdminShell>
  )
}

import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { PageState } from '../components/standard/PageState'

/**
 * Landing after a successful login. The admin panel pages are out of scope for T-00-12.
 * Admin name from the login answer must never be shown.
 */
export function HomePlaceholder() {
  const { status } = useAuth()

  if (status === 'booting') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-default">
        <PageState kind="loading" />
      </div>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-subtle px-6">
      <p className="text-base font-medium leading-6 text-text-primary">
        Admin panel
      </p>
    </div>
  )
}

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import { PageState } from '../components/standard/PageState'

export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'booting') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-default">
        <PageState kind="loading" />
      </div>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

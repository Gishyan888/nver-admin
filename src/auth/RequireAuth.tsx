import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AdminShell } from '../components/standard/AdminShell'
import { StandardContentState } from '../components/standard/StandardContentState'
import { useAuth } from './useAuth'

export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'booting') {
    return (
      <AdminShell>
        <StandardContentState kind="loading" />
      </AdminShell>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

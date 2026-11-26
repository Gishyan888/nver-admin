import { Navigate, useLocation } from 'react-router-dom'
import { AdminLayout } from '../components/standard/AdminLayout'
import { useAuth } from './useAuth'

export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'booting') {
    return <AdminLayout boot />
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <AdminLayout />
}

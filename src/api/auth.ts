import { apiRequest, refreshOnce } from './client'
import type { AdminLoginResponse, AdminRefreshResponse } from './types'

export async function loginAdmin(email: string, password: string) {
  return apiRequest<AdminLoginResponse>('/api/v1/admin/auth/login', {
    method: 'POST',
    auth: false,
    skipRefresh: true,
    body: { email, password },
  })
}

export async function refreshAdminSession() {
  return refreshOnce()
}

export async function logoutAdmin() {
  return apiRequest<void>('/api/v1/admin/auth/logout', {
    method: 'POST',
    skipRefresh: true,
  })
}

export type { AdminLoginResponse, AdminRefreshResponse }

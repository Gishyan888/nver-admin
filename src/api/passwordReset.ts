import { apiRequest } from './client'

export async function sendPasswordResetCode(email: string) {
  return apiRequest<{ email: string }>('/api/v1/auth/password-reset/code', {
    method: 'POST',
    auth: false,
    skipRefresh: true,
    body: { email },
  })
}

export async function checkPasswordResetCode(email: string, code: string) {
  return apiRequest<void>('/api/v1/auth/password-reset/check-code', {
    method: 'POST',
    auth: false,
    skipRefresh: true,
    body: { email, code },
  })
}

export async function saveNewPassword(
  email: string,
  code: string,
  newPassword: string,
) {
  return apiRequest<void>('/api/v1/auth/password-reset/new-password', {
    method: 'POST',
    auth: false,
    skipRefresh: true,
    body: { email, code, newPassword },
  })
}

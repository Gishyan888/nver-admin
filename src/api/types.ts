export type ApiErrorBody = {
  statusCode: number
  code: string
  message: string
  details?: Record<string, unknown> | null
  requestId?: string
  path?: string
  timestamp?: string
}

export type AdminUser = {
  id: string
  fullName: string
  email: string
}

export type AdminLoginResponse = {
  accessToken: string
  accessTokenExpiresIn: number
  user: AdminUser
}

export type AdminRefreshResponse = {
  accessToken: string
  accessTokenExpiresIn: number
}

export class ApiError extends Error {
  readonly statusCode: number
  readonly code: string
  readonly details: Record<string, unknown> | null
  readonly body: ApiErrorBody | null

  constructor(statusCode: number, body: ApiErrorBody | null) {
    super(body?.message ?? `Request failed with status ${statusCode}`)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = body?.code ?? 'UNKNOWN'
    this.details = body?.details ?? null
    this.body = body
  }
}

export class NetworkError extends Error {
  constructor() {
    super('No internet connection')
    this.name = 'NetworkError'
  }
}

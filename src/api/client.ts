import { ApiError, NetworkError, type ApiErrorBody } from './types'

/** Empty string = same origin (Vite proxy in local dev). */
const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
).replace(/\/$/, '')

type TokenStore = {
  getAccessToken: () => string | null
  setAccessToken: (token: string | null) => void
  onSessionInvalid: () => void
}

let tokenStore: TokenStore = {
  getAccessToken: () => null,
  setAccessToken: () => {},
  onSessionInvalid: () => {},
}

let refreshPromise: Promise<boolean> | null = null

export function configureApiClient(store: TokenStore) {
  tokenStore = store
}

function isOnline() {
  return typeof navigator === 'undefined' ? true : navigator.onLine
}

async function parseErrorBody(response: Response): Promise<ApiErrorBody | null> {
  try {
    return (await response.json()) as ApiErrorBody
  } catch {
    return null
  }
}

async function refreshAccessToken(): Promise<boolean> {
  if (!isOnline()) {
    throw new NetworkError()
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      const body = await parseErrorBody(response)
      if (body?.code === 'SESSION_INVALID' || response.status === 401) {
        tokenStore.setAccessToken(null)
        tokenStore.onSessionInvalid()
        return false
      }
      throw new ApiError(response.status, body)
    }

    const data = (await response.json()) as { accessToken: string }
    tokenStore.setAccessToken(data.accessToken)
    return true
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    if (!isOnline()) {
      throw new NetworkError()
    }
    throw new NetworkError()
  }
}

async function refreshOnce(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

export type RequestOptions = {
  method?: string
  body?: unknown
  auth?: boolean
  /** Skip the single refresh+retry on 401 UNAUTHORIZED */
  skipRefresh?: boolean
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!isOnline()) {
    throw new NetworkError()
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (options.auth !== false) {
    const token = tokenStore.getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      credentials: 'include',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new NetworkError()
  }

  if (
    response.status === 401 &&
    options.auth !== false &&
    !options.skipRefresh
  ) {
    const body = await parseErrorBody(response)
    if (body?.code === 'UNAUTHORIZED' || body?.code === undefined) {
      const refreshed = await refreshOnce()
      if (refreshed) {
        return apiRequest<T>(path, { ...options, skipRefresh: true })
      }
      throw new ApiError(401, body ?? { statusCode: 401, code: 'SESSION_INVALID', message: '' })
    }
    if (body?.code === 'SESSION_INVALID') {
      tokenStore.setAccessToken(null)
      tokenStore.onSessionInvalid()
    }
    throw new ApiError(response.status, body)
  }

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorBody(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export { refreshOnce }

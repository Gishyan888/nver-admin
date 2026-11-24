import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { loginAdmin, logoutAdmin, refreshAdminSession } from '../api/auth'
import { configureApiClient } from '../api/client'
import { ApiError, NetworkError } from '../api/types'
import { AuthContext, type AuthStatus } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('booting')
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const accessTokenRef = useRef<string | null>(null)

  const markAnonymous = useCallback(() => {
    accessTokenRef.current = null
    setAccessToken(null)
    setStatus('anonymous')
  }, [])

  useEffect(() => {
    configureApiClient({
      getAccessToken: () => accessTokenRef.current,
      setAccessToken: (token) => {
        accessTokenRef.current = token
        setAccessToken(token)
        if (token) {
          setStatus('authenticated')
        }
      },
      onSessionInvalid: markAnonymous,
    })
  }, [markAnonymous])

  useEffect(() => {
    let cancelled = false

    async function restore() {
      try {
        const ok = await refreshAdminSession()
        if (cancelled) {
          return
        }
        if (!ok) {
          setStatus('anonymous')
        }
      } catch {
        if (cancelled) {
          return
        }
        setStatus('anonymous')
      }
    }

    void restore()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginAdmin(email, password)
    accessTokenRef.current = result.accessToken
    setAccessToken(result.accessToken)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutAdmin()
    } catch (error) {
      if (!(error instanceof ApiError || error instanceof NetworkError)) {
        throw error
      }
    } finally {
      markAnonymous()
    }
  }, [markAnonymous])

  const value = useMemo(
    () => ({ status, accessToken, login, logout, markAnonymous }),
    [status, accessToken, login, logout, markAnonymous],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

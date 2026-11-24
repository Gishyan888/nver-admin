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

  /** Clears the session only after a successful logout (T-10-10). */
  const logout = useCallback(async () => {
    await logoutAdmin()
    markAnonymous()
  }, [markAnonymous])

  const value = useMemo(
    () => ({ status, accessToken, login, logout, markAnonymous }),
    [status, accessToken, login, logout, markAnonymous],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

import { createContext } from 'react'

export type AuthStatus = 'booting' | 'authenticated' | 'anonymous'

export type AuthContextValue = {
  status: AuthStatus
  accessToken: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  markAnonymous: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

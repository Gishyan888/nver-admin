import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ApiError, NetworkError } from '../api/types'
import { useAuth } from '../auth/useAuth'
import { AuthPageFrame, PageState } from '../components/standard/PageState'

const EMAIL_MAX = 254
const PASSWORD_MAX = 128

type FieldErrors = {
  email?: string
  password?: string
}

type PageOverlay = 'none' | 'loading' | 'error' | 'offline'

function fieldErrorFromDetails(
  details: Record<string, unknown> | null,
  field: 'email' | 'password',
): string | undefined {
  if (!details) {
    return undefined
  }
  const value = details[field]
  if (typeof value === 'string' && value.length > 0) {
    return value
  }
  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0]
  }
  return undefined
}

export function LoginPage() {
  const { status, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [credentialsError, setCredentialsError] = useState(false)
  const [overlay, setOverlay] = useState<PageOverlay>('none')

  if (status === 'booting') {
    return (
      <AuthPageFrame>
        <PageState kind="loading" loginShape />
      </AuthPageFrame>
    )
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (email.trim().length === 0) {
      nextErrors.email = 'Enter your e-mail.'
    }
    if (password.length === 0) {
      nextErrors.password = 'Enter your password.'
    }

    setCredentialsError(false)
    setFieldErrors(nextErrors)

    if (nextErrors.email || nextErrors.password) {
      return
    }

    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }

    setOverlay('loading')

    try {
      await login(email.trim(), password)
      navigate('/', { replace: true })
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }

      if (error instanceof ApiError) {
        if (error.code === 'INVALID_CREDENTIALS') {
          setOverlay('none')
          setCredentialsError(true)
          setFieldErrors({})
          return
        }

        if (error.code === 'VALIDATION_FAILED') {
          setOverlay('none')
          setFieldErrors({
            email: fieldErrorFromDetails(error.details, 'email'),
            password: fieldErrorFromDetails(error.details, 'password'),
          })
          return
        }

        // 403 FORBIDDEN, 429 TOO_MANY_REQUESTS, and any other refusal
        setOverlay('error')
        return
      }

      setOverlay('error')
    }
  }

  if (overlay === 'loading') {
    return (
      <AuthPageFrame>
        <PageState kind="loading" loginShape />
      </AuthPageFrame>
    )
  }

  if (overlay === 'error' || overlay === 'offline') {
    return (
      <AuthPageFrame>
        <PageState kind={overlay === 'offline' ? 'offline' : 'error'} />
      </AuthPageFrame>
    )
  }

  const emailInvalid = Boolean(fieldErrors.email) || credentialsError
  const passwordInvalid = Boolean(fieldErrors.password) || credentialsError

  return (
    <AuthPageFrame>
      <form
        noValidate
        onSubmit={onSubmit}
        className="flex w-full max-w-[400px] flex-col gap-6 rounded-xl border border-border-default bg-bg-default p-8"
      >
        <h1 className="w-full text-2xl font-semibold leading-8 text-text-primary">
          Log in
        </h1>

        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="login-email"
              className="w-full text-sm font-medium leading-5 text-text-primary"
            >
              E-mail
            </label>
            <input
              id="login-email"
              name="email"
              type="text"
              autoComplete="username"
              inputMode="email"
              maxLength={EMAIL_MAX}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value.slice(0, EMAIL_MAX))
                if (fieldErrors.email || credentialsError) {
                  setFieldErrors((current) => ({ ...current, email: undefined }))
                  setCredentialsError(false)
                }
              }}
              className={`h-12 w-full rounded-lg border bg-bg-default px-4 text-base leading-6 text-text-primary outline-none ${
                emailInvalid
                  ? 'border-danger-default'
                  : 'border-border-default'
              }`}
            />
            {fieldErrors.email ? (
              <p className="w-full text-xs leading-4 text-danger-default">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="login-password"
              className="w-full text-sm font-medium leading-5 text-text-primary"
            >
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              maxLength={PASSWORD_MAX}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value.slice(0, PASSWORD_MAX))
                if (fieldErrors.password || credentialsError) {
                  setFieldErrors((current) => ({
                    ...current,
                    password: undefined,
                  }))
                  setCredentialsError(false)
                }
              }}
              className={`h-12 w-full rounded-lg border bg-bg-default px-4 text-base leading-6 text-text-primary outline-none ${
                passwordInvalid
                  ? 'border-danger-default'
                  : 'border-border-default'
              }`}
            />
            {fieldErrors.password ? (
              <p className="w-full text-xs leading-4 text-danger-default">
                {fieldErrors.password}
              </p>
            ) : null}
            {credentialsError ? (
              <p className="w-full text-xs leading-4 text-danger-default">
                Wrong e-mail or password.
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-bg-inverse text-base font-medium leading-6 text-text-on-accent"
        >
          Log in
        </button>

        <Link
          to="/forgot-password"
          className="w-full text-center text-sm font-medium leading-5 text-accent-default"
        >
          Forgot password
        </Link>
      </form>
    </AuthPageFrame>
  )
}

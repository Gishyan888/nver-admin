import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { AuthPageFrame, PageState } from '../components/standard/PageState'

/** Stub until T-00-13 — "Forgot password" in the admin panel. */
export function ForgotPasswordPlaceholder() {
  const { status } = useAuth()

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

  return (
    <AuthPageFrame>
      <div className="flex w-full max-w-[400px] flex-col gap-6 rounded-xl border border-border-default bg-bg-default p-8">
        <h1 className="text-2xl font-semibold leading-8 text-text-primary">
          Forgot password
        </h1>
        <p className="text-sm leading-5 text-text-primary">
          This flow is built in T-00-13.
        </p>
        <Link
          to="/login"
          className="text-center text-sm font-medium leading-5 text-accent-default"
        >
          Back to log in
        </Link>
      </div>
    </AuthPageFrame>
  )
}

import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  checkPasswordResetCode,
  saveNewPassword,
  sendPasswordResetCode,
} from '../api/passwordReset'
import { ApiError, NetworkError } from '../api/types'
import { useAuth } from '../auth/useAuth'
import { CodeDigitInputs } from '../components/CodeDigitInputs'
import { AuthPageFrame, PageState } from '../components/standard/PageState'
import { fieldErrorFromDetails, isEmailInValidForm } from '../lib/fieldErrors'

const EMAIL_MAX = 254
const PASSWORD_MAX = 128
const DIDNT_GET_CODE = 'Didn\u2019t get the code?'

type Step = 'email' | 'code' | 'password'
type PageOverlay = 'none' | 'loading' | 'error' | 'offline'

export function ForgotPasswordPage() {
  const { status } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | undefined>()
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string | undefined>()
  const [codeSentAgain, setCodeSentAgain] = useState(false)
  const [verifiedCode, setVerifiedCode] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | undefined>()
  const [overlay, setOverlay] = useState<PageOverlay>('none')
  const checkingCodeRef = useRef(false)

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

  function showStandardFailure(error: unknown) {
    if (error instanceof NetworkError) {
      setOverlay('offline')
      return
    }
    setOverlay('error')
  }

  async function onSendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = email.trim()

    if (trimmed.length === 0) {
      setEmailError('Enter your e-mail.')
      return
    }
    if (!isEmailInValidForm(trimmed)) {
      setEmailError('Enter a valid e-mail address.')
      return
    }

    setEmailError(undefined)

    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }

    setOverlay('loading')
    try {
      const result = await sendPasswordResetCode(trimmed)
      setEmail(result.email)
      setCode('')
      setCodeError(undefined)
      setCodeSentAgain(false)
      setVerifiedCode(null)
      setOverlay('none')
      setStep('code')
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'ACCOUNT_NOT_FOUND') {
          setOverlay('none')
          setEmailError('No account with this e-mail.')
          return
        }
        if (error.code === 'VALIDATION_FAILED') {
          setOverlay('none')
          setEmailError(
            fieldErrorFromDetails(error.details, 'email') ??
              'Enter a valid e-mail address.',
          )
          return
        }
      }
      showStandardFailure(error)
    }
  }

  async function onSendAgain() {
    setCodeError(undefined)
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }

    setOverlay('loading')
    try {
      await sendPasswordResetCode(email)
      setCode('')
      setCodeSentAgain(true)
      setVerifiedCode(null)
      setOverlay('none')
    } catch (error) {
      if (error instanceof ApiError && error.code === 'ACCOUNT_NOT_FOUND') {
        setOverlay('none')
        setStep('email')
        setEmailError('No account with this e-mail.')
        return
      }
      showStandardFailure(error)
    }
  }

  async function verifyCode(nextCode: string) {
    if (checkingCodeRef.current || nextCode.length !== 6) {
      return
    }
    checkingCodeRef.current = true
    setCodeError(undefined)

    if (!navigator.onLine) {
      checkingCodeRef.current = false
      setOverlay('offline')
      return
    }

    setOverlay('loading')
    try {
      await checkPasswordResetCode(email, nextCode)
      setVerifiedCode(nextCode)
      setPassword('')
      setPasswordError(undefined)
      setOverlay('none')
      setStep('password')
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'CODE_WRONG') {
          setOverlay('none')
          setCodeError('Wrong code. Try again.')
          return
        }
        if (error.code === 'CODE_NO_LONGER_VALID') {
          setOverlay('none')
          setCodeError('This code no longer works. Send a new code.')
          return
        }
        if (error.code === 'ACCOUNT_NOT_FOUND') {
          setOverlay('none')
          setStep('email')
          setEmailError('No account with this e-mail.')
          return
        }
        if (error.code === 'VALIDATION_FAILED') {
          setOverlay('none')
          setCodeError(
            fieldErrorFromDetails(error.details, 'code') ??
              'Wrong code. Try again.',
          )
          return
        }
      }
      showStandardFailure(error)
    } finally {
      checkingCodeRef.current = false
    }
  }

  async function onSavePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (password.length === 0) {
      setPasswordError('Enter a password.')
      return
    }
    if (password.length < 8) {
      setPasswordError('The password must have at least 8 characters.')
      return
    }

    setPasswordError(undefined)
    const codeToSend = verifiedCode
    if (!codeToSend) {
      setStep('code')
      setCodeError('This code no longer works. Send a new code.')
      return
    }

    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }

    setOverlay('loading')
    try {
      await saveNewPassword(email, codeToSend, password)
      navigate('/login', { replace: true, state: { passwordSaved: true } })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'VALIDATION_FAILED') {
          setOverlay('none')
          setPasswordError(
            fieldErrorFromDetails(error.details, 'newPassword') ??
              'The password must have at least 8 characters.',
          )
          return
        }
        // CODE_NO_LONGER_VALID on new-password is still to be drawn — standard state
      }
      showStandardFailure(error)
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

  if (step === 'email') {
    return (
      <AuthPageFrame>
        <form
          noValidate
          onSubmit={onSendCode}
          className="flex w-full max-w-[400px] flex-col gap-6 rounded-xl border border-border-default bg-bg-default p-8"
        >
          <h1 className="w-full text-2xl font-semibold leading-8 text-text-primary">
            Forgot password
          </h1>

          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="reset-email"
              className="w-full text-sm font-medium leading-5 text-text-primary"
            >
              E-mail
            </label>
            <input
              id="reset-email"
              name="email"
              type="text"
              autoComplete="username"
              inputMode="email"
              maxLength={EMAIL_MAX}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value.slice(0, EMAIL_MAX))
                if (emailError) {
                  setEmailError(undefined)
                }
              }}
              className={`h-12 w-full rounded-lg border bg-bg-default px-4 text-base leading-6 text-text-primary outline-none ${
                emailError ? 'border-danger-default' : 'border-border-default'
              }`}
            />
            {emailError ? (
              <p className="w-full text-xs leading-4 text-danger-default">
                {emailError}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-bg-inverse text-base font-medium leading-6 text-text-on-accent"
          >
            Send code
          </button>

          <Link
            to="/login"
            className="w-full text-center text-sm font-medium leading-5 text-accent-default"
          >
            Back to log in
          </Link>
        </form>
      </AuthPageFrame>
    )
  }

  if (step === 'code') {
    return (
      <AuthPageFrame>
        <div className="flex w-full max-w-[400px] flex-col gap-6 rounded-xl border border-border-default bg-bg-default p-8">
          <div className="flex w-full flex-col gap-2">
            <h1 className="w-full text-2xl font-semibold leading-8 text-text-primary">
              Enter the code
            </h1>
            <p className="w-full text-base leading-6 font-normal text-text-secondary">
              {`We sent a 6-digit code to ${email}.`}
            </p>
            {codeSentAgain ? (
              <p className="w-full text-sm leading-5 text-text-primary">
                A new code was sent to your e-mail.
              </p>
            ) : null}
          </div>

          <div className="flex w-full flex-col gap-2">
            <CodeDigitInputs
              value={code}
              invalid={Boolean(codeError)}
              onChange={(next) => {
                setCode(next)
                if (codeError) {
                  setCodeError(undefined)
                }
                if (next.length === 6) {
                  void verifyCode(next)
                }
              }}
            />
            {codeError ? (
              <p className="w-full text-xs leading-4 text-danger-default">
                {codeError}
              </p>
            ) : null}
          </div>

          <div className="flex gap-1 text-sm leading-5">
            <span className="font-normal text-text-secondary">
              {DIDNT_GET_CODE}
            </span>
            <button
              type="button"
              onClick={() => {
                void onSendAgain()
              }}
              className="cursor-pointer border-0 bg-transparent p-0 text-sm font-medium text-accent-default"
            >
              Send again
            </button>
          </div>
        </div>
      </AuthPageFrame>
    )
  }

  return (
    <AuthPageFrame>
      <form
        noValidate
        onSubmit={onSavePassword}
        className="flex w-full max-w-[400px] flex-col gap-6 rounded-xl border border-border-default bg-bg-default p-8"
      >
        <h1 className="w-full text-2xl font-semibold leading-8 text-text-primary">
          Set a new password
        </h1>

        <div className="flex w-full flex-col gap-2">
          <label
            htmlFor="reset-password"
            className="w-full text-sm font-medium leading-5 text-text-primary"
          >
            New password
          </label>
          <input
            id="reset-password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            maxLength={PASSWORD_MAX}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value.slice(0, PASSWORD_MAX))
              if (passwordError) {
                setPasswordError(undefined)
              }
            }}
            className={`h-12 w-full rounded-lg border bg-bg-default px-4 text-base leading-6 text-text-primary outline-none ${
              passwordError ? 'border-danger-default' : 'border-border-default'
            }`}
          />
          {passwordError ? (
            <p className="w-full text-xs leading-4 text-danger-default">
              {passwordError}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-bg-inverse text-base font-medium leading-6 text-text-on-accent"
        >
          Save password
        </button>
      </form>
    </AuthPageFrame>
  )
}

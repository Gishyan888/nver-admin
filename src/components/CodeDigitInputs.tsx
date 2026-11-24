import {
  useEffect,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react'

type CodeDigitInputsProps = {
  value: string
  onChange: (next: string) => void
  invalid?: boolean
  disabled?: boolean
}

const LENGTH = 6

export function CodeDigitInputs({
  value,
  onChange,
  invalid = false,
  disabled = false,
}: CodeDigitInputsProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const digits = Array.from({ length: LENGTH }, (_, index) => value[index] ?? '')

  useEffect(() => {
    if (disabled) {
      return
    }
    const focusIndex = Math.min(value.length, LENGTH - 1)
    inputsRef.current[focusIndex]?.focus()
  }, [value.length, disabled])

  function setDigit(index: number, digit: string) {
    const next = digits.slice()
    next[index] = digit
    onChange(next.join('').slice(0, LENGTH))
  }

  function onPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, LENGTH)
    if (pasted.length === 0) {
      return
    }
    onChange(pasted)
  }

  function onKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      event.preventDefault()
      setDigit(index - 1, '')
      inputsRef.current[index - 1]?.focus()
    }
  }

  return (
    <div className="flex gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputsRef.current[index] = node
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          value={digit}
          aria-label={`Digit ${index + 1}`}
          onPaste={onPaste}
          onKeyDown={(event) => onKeyDown(index, event)}
          onChange={(event) => {
            const nextDigit = event.target.value.replace(/\D/g, '').slice(-1)
            if (!nextDigit) {
              setDigit(index, '')
              return
            }
            setDigit(index, nextDigit)
            if (index < LENGTH - 1) {
              inputsRef.current[index + 1]?.focus()
            }
          }}
          className={`h-14 w-12 rounded-lg border bg-bg-default text-center text-xl font-semibold leading-7 text-text-primary outline-none ${
            invalid ? 'border-danger-default' : 'border-border-default'
          }`}
        />
      ))}
    </div>
  )
}

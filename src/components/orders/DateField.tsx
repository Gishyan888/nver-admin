import { useEffect, useRef, useState } from 'react'
import { DayCalendar } from './DayCalendar'

type DateFieldProps = {
  label: string
  valueLabel: string | null
  dayKey: string | null
  onChange: (dayKey: string | null, label: string | null) => void
}

export function DateField({
  label,
  valueLabel,
  dayKey,
  onChange,
}: DateFieldProps) {
  const [open, setOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(() => new Date(2026, 10, 1))
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    function onDoc(event: MouseEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div ref={rootRef} className="relative w-[208px]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-full cursor-pointer items-center justify-between rounded-lg border border-border-default bg-bg-default px-4 text-left"
      >
        <span
          className={`text-base leading-6 ${
            valueLabel ? 'text-text-primary' : 'text-text-secondary'
          }`}
        >
          {valueLabel ?? label}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          className="shrink-0 text-text-secondary"
        >
          <rect
            x="2"
            y="3"
            width="12"
            height="11"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M2 6.5h12M5 1.5v3M11 1.5v3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open ? (
        <DayCalendar
          viewMonth={viewMonth}
          selectedDay={dayKey}
          onViewMonthChange={setViewMonth}
          onSelectDay={(key, display) => {
            onChange(key, display)
            setOpen(false)
          }}
        />
      ) : null}
    </div>
  )
}

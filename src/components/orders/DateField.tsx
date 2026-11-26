import { useEffect, useRef, useState } from 'react'
import { IconCalendar } from '../icons/FigmaIcons'
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
    <div ref={rootRef} className="relative w-[208px] shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-lg border border-border-default bg-bg-default px-4 text-left"
      >
        <span
          className={`min-w-0 flex-1 text-base leading-6 ${
            valueLabel ? 'text-text-primary' : 'text-text-secondary'
          }`}
        >
          {valueLabel ?? label}
        </span>
        <IconCalendar className="shrink-0 text-text-secondary" />
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

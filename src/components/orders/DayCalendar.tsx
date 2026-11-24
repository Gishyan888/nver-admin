import { useMemo } from 'react'
import { formatReviewSentDay } from '../../lib/formatDateTime'
import { localDayKey } from './filterOrders'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const

type DayCalendarProps = {
  /** Currently shown month (any day in that month). */
  viewMonth: Date
  selectedDay: string | null
  onViewMonthChange: (month: Date) => void
  onSelectDay: (dayKey: string, label: string) => void
}

function startOfCalendarGrid(viewMonth: Date): Date {
  const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
  const mondayOffset = (first.getDay() + 6) % 7
  const start = new Date(first)
  start.setDate(first.getDate() - mondayOffset)
  return start
}

export function DayCalendar({
  viewMonth,
  selectedDay,
  onViewMonthChange,
  onSelectDay,
}: DayCalendarProps) {
  const cells = useMemo(() => {
    const start = startOfCalendarGrid(viewMonth)
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start)
      day.setDate(start.getDate() + index)
      return day
    })
  }, [viewMonth])

  const title = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(viewMonth)

  return (
    <div className="absolute top-full left-0 z-20 mt-1 w-[280px] rounded-lg border border-border-default bg-bg-default p-3 shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() =>
            onViewMonthChange(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
            )
          }
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-text-primary"
        >
          ‹
        </button>
        <p className="text-sm font-medium leading-5 text-text-primary">{title}</p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() =>
            onViewMonthChange(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
            )
          }
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-text-primary"
        >
          ›
        </button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((label) => (
          <span
            key={label}
            className="text-center text-xs leading-4 text-text-secondary"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day) => {
          const key = localDayKey(day)
          const inMonth = day.getMonth() === viewMonth.getMonth()
          const selected = selectedDay === key
          return (
            <button
              key={key + String(day.getTime())}
              type="button"
              onClick={() => {
                const noon = new Date(
                  day.getFullYear(),
                  day.getMonth(),
                  day.getDate(),
                  12,
                )
                onSelectDay(key, formatReviewSentDay(noon.toISOString()))
              }}
              className={`flex h-8 cursor-pointer items-center justify-center rounded-md text-sm leading-5 ${
                selected
                  ? 'bg-bg-inverse text-text-on-accent'
                  : inMonth
                    ? 'text-text-primary hover:bg-bg-muted'
                    : 'text-text-tertiary hover:bg-bg-muted'
              }`}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

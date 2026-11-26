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
    <div className="absolute top-full left-0 z-20 mt-1 w-[308px] rounded-lg border border-border-default bg-bg-default p-4 shadow-md">
      <div className="mb-3 flex h-8 items-center justify-between">
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="mb-1 flex gap-1">
        {WEEKDAYS.map((label) => (
          <span
            key={label}
            className="flex h-5 w-9 items-start justify-center text-xs font-medium leading-4 text-text-secondary"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {Array.from({ length: 6 }, (_, week) => (
          <div key={week} className="flex gap-1">
            {cells.slice(week * 7, week * 7 + 7).map((day) => {
              const key = localDayKey(day)
              const inMonth = day.getMonth() === viewMonth.getMonth()
              const selected = selectedDay === key
              if (!inMonth) {
                return (
                  <div
                    key={key + String(day.getTime())}
                    className="size-9 rounded-lg"
                  />
                )
              }
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
                  className={`flex size-9 cursor-pointer items-center justify-center rounded-lg text-sm leading-5 ${
                    selected
                      ? 'bg-bg-inverse text-text-on-accent'
                      : 'text-text-primary hover:bg-bg-muted'
                  }`}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

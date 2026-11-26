import { useMemo } from 'react'
import { formatReviewSentDay } from '../../lib/formatDateTime'
import { IconChevronLeft, IconChevronRight } from '../icons/FigmaIcons'
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
    <div className="absolute top-full left-0 z-20 mt-1 flex w-[308px] shrink-0 flex-col gap-3 overflow-hidden rounded-lg border border-border-default bg-bg-default p-4 shadow-md">
      <div className="flex h-8 w-[276px] shrink-0 items-center justify-between overflow-hidden">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() =>
            onViewMonthChange(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
            )
          }
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-0 bg-transparent text-text-primary"
        >
          <IconChevronLeft />
        </button>
        <p className="shrink-0 text-sm font-medium leading-5 whitespace-nowrap text-text-primary">
          {title}
        </p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() =>
            onViewMonthChange(
              new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
            )
          }
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-0 bg-transparent text-text-primary"
        >
          <IconChevronRight />
        </button>
      </div>
      <div className="flex shrink-0 gap-1 overflow-hidden">
        {WEEKDAYS.map((label) => (
          <span
            key={label}
            className="flex h-5 w-9 shrink-0 items-start justify-center overflow-hidden text-xs font-medium leading-4 text-text-secondary"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="flex shrink-0 flex-col gap-1 overflow-hidden">
        {Array.from({ length: 6 }, (_, week) => (
          <div key={week} className="flex shrink-0 gap-1 overflow-hidden">
            {cells.slice(week * 7, week * 7 + 7).map((day) => {
              const key = localDayKey(day)
              const inMonth = day.getMonth() === viewMonth.getMonth()
              const selected = selectedDay === key
              if (!inMonth) {
                return (
                  <div
                    key={key + String(day.getTime())}
                    className="size-9 shrink-0 rounded-lg"
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
                  className={`flex size-9 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg text-sm leading-5 ${
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

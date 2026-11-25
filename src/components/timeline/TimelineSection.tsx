import { useCallback, useEffect, useState } from 'react'
import { getAdminGiftRequestStatus } from '../../api/giftRequestStatus'
import { ApiError, NetworkError } from '../../api/types'
import { formatBrowserDateTime } from '../../lib/formatDateTime'
import type { GiftRequestStatus } from '../../lib/giftRequestStatus'
import { StandardContentState } from '../standard/StandardContentState'
import { buildTimelineStages } from './buildTimelineStages'
import { timelineReachedAtFromApi } from './timelineFromApi'
import type {
  TimelineReachedAt,
  TimelineStageKind,
  TimelineStageView,
} from './types'

type SectionOverlay = 'none' | 'loading' | 'error' | 'offline'

type TimelineSectionProps = {
  giftRequestId: string
  status: GiftRequestStatus
  /**
   * Local updates after a status move (T-05-08 UI) and demo fixtures.
   * Merged over the API timeline so a move shows at once.
   */
  reachedAt?: TimelineReachedAt
  /** Skip the status API and use only `reachedAt` (frame demos). */
  fixturesOnly?: boolean
}

function StageDot({ kind }: { kind: TimelineStageKind }) {
  if (kind === 'current') {
    return (
      <span className="relative flex size-3 shrink-0 items-center justify-center">
        <span
          aria-hidden
          className="absolute size-5 rounded-full bg-accent-subtle"
        />
        <span
          aria-hidden
          className="relative size-3 rounded-full bg-accent-default"
        />
      </span>
    )
  }

  if (kind === 'canceled') {
    return (
      <span
        aria-hidden
        className="size-3 shrink-0 rounded-full bg-danger-default"
      />
    )
  }

  if (kind === 'ahead') {
    return (
      <span
        aria-hidden
        className="size-3 shrink-0 rounded-full border-2 border-border-default bg-bg-default"
      />
    )
  }

  return (
    <span
      aria-hidden
      className="size-3 shrink-0 rounded-full bg-text-primary"
    />
  )
}

function TimelineStageRow({
  stage,
  isLast,
}: {
  stage: TimelineStageView
  isLast: boolean
}) {
  const nameClass =
    stage.kind === 'ahead'
      ? 'text-sm font-medium leading-5 text-text-tertiary'
      : 'text-sm font-medium leading-5 text-text-primary'

  return (
    <div className="flex w-full items-start gap-3 overflow-hidden">
      <div className="flex w-3 shrink-0 flex-col items-center gap-1 self-stretch pt-1">
        <StageDot kind={stage.kind} />
        {!isLast && stage.line !== 'none' ? (
          <div
            aria-hidden
            className={`min-h-0 w-0.5 flex-1 ${
              stage.line === 'dark' ? 'bg-text-primary' : 'bg-border-default'
            }`}
          />
        ) : null}
      </div>
      <div
        className={`flex min-w-0 flex-1 flex-col items-start overflow-hidden ${
          isLast ? '' : 'pb-4'
        }`}
      >
        <p className={nameClass}>{stage.name}</p>
        {stage.reachedAt ? (
          <p className="text-xs leading-4 text-text-secondary">
            {formatBrowserDateTime(stage.reachedAt)}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function TimelineSection({
  giftRequestId,
  status,
  reachedAt = {},
  fixturesOnly = false,
}: TimelineSectionProps) {
  const [apiReachedAt, setApiReachedAt] = useState<TimelineReachedAt>({})
  const [overlay, setOverlay] = useState<SectionOverlay>(
    fixturesOnly ? 'none' : 'loading',
  )

  const load = useCallback(async () => {
    if (fixturesOnly) {
      setOverlay('none')
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setOverlay('loading')
    try {
      const result = await getAdminGiftRequestStatus(giftRequestId)
      setApiReachedAt(timelineReachedAtFromApi(result.timeline))
      setOverlay('none')
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      if (error instanceof ApiError) {
        setOverlay('error')
        return
      }
      setOverlay('error')
    }
  }, [fixturesOnly, giftRequestId])

  useEffect(() => {
    void load()
  }, [load])

  if (overlay === 'loading') {
    return (
      <div className="w-full max-w-[360px] rounded-lg border border-border-default bg-bg-default p-6">
        <StandardContentState kind="loading" />
      </div>
    )
  }

  if (overlay === 'error' || overlay === 'offline') {
    return (
      <div className="flex min-h-48 w-full max-w-[360px] flex-col rounded-lg border border-border-default bg-bg-default">
        <StandardContentState kind={overlay === 'offline' ? 'offline' : 'error'} />
      </div>
    )
  }

  const mergedReachedAt: TimelineReachedAt = {
    ...apiReachedAt,
    ...reachedAt,
  }
  const stages = buildTimelineStages(status, mergedReachedAt)

  return (
    <section className="flex w-full max-w-[360px] flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
      <h2 className="text-base font-semibold leading-6 text-text-primary">
        Timeline
      </h2>
      <div className="flex w-full flex-col items-start overflow-hidden">
        {stages.map((stage, index) => (
          <TimelineStageRow
            key={stage.name}
            stage={stage}
            isLast={index === stages.length - 1}
          />
        ))}
      </div>
    </section>
  )
}

import type { GiftRequestStatus } from '../../lib/giftRequestStatus'
import {
  TIMELINE_STAGES,
  type TimelineReachedAt,
  type TimelineStageView,
} from './types'

/**
 * Builds the rows for the Timeline section from the current status and
 * reached-at times. No endpoint fields are assumed beyond what the card fixes.
 */
export function buildTimelineStages(
  status: GiftRequestStatus,
  reachedAt: TimelineReachedAt,
): TimelineStageView[] {
  if (status === 'Canceled') {
    const reachedRows: TimelineStageView[] = TIMELINE_STAGES.filter(
      (stage) => reachedAt[stage],
    ).map((stage) => ({
      name: stage,
      kind: 'reached',
      reachedAt: reachedAt[stage] ?? null,
      line: 'dark',
    }))

    return [
      ...reachedRows,
      {
        name: 'Canceled',
        kind: 'canceled',
        reachedAt: reachedAt.Canceled ?? null,
        line: 'none',
      },
    ]
  }

  const currentIndex = TIMELINE_STAGES.indexOf(
    status as (typeof TIMELINE_STAGES)[number],
  )
  if (currentIndex < 0) {
    return []
  }

  return TIMELINE_STAGES.map((stage, index) => {
    const isLast = index === TIMELINE_STAGES.length - 1
    let kind: TimelineStageView['kind']
    if (index < currentIndex) {
      kind = 'reached'
    } else if (index === currentIndex) {
      kind = 'current'
    } else {
      kind = 'ahead'
    }

    let line: TimelineStageView['line'] = 'none'
    if (!isLast) {
      // Dark up to the current stage; light grey after it.
      line = index < currentIndex ? 'dark' : 'light'
    }

    return {
      name: stage,
      kind,
      reachedAt: kind === 'ahead' ? null : (reachedAt[stage] ?? null),
      line,
    }
  })
}

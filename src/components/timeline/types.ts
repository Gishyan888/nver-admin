import type { GiftRequestStatus } from '../../lib/giftRequestStatus'

/** Stages on the timeline in fixed order (Canceled is separate). */
export const TIMELINE_STAGES = [
  'Registered',
  'In Progress',
  'Approved',
  'Preparing',
  'Ready for Pickup',
  'Completed',
] as const satisfies readonly GiftRequestStatus[]

export type TimelineStageName = (typeof TIMELINE_STAGES)[number]

/** ISO 8601 reached-at per stage; UI model until T-05-05 Result. */
export type TimelineReachedAt = Partial<Record<GiftRequestStatus, string>>

export type TimelineStageKind = 'reached' | 'current' | 'ahead' | 'canceled'

export type TimelineStageView = {
  name: GiftRequestStatus
  kind: TimelineStageKind
  reachedAt: string | null
  /** Connector under this stage; omitted on the last row. */
  line: 'dark' | 'light' | 'none'
}

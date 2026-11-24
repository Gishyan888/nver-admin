import type { GiftRequestStatus } from '../../lib/giftRequestStatus'
import type { TimelineReachedAt } from './types'

/**
 * Frame fixtures (114:1798 Preparing, 114:1841 Canceled).
 * ISO moments are chosen so formatBrowserDateTime matches the frame text in UTC;
 * other browser time zones shift the display (correct per T-05-09).
 */
export const DEMO_TIMELINE_PREPARING: {
  status: GiftRequestStatus
  reachedAt: TimelineReachedAt
} = {
  status: 'Preparing',
  reachedAt: {
    Registered: '2026-11-22T10:12:00.000Z',
    'In Progress': '2026-11-22T11:40:00.000Z',
    Approved: '2026-11-23T09:05:00.000Z',
    Preparing: '2026-11-23T16:20:00.000Z',
  },
}

export const DEMO_TIMELINE_CANCELED: {
  status: GiftRequestStatus
  reachedAt: TimelineReachedAt
} = {
  status: 'Canceled',
  reachedAt: {
    Registered: '2026-11-22T10:12:00.000Z',
    'In Progress': '2026-11-22T11:40:00.000Z',
    Approved: '2026-11-23T09:05:00.000Z',
    Canceled: '2026-11-23T18:45:00.000Z',
  },
}

export const DEMO_TIMELINE_IN_PROGRESS: {
  status: GiftRequestStatus
  reachedAt: TimelineReachedAt
} = {
  status: 'In Progress',
  reachedAt: {
    Registered: '2026-11-22T10:12:00.000Z',
    'In Progress': '2026-11-22T11:40:00.000Z',
  },
}

export function demoTimelineForQuery(
  demo: string | null,
): { status: GiftRequestStatus; reachedAt: TimelineReachedAt } | null {
  if (demo === 'timeline') {
    return DEMO_TIMELINE_PREPARING
  }
  if (demo === 'timeline-canceled') {
    return DEMO_TIMELINE_CANCELED
  }
  if (demo === 'timeline-in-progress') {
    return DEMO_TIMELINE_IN_PROGRESS
  }
  return null
}

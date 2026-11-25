import type { ApiTimelineEntry } from '../../api/giftRequestStatus'
import { giftRequestStatusFromApi } from '../../lib/giftRequestStatus'
import type { TimelineReachedAt } from './types'

export function timelineReachedAtFromApi(
  timeline: ApiTimelineEntry[],
): TimelineReachedAt {
  const reached: TimelineReachedAt = {}
  for (const entry of timeline) {
    const label = giftRequestStatusFromApi(entry.status)
    if (label) {
      reached[label] = entry.reachedAt
    }
  }
  return reached
}

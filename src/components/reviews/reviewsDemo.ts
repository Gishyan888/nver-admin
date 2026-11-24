import type { AdminReview } from './types'

const TEXTS = [
  'Beautiful gift and lovely wrapping. My wife was speechless.',
  'Exactly what I hoped for — thank you.',
  null,
  'The concierge really listened.',
  'Too slow!!! Call me back at once...',
  'Perfect for our anniversary.',
  'Would use Nvér again.',
  null,
  'Thoughtful and on time.',
  'The best anniversary gift we have given.',
]

const NAMES = [
  'James Miller',
  'Nare Abrahamyan',
  'Anna Petrosyan',
  'Lilit Sargsyan',
  'Emma Wilson',
  'David Brown',
  'Samvel Aslanyan',
  'Maria Garcia',
  'Hayk Grigoryan',
  'Sophie Martin',
]

function dayIso(day: number): string {
  const dd = String(day).padStart(2, '0')
  return `2026-11-${dd}T12:00:00.000Z`
}

/** 25 fixtures so page 2 appears; waiting first after sort. */
export function buildDemoReviews(): AdminReview[] {
  const items: AdminReview[] = []
  for (let i = 0; i < 25; i += 1) {
    const orderNum = 10120 - i
    const state =
      i < 3 ? 'Waiting' : i === 4 ? 'Rejected' : ('Approved' as const)
    items.push({
      id: `demo-review-${i + 1}`,
      customerName: NAMES[i % NAMES.length],
      orderId: `NV-${orderNum}`,
      giftRequestId: `demo-gr-${orderNum}`,
      rating: ([5, 4, 5, 3, 2, 5, 4, 5, 3, 5] as const)[i % 10],
      text: TEXTS[i % TEXTS.length],
      sentAt: dayIso(24 - (i % 20)),
      state,
    })
  }
  return items
}

export const DEMO_ORDER_REVIEW_WAITING: AdminReview = {
  id: 'demo-order-review',
  customerName: 'James Miller',
  orderId: 'NV-10109',
  giftRequestId: 'demo-gr-10109',
  rating: 5,
  text: 'Beautiful gift and lovely wrapping. My wife was speechless.',
  sentAt: '2026-11-24T12:00:00.000Z',
  state: 'Waiting',
}

export const DEMO_ORDER_REVIEW_APPROVED: AdminReview = {
  ...DEMO_ORDER_REVIEW_WAITING,
  id: 'demo-order-review-approved',
  state: 'Approved',
}

export const DEMO_ORDER_REVIEW_REJECTED: AdminReview = {
  ...DEMO_ORDER_REVIEW_WAITING,
  id: 'demo-order-review-rejected',
  state: 'Rejected',
  text: null,
}

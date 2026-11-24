import type { OrderDetailsDemo } from './types'

export const DEMO_ORDER_DETAILS_PAID: OrderDetailsDemo = {
  orderId: 'NV-10114',
  giftRequestId: 'demo-gr-10114',
  customerName: 'Sofia Martirosyan',
  status: 'Preparing',
  createdAt: '2026-11-22T12:00:00.000Z',
  request: {
    occasion: 'Anniversary',
    dateOfOccasion: '12 December 2026',
    recipient: 'Partner',
    age: '38',
    gender: 'Male',
    whatTheyLike:
      'Fine watches, jazz, single malt whisky and long walks in the mountains.',
    hobbies: 'Photography and cooking Italian food.',
    whatToAvoid: 'Anything with a strong scent. He does not wear rings.',
    inspirationText:
      'A leather watch roll from Florence, with space for three watches.',
    inspirationPhotos: ['', '', ''],
    inspirationLinks: [
      { label: 'example.com/leather-watch-roll', href: 'https://example.com/leather-watch-roll' },
      { label: 'example.com/jazz-records', href: 'https://example.com/jazz-records' },
    ],
  },
  tier: 'Signature',
  payment: {
    kind: 'paid',
    amountUsd: 1250,
    paidOn: '2026-11-23T12:00:00.000Z',
  },
}

export const DEMO_ORDER_DETAILS_NEW: OrderDetailsDemo = {
  orderId: 'NV-10120',
  giftRequestId: 'demo-gr-10120',
  customerName: 'Anna Petrosyan',
  status: 'Registered',
  createdAt: '2026-11-24T12:00:00.000Z',
  request: {
    occasion: 'Birthday',
    dateOfOccasion: '12 December 2026',
    recipient: 'Partner',
    age: '31',
    gender: null,
    whatTheyLike: 'Ceramics, modern art and good coffee.',
    hobbies: null,
    whatToAvoid: null,
    inspirationText: null,
    inspirationPhotos: [],
    inspirationLinks: [],
  },
  tier: 'Classic',
  payment: { kind: 'not-yet' },
}

export function tierBudgetLine(tier: OrderDetailsDemo['tier']): string {
  if (tier === 'Classic') {
    return 'Classic Up to $1,000'
  }
  if (tier === 'Signature') {
    return 'Signature $1,000 to $3,000'
  }
  // Prestige budget text is not decided on the card.
  return 'Prestige'
}

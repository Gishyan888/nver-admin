import type { GiftRequestStatus } from '../../lib/giftRequestStatus'

export type GiftingTier = 'Classic' | 'Signature' | 'Prestige'

export type PaymentState =
  | { kind: 'not-yet' }
  | { kind: 'paid'; amountUsd: number; paidOn: string }
  | {
      kind: 'refunded'
      amountUsd: number
      paidOn: string
      refundedOn: string
    }
  | { kind: 'refund-failed' }

export type OrderRequestAnswers = {
  occasion: string
  dateOfOccasion: string
  recipient: string
  age: string
  gender: string | null
  whatTheyLike: string
  hobbies: string | null
  whatToAvoid: string | null
  inspirationText: string | null
  inspirationPhotos: string[]
  inspirationLinks: { label: string; href: string }[]
}

export type OrderDetailsDemo = {
  orderId: string
  giftRequestId: string
  customerName: string
  status: GiftRequestStatus
  createdAt: string
  request: OrderRequestAnswers
  tier: GiftingTier
  payment: PaymentState
}

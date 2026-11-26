import type { ApiAdminGiftRequestDetails } from '../../api/giftRequests'
import { giftRequestStatusFromApi } from '../../lib/giftRequestStatus'
import type {
  GiftingTier,
  OrderDetailsDemo,
  OrderRequestAnswers,
  PaymentState,
} from './types'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

function titleCaseLabel(value: string): string {
  return value
    .trim()
    .replace(/_/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

function displayChoice(value: string, other: string | null): string {
  const normalized = value.trim().toLowerCase().replace(/_/g, ' ')
  if (normalized === 'other' && other?.trim()) {
    return other.trim()
  }
  return titleCaseLabel(value)
}

/** Format API occasionDate (YYYY-MM-DD) without timezone shift. */
export function formatOccasionDate(ymd: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim())
  if (!match) {
    return ymd
  }
  const year = Number(match[1])
  const monthIndex = Number(match[2]) - 1
  const day = Number(match[3])
  if (monthIndex < 0 || monthIndex > 11 || day < 1 || day > 31) {
    return ymd
  }
  return `${day} ${MONTHS[monthIndex]} ${year}`
}

export function giftingTierFromApi(value: string): GiftingTier | null {
  const key = value.trim().toLowerCase()
  if (key === 'classic') {
    return 'Classic'
  }
  if (key === 'signature') {
    return 'Signature'
  }
  if (key === 'prestige') {
    return 'Prestige'
  }
  return null
}

function paymentFromApi(
  payment: ApiAdminGiftRequestDetails['payment'],
): PaymentState {
  if (!payment) {
    return { kind: 'not-yet' }
  }
  const refund = payment.refund
  if (refund?.status === 'failed') {
    return { kind: 'refund-failed' }
  }
  if (refund?.status === 'succeeded' && refund.refundedAt) {
    return {
      kind: 'refunded',
      amountUsd: payment.amountUsd,
      paidOn: payment.paidAt,
      refundedOn: refund.refundedAt,
    }
  }
  return {
    kind: 'paid',
    amountUsd: payment.amountUsd,
    paidOn: payment.paidAt,
  }
}

function linkLabel(href: string): string {
  try {
    const url = new URL(href)
    return `${url.host}${url.pathname}`.replace(/\/$/, '') || href
  } catch {
    return href.replace(/^https?:\/\//, '')
  }
}

function requestFromApi(
  details: ApiAdminGiftRequestDetails,
): OrderRequestAnswers {
  return {
    occasion: displayChoice(details.occasion, details.occasionOther),
    dateOfOccasion: formatOccasionDate(details.occasionDate),
    recipient: displayChoice(
      details.recipientRelation,
      details.recipientRelationOther,
    ),
    age: String(details.recipientAge),
    gender: details.recipientGender
      ? titleCaseLabel(details.recipientGender)
      : null,
    whatTheyLike: details.likes ?? '',
    hobbies: details.hobbies,
    whatToAvoid: details.avoid,
    inspirationText: details.inspirationText,
    inspirationPhotos: details.photos.map((photo) => photo.url),
    inspirationLinks: details.inspirationLinks.slice(0, 3).map((href) => ({
      label: linkLabel(href),
      href,
    })),
  }
}

export type MappedOrderDetails = OrderDetailsDemo & {
  hasUnreadMessage: boolean
  pickupAddress: string | null
  pickupNote: string | null
}

export function orderDetailsFromApi(
  details: ApiAdminGiftRequestDetails,
): MappedOrderDetails | null {
  const status = giftRequestStatusFromApi(details.status)
  const tier = giftingTierFromApi(details.tier)
  if (!status || !tier) {
    return null
  }
  return {
    orderId: details.orderId,
    giftRequestId: details.id,
    customerName: details.customerName,
    status,
    createdAt: details.createdAt,
    request: requestFromApi(details),
    tier,
    payment: paymentFromApi(details.payment),
    hasUnreadMessage: details.hasUnreadMessage,
    pickupAddress: details.pickup?.address ?? null,
    pickupNote: details.pickup?.note ?? null,
  }
}

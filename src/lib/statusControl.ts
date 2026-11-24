import type { GiftRequestStatus } from './giftRequestStatus'

/** Next stage for the four admin moves by hand. */
export const MANUAL_NEXT_STATUS: Partial<
  Record<GiftRequestStatus, GiftRequestStatus>
> = {
  Registered: 'In Progress',
  Approved: 'Preparing',
  Preparing: 'Ready for Pickup',
  'Ready for Pickup': 'Completed',
}

export function nextManualStatus(
  status: GiftRequestStatus,
): GiftRequestStatus | null {
  return MANUAL_NEXT_STATUS[status] ?? null
}

export function moveButtonLabel(next: GiftRequestStatus): string {
  return `Move to ${next}`
}

export function moveQuestionTitle(next: GiftRequestStatus): string {
  return `Move this gift request to ${next}?`
}

export function canCancelGiftRequest(status: GiftRequestStatus): boolean {
  return (
    status === 'Registered' ||
    status === 'In Progress' ||
    status === 'Approved'
  )
}

/** Pickup address is shown from Ready for Pickup on, including Completed. */
export function showsPickupAddressContent(
  status: GiftRequestStatus,
): boolean {
  return (
    status === 'Ready for Pickup' ||
    status === 'Completed'
  )
}

/**
 * Canceled with no address: no "Pickup address" line (card rule; differs from frame).
 * Other early statuses: line with "Not yet".
 */
export function showsPickupAddressRow(
  status: GiftRequestStatus,
  hasPickupAddress: boolean,
): boolean {
  if (status === 'Canceled') {
    return hasPickupAddress
  }
  return true
}

export function canEditPickupAddress(status: GiftRequestStatus): boolean {
  return status === 'Ready for Pickup'
}

export const PICKUP_FIELD_MAX = 300

export const STATUS_PILL_CLASS: Record<GiftRequestStatus, string> = {
  Registered: 'bg-status-registered',
  'In Progress': 'bg-status-in-progress',
  Approved: 'bg-status-approved',
  Preparing: 'bg-status-preparing',
  'Ready for Pickup': 'bg-status-ready-for-pickup',
  Completed: 'bg-status-completed',
  Canceled: 'bg-status-canceled',
}

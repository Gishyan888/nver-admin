/** Status names from product/glossary.md */
export type GiftRequestStatus =
  | 'Registered'
  | 'In Progress'
  | 'Approved'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Completed'
  | 'Canceled'

const APPROVED_ONWARD: GiftRequestStatus[] = [
  'Approved',
  'Preparing',
  'Ready for Pickup',
  'Completed',
]

export function canManageGiftOptions(status: GiftRequestStatus): boolean {
  return status === 'In Progress'
}

/** From Approved on: read-only list, no count, Selected mark when paid. */
export function isGiftOptionsReadOnlyPaid(status: GiftRequestStatus): boolean {
  return APPROVED_ONWARD.includes(status)
}

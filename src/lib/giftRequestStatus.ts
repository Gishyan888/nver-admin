/** Status names from product/glossary.md */
export type GiftRequestStatus =
  | 'Registered'
  | 'In Progress'
  | 'Approved'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Completed'
  | 'Canceled'

/** API snake_case → glossary label (T-05-05). */
const API_STATUS_TO_LABEL: Record<string, GiftRequestStatus> = {
  registered: 'Registered',
  in_progress: 'In Progress',
  approved: 'Approved',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for Pickup',
  completed: 'Completed',
  canceled: 'Canceled',
}

export function giftRequestStatusFromApi(
  value: string,
): GiftRequestStatus | null {
  return API_STATUS_TO_LABEL[value] ?? null
}

const LABEL_TO_API_STATUS: Record<GiftRequestStatus, string> = {
  Registered: 'registered',
  'In Progress': 'in_progress',
  Approved: 'approved',
  Preparing: 'preparing',
  'Ready for Pickup': 'ready_for_pickup',
  Completed: 'completed',
  Canceled: 'canceled',
}

export function giftRequestStatusToApi(status: GiftRequestStatus): string {
  return LABEL_TO_API_STATUS[status]
}

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

import type { ApiAdminGiftRequestListItem } from '../../api/giftRequests'
import { giftRequestStatusFromApi } from '../../lib/giftRequestStatus'
import type { OrderListItem } from './types'

export function orderListItemFromApi(
  item: ApiAdminGiftRequestListItem,
): OrderListItem | null {
  const status = giftRequestStatusFromApi(item.status)
  if (!status) {
    return null
  }
  return {
    id: item.id,
    orderId: item.orderId,
    giftRequestId: item.id,
    customerName: item.customerName,
    status,
    createdAt: item.createdAt,
    hasUnreadCustomerMessage: item.hasUnreadMessage,
  }
}

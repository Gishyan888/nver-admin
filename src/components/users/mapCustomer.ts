import type {
  ApiAdminCustomerDetails,
  ApiAdminCustomerGiftRequest,
  ApiAdminCustomerListItem,
} from '../../api/customers'
import { giftRequestStatusFromApi } from '../../lib/giftRequestStatus'
import type { CustomerDemo, CustomerOrderItem, UserListItem } from './types'

export function userListItemFromApi(
  item: ApiAdminCustomerListItem,
): UserListItem {
  return {
    id: item.id,
    name: item.fullName,
    email: item.email,
    registeredAt: item.registeredAt,
    giftRequestCount: item.giftRequestCount,
  }
}

export function customerOrderFromApi(
  item: ApiAdminCustomerGiftRequest,
): CustomerOrderItem | null {
  const status = giftRequestStatusFromApi(item.status)
  if (!status) {
    return null
  }
  return {
    id: item.id,
    orderId: item.orderId,
    giftRequestId: item.id,
    status,
    createdAt: item.createdAt,
    hasUnreadCustomerMessage: item.hasUnreadMessage,
  }
}

export function customerFromApi(
  details: ApiAdminCustomerDetails,
): CustomerDemo | null {
  const orders = details.giftRequests
    .map(customerOrderFromApi)
    .filter((item): item is CustomerOrderItem => item !== null)
  return {
    id: details.id,
    name: details.fullName,
    email: details.email,
    orders,
  }
}

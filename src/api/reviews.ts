import { apiRequest } from './client'

export type ApiReviewState = 'waiting' | 'approved' | 'rejected'

export type ApiAdminReview = {
  id: string
  giftRequestId: string
  orderId: string
  customerName: string
  stars: number
  text: string | null
  state: ApiReviewState | string
  createdAt: string
  decidedAt: string | null
}

export type AdminReviewsListResponse = {
  items: ApiAdminReview[]
  page: number
  pageSize: number
  total: number
}

export type AdminGiftRequestReviewResponse = {
  review: ApiAdminReview | null
}

export async function listAdminReviews(page = 1) {
  const query = new URLSearchParams({ page: String(page) })
  return apiRequest<AdminReviewsListResponse>(
    `/api/v1/admin/reviews?${query.toString()}`,
  )
}

export async function getAdminGiftRequestReview(giftRequestId: string) {
  return apiRequest<AdminGiftRequestReviewResponse>(
    `/api/v1/admin/gift-requests/${giftRequestId}/review`,
  )
}

export async function approveAdminReview(reviewId: string) {
  return apiRequest<ApiAdminReview>(
    `/api/v1/admin/reviews/${reviewId}/approve`,
    { method: 'POST' },
  )
}

export async function rejectAdminReview(reviewId: string) {
  return apiRequest<ApiAdminReview>(
    `/api/v1/admin/reviews/${reviewId}/reject`,
    { method: 'POST' },
  )
}

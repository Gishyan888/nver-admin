import { apiRequest } from './client'

export type ApiInternalNote = {
  id: string
  text: string
  createdAt: string
  authorEmail: string | null
}

export type AdminInternalNotesListResponse = {
  items: ApiInternalNote[]
}

export async function listAdminInternalNotes(giftRequestId: string) {
  return apiRequest<AdminInternalNotesListResponse>(
    `/api/v1/admin/gift-requests/${giftRequestId}/notes`,
  )
}

export async function createAdminInternalNote(
  giftRequestId: string,
  text: string,
) {
  return apiRequest<ApiInternalNote>(
    `/api/v1/admin/gift-requests/${giftRequestId}/notes`,
    {
      method: 'POST',
      body: { text },
    },
  )
}

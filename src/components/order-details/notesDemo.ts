import type { InternalNote } from './types'

/** Demo writer e-mail matching the T-10-04 list frame. */
export const DEMO_NOTES_ADMIN_EMAIL = 'lilit@example.com'

/**
 * Demo notes for the List frame (newest first).
 * ISO moments chosen so formatAdminDateTime matches the frame text in UTC;
 * time zone is not decided on T-10-13.
 */
export const DEMO_INTERNAL_NOTES: InternalNote[] = [
  {
    id: 'note-1',
    text: 'Customer asked in the chat to hold the gift until Friday.',
    createdAt: '2026-11-24T15:40:00.000Z',
    adminEmail: 'lilit@example.com',
  },
  {
    id: 'note-2',
    text: 'Engraving confirmed with the workshop, ready on 25 November.',
    createdAt: '2026-11-23T17:05:00.000Z',
    adminEmail: 'aram@example.com',
  },
  {
    id: 'note-3',
    text: 'Paid in full. Watch roll ordered from the supplier in Florence.',
    createdAt: '2026-11-23T09:20:00.000Z',
    adminEmail: 'lilit@example.com',
  },
]

import type { ApiInternalNote } from '../../api/notes'
import type { InternalNote } from './types'

export function internalNoteFromApi(note: ApiInternalNote): InternalNote {
  return {
    id: note.id,
    text: note.text,
    createdAt: note.createdAt,
    adminEmail: note.authorEmail ?? '',
  }
}

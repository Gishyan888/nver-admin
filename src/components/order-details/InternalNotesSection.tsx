import { useState } from 'react'
import { formatAdminDateTime } from '../../lib/formatDateTime'
import { formatCounter } from '../../lib/formatPrice'
import {
  DEMO_INTERNAL_NOTES,
  DEMO_NOTES_ADMIN_EMAIL,
} from './notesDemo'
import type { InternalNote } from './types'

const NOTE_MAX = 1000

type InternalNotesSectionProps = {
  /** When true, start with the List-frame demo notes; otherwise empty. */
  seedDemoNotes?: boolean
  adminEmail?: string
}

/**
 * Section 9 of the order details (T-10-13): internal notes.
 * Built from T-10-04 frames; API comes with T-10-08.
 */
export function InternalNotesSection({
  seedDemoNotes = true,
  adminEmail = DEMO_NOTES_ADMIN_EMAIL,
}: InternalNotesSectionProps) {
  const [notes, setNotes] = useState<InternalNote[]>(() =>
    seedDemoNotes ? [...DEMO_INTERNAL_NOTES] : [],
  )
  const [draft, setDraft] = useState('')
  const [focused, setFocused] = useState(false)

  const canAdd = draft.length > 0

  function handleAdd() {
    if (!canAdd) {
      return
    }
    const note: InternalNote = {
      id: `local-note-${Date.now()}`,
      text: draft,
      createdAt: new Date().toISOString(),
      adminEmail,
    }
    setNotes((prev) => [note, ...prev])
    setDraft('')
  }

  return (
    <section className="flex w-full max-w-[360px] flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
      <div className="flex w-full flex-col gap-1 overflow-hidden">
        <h2 className="text-base font-semibold leading-6 text-text-primary">
          Internal notes
        </h2>
        <p className="text-sm leading-5 text-text-secondary">
          Only admins see these notes. A note cannot be changed once added.
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 overflow-hidden">
        <textarea
          value={draft}
          maxLength={NOTE_MAX}
          rows={4}
          placeholder="Write a note"
          aria-label="Write a note"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) =>
            setDraft(event.target.value.slice(0, NOTE_MAX))
          }
          className={`h-24 w-full resize-none rounded-lg border bg-bg-default px-4 py-3 text-sm leading-5 text-text-primary outline-none placeholder:text-text-secondary ${
            focused || draft.length > 0
              ? 'border-text-primary'
              : 'border-border-default'
          }`}
        />
        <div className="flex w-full items-center gap-3 overflow-hidden">
          <p className="min-w-0 flex-1 text-xs leading-4 text-text-secondary">
            {formatCounter(draft.length, NOTE_MAX)}
          </p>
          <button
            type="button"
            disabled={!canAdd}
            onClick={handleAdd}
            className="flex h-10 shrink-0 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-4 text-sm font-medium leading-5 text-text-primary disabled:cursor-default disabled:text-text-tertiary"
          >
            Add note
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <p className="text-base leading-6 text-text-secondary">No notes yet.</p>
      ) : (
        <div className="flex w-full flex-col overflow-hidden">
          {notes.map((note, index) => (
            <div
              key={note.id}
              className={`flex w-full flex-col gap-1 overflow-hidden py-3 ${
                index > 0 ? 'border-t border-border-default' : ''
              }`}
            >
              <p className="w-full text-sm leading-5 text-text-primary">
                {note.text}
              </p>
              <p className="w-full text-xs leading-4 text-text-secondary">
                {formatAdminDateTime(note.createdAt)} · {note.adminEmail}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

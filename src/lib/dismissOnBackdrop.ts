import type { MouseEvent } from 'react'

/** Close overlay only when the scrim itself is clicked, not the dialog. */
export function dismissOnBackdrop(
  event: MouseEvent<HTMLElement>,
  onDismiss: () => void,
  busy = false,
) {
  if (busy) {
    return
  }
  if (event.target === event.currentTarget) {
    onDismiss()
  }
}

type DeleteGiftOptionDialogProps = {
  onGoBack: () => void
  onDelete: () => void
  busy?: boolean
}

export function DeleteGiftOptionDialog({
  onGoBack,
  onDelete,
  busy = false,
}: DeleteGiftOptionDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-gift-option-title"
        className="w-full max-w-[480px] rounded-xl bg-bg-default p-6"
      >
        <p
          id="delete-gift-option-title"
          className="text-base leading-7 font-normal text-text-primary"
        >
          Delete this gift option? Its comments are deleted with it.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onGoBack}
            className="flex h-12 cursor-pointer items-center rounded-lg border border-border-default bg-bg-default px-6 text-base font-medium text-text-primary disabled:opacity-60"
          >
            Go back
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onDelete}
            className="flex h-12 cursor-pointer items-center rounded-lg bg-bg-inverse px-6 text-base font-medium text-text-on-accent disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

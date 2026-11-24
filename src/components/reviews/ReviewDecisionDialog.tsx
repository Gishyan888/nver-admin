type ReviewDecisionDialogProps = {
  kind: 'approve' | 'reject'
  busy?: boolean
  onGoBack: () => void
  onConfirm: () => void
}

export function ReviewDecisionDialog({
  kind,
  busy = false,
  onGoBack,
  onConfirm,
}: ReviewDecisionDialogProps) {
  const title =
    kind === 'approve' ? 'Approve this review?' : 'Reject this review?'
  const confirmLabel = kind === 'approve' ? 'Approve' : 'Reject'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-decision-title"
        className="flex w-full max-w-[480px] flex-col gap-6 rounded-xl bg-bg-default p-6"
      >
        <div className="flex w-full flex-col gap-2">
          <p
            id="review-decision-title"
            className="w-full text-xl font-semibold leading-7 text-text-primary"
          >
            {title}
          </p>
          <p className="w-full text-base leading-6 text-text-secondary">
            This decision cannot be changed.
          </p>
        </div>
        <div className="flex w-full items-start justify-end gap-3">
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
            onClick={onConfirm}
            className="flex h-12 cursor-pointer items-center rounded-lg bg-bg-inverse px-6 text-base font-medium text-text-on-accent disabled:opacity-60"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

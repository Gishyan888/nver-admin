import type { ReviewState } from './types'

const STATE_CLASS: Record<ReviewState, string> = {
  Waiting: 'bg-warning-subtle',
  Approved: 'bg-success-subtle',
  Rejected: 'bg-danger-subtle',
}

type ReviewStateLabelProps = {
  state: ReviewState
}

export function ReviewStateLabel({ state }: ReviewStateLabelProps) {
  return (
    <span
      className={`inline-flex items-start rounded-full px-2 py-1 ${STATE_CLASS[state]}`}
    >
      <span className="text-xs font-medium leading-4 text-text-primary">
        {state}
      </span>
    </span>
  )
}

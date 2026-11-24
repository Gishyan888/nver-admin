import type { GiftRequestStatus } from '../../lib/giftRequestStatus'
import { STATUS_PILL_CLASS } from '../../lib/statusControl'

type StatusLabelProps = {
  status: GiftRequestStatus
}

export function StatusLabel({ status }: StatusLabelProps) {
  return (
    <span
      className={`inline-flex items-start rounded-full px-2 py-1 ${STATUS_PILL_CLASS[status]}`}
    >
      <span className="text-xs font-medium leading-4 text-text-primary">
        {status}
      </span>
    </span>
  )
}

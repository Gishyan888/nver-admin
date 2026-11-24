import { Link } from 'react-router-dom'
import { formatReviewSentDay } from '../../lib/formatDateTime'
import type { GiftRequestStatus } from '../../lib/giftRequestStatus'
import { StatusLabel } from '../status/StatusLabel'

type OrderDetailsHeaderProps = {
  orderId: string
  status: GiftRequestStatus
  customerName: string
  createdAt: string
}

export function OrderDetailsHeader({
  orderId,
  status,
  customerName,
  createdAt,
}: OrderDetailsHeaderProps) {
  return (
    <header className="flex flex-col gap-2">
      <Link
        to="/"
        className="w-fit text-sm font-medium leading-5 text-accent-default"
      >
        ← Orders
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-semibold leading-7 text-text-primary">
          {orderId}
        </h2>
        <StatusLabel status={status} />
      </div>
      <p className="text-sm leading-5 text-text-secondary">
        {`${customerName} · Created ${formatReviewSentDay(createdAt)}`}
      </p>
    </header>
  )
}

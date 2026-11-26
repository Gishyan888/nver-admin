import { Link } from 'react-router-dom'
import { formatReviewSentDay } from '../../lib/formatDateTime'
import type { GiftRequestStatus } from '../../lib/giftRequestStatus'
import { IconBackArrow } from '../icons/FigmaIcons'
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
        className="inline-flex w-fit shrink-0 items-center gap-1.5 text-sm font-medium leading-5 whitespace-nowrap text-text-secondary"
      >
        <IconBackArrow />
        Orders
      </Link>
      <div className="flex flex-wrap items-center gap-3">
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

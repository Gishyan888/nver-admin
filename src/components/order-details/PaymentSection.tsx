import { formatReviewSentDay } from '../../lib/formatDateTime'
import { formatPriceUsd } from '../../lib/formatPrice'
import type { PaymentState } from './types'

type PaymentSectionProps = {
  payment: PaymentState
}

function LabeledValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full flex-col gap-1 overflow-hidden">
      <p className="text-sm leading-5 text-text-secondary">{label}</p>
      <p className="text-base leading-6 text-text-primary">{value}</p>
    </div>
  )
}

export function PaymentSection({ payment }: PaymentSectionProps) {
  return (
    <section className="flex w-full max-w-[360px] flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
      <h2 className="text-base font-semibold leading-6 text-text-primary">
        Payment
      </h2>

      {payment.kind === 'not-yet' ? (
        <p className="text-base leading-6 text-text-secondary">Not yet</p>
      ) : null}

      {payment.kind === 'paid' || payment.kind === 'refunded' ? (
        <>
          <LabeledValue
            label="Amount paid"
            value={formatPriceUsd(payment.amountUsd)}
          />
          <LabeledValue
            label="Paid on"
            value={formatReviewSentDay(payment.paidOn)}
          />
        </>
      ) : null}

      {payment.kind === 'refunded' ? (
        <LabeledValue
          label="Refunded on"
          value={formatReviewSentDay(payment.refundedOn)}
        />
      ) : null}

      {payment.kind === 'refund-failed' ? (
        <span className="inline-flex w-fit items-start rounded-full bg-danger-subtle px-2 py-1">
          <span className="text-xs font-medium leading-4 text-text-primary">
            Refund failed
          </span>
        </span>
      ) : null}
    </section>
  )
}

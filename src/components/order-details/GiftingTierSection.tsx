import { tierBudgetLine } from './orderDetailsDemo'
import type { GiftingTier } from './types'

type GiftingTierSectionProps = {
  tier: GiftingTier
}

export function GiftingTierSection({ tier }: GiftingTierSectionProps) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
      <h2 className="text-base font-semibold leading-6 text-text-primary">
        Gifting tier
      </h2>
      <p className="text-base leading-6 text-text-primary">
        {tierBudgetLine(tier)}
      </p>
    </section>
  )
}

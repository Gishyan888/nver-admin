type StarRatingProps = {
  rating: number
}

/** Five 16px stars: filled warning yellow, empty border grey (T-06-02). */
export function StarRating({ rating }: StarRatingProps) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)))

  return (
    <div className="flex items-start gap-1" aria-label={`${filled} of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const isFilled = index < filled
        return (
          <svg
            key={index}
            width={16}
            height={16}
            viewBox="0 0 16 16"
            aria-hidden
            className="size-4 shrink-0"
          >
            <path
              d="M8 1.2l1.76 3.56 3.93.57-2.84 2.77.67 3.91L8 10.16l-3.52 1.85.67-3.91L2.31 5.33l3.93-.57L8 1.2z"
              fill={isFilled ? 'var(--color-warning-default)' : 'none'}
              stroke={
                isFilled
                  ? 'var(--color-warning-default)'
                  : 'var(--color-border-default)'
              }
              strokeWidth={1.2}
            />
          </svg>
        )
      })}
    </div>
  )
}

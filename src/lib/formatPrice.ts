/** Whole US dollars as on the frames, e.g. 1250 → "$1,250". */
export function formatPriceUsd(priceUsd: number): string {
  return `$${priceUsd.toLocaleString('en-US')}`
}

export function formatCounter(count: number, max: number): string {
  const maxLabel = max.toLocaleString('en-US')
  return `${count} / ${maxLabel}`
}

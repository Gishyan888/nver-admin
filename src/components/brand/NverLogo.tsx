import logoCharcoal from '../../assets/nver-logo-charcoal.svg'
import logoWhite from '../../assets/nver-logo-white.svg'

type NverLogoProps = {
  /** White on charcoal (menu); charcoal on light backgrounds. */
  variant?: 'white' | 'charcoal'
  className?: string
  title?: string
}

/**
 * Nvér mark (T-01-13 direction C): N with a ribbon bow.
 * Menu uses the small white instance (~23×28).
 */
export function NverLogo({
  variant = 'white',
  className = 'h-7 w-[23px]',
  title = 'Nvér',
}: NverLogoProps) {
  const src = variant === 'white' ? logoWhite : logoCharcoal
  return (
    <img
      src={src}
      alt={title}
      className={className}
      width={23}
      height={28}
    />
  )
}

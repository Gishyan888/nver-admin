/**
 * Exact Figma icon geometry from file aRIb8PmdH8sWD7ePvIb7OK.
 * Paths/viewBoxes match exported MCP SVG assets — do not approximate.
 */

type IconProps = {
  className?: string
}

/**
 * Leftwards arrow from outlined Inter Medium glyph in node 100:1121
 * ("Back to orders"). Used instead of U+2190 so the mark cannot drop
 * when the webfont subset omits the arrow.
 */
export function IconBackArrow({ className }: IconProps) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10.2316 10.46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path
        d="M4.63852 9.86839L2.21729e-05 5.22989L4.63852 0.591397L5.5334 1.47634L2.42616 4.58358H10.2316V5.8762H2.42616L5.5334 8.97847L4.63852 9.86839Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function IconSearch({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path
        d="M14.5 9C14.5 12.0376 12.0376 14.5 9 14.5C5.96243 14.5 3.5 12.0376 3.5 9C3.5 5.96243 5.96243 3.5 9 3.5C12.0376 3.5 14.5 5.96243 14.5 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M13 13L16.5 16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconCalendar({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path
        d="M5.25 4.25H14.75C15.8546 4.25 16.75 5.14543 16.75 6.25V14.75C16.75 15.8546 15.8546 16.75 14.75 16.75H5.25C4.14543 16.75 3.25 15.8546 3.25 14.75V6.25C3.25 5.14543 4.14543 4.25 5.25 4.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.5 8.25H16.5M7 2.75V5.75M13 2.75V5.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconChevronLeft({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path
        d="M10 4L6 8L10 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconChevronRight({ className }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconClose({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path
        d="M5 5L15 15M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconPhoto({ className }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <path
        d="M4.75 4.25H15.25C16.3546 4.25 17.25 5.14543 17.25 6.25V13.75C17.25 14.8546 16.3546 15.75 15.25 15.75H4.75C3.64543 15.75 2.75 14.8546 2.75 13.75V6.25C2.75 5.14543 3.64543 4.25 4.75 4.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 8.5C9 9.32843 8.32843 10 7.5 10C6.67157 10 6 9.32843 6 8.5C6 7.67157 6.67157 7 7.5 7C8.32843 7 9 7.67157 9 8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 14L7 10.5L10 13L13 10L17 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

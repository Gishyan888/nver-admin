type SectionPlaceholderProps = {
  title: string
  width?: 'full' | 'side'
}

/** Titled box for a section whose content is another task (e.g. T-10-13). */
export function SectionPlaceholder({
  title,
  width = 'full',
}: SectionPlaceholderProps) {
  return (
    <section
      className={`flex flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6 ${
        width === 'side' ? 'w-full max-w-[360px]' : 'w-full'
      }`}
    >
      <h2 className="text-base font-semibold leading-6 text-text-primary">
        {title}
      </h2>
    </section>
  )
}

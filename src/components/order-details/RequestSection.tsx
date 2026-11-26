import { AuthenticatedImage } from '../gift-options/AuthenticatedImage'
import type { OrderRequestAnswers } from './types'

type RequestSectionProps = {
  answers: OrderRequestAnswers
}

function Field({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  const display =
    value === null || value === undefined || value === ''
      ? 'Not given'
      : value
  const empty = display === 'Not given'
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-sm leading-5 text-text-secondary">{label}</p>
      <p
        className={`text-base leading-6 ${
          empty ? 'text-text-secondary' : 'text-text-primary'
        }`}
      >
        {display}
      </p>
    </div>
  )
}

export function RequestSection({ answers }: RequestSectionProps) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-lg border border-border-default bg-bg-default p-6">
      <h2 className="text-base font-semibold leading-6 text-text-primary">
        Request
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Occasion" value={answers.occasion} />
        <Field label="Date of the occasion" value={answers.dateOfOccasion} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Recipient" value={answers.recipient} />
        <Field label="Age" value={answers.age} />
        <Field label="Gender" value={answers.gender} />
      </div>
      <Field label="What they like" value={answers.whatTheyLike} />
      <Field label="Hobbies" value={answers.hobbies} />
      <Field label="What to avoid" value={answers.whatToAvoid} />
      <div className="flex flex-col gap-2">
        <p className="text-sm leading-5 text-text-secondary">Inspiration</p>
        {answers.inspirationText ||
        answers.inspirationPhotos.length > 0 ||
        answers.inspirationLinks.length > 0 ? (
          <>
            {answers.inspirationText ? (
              <p className="text-base leading-6 text-text-primary">
                {answers.inspirationText}
              </p>
            ) : null}
            {answers.inspirationPhotos.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {answers.inspirationPhotos.slice(0, 3).map((photoUrl, index) =>
                  photoUrl ? (
                    <AuthenticatedImage
                      key={`${photoUrl}-${index}`}
                      imageUrl={photoUrl}
                      alt=""
                      className="size-24 rounded-lg object-cover"
                    />
                  ) : (
                    <div
                      key={`placeholder-${index}`}
                      className="size-24 rounded-lg bg-bg-muted"
                    />
                  ),
                )}
              </div>
            ) : null}
            {answers.inspirationLinks.length > 0 ? (
              <div className="flex flex-col gap-1">
                {answers.inspirationLinks.slice(0, 3).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-base leading-6 text-accent-default"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-base leading-6 text-text-secondary">Not given</p>
        )}
      </div>
    </section>
  )
}

import { formatAdminDateTime } from '../../lib/formatDateTime'
import type { AlternativeRequest } from './types'

type AlternativeRequestsPanelProps = {
  requests: AlternativeRequest[]
}

/** Light yellow panel at the top of Gift options. Newest first. */
export function AlternativeRequestsPanel({
  requests,
}: AlternativeRequestsPanelProps) {
  if (requests.length === 0) {
    return null
  }

  const ordered = [...requests].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )

  return (
    <div className="flex w-full flex-col items-start gap-3 overflow-hidden rounded-lg bg-warning-subtle p-4">
      <p className="text-sm font-medium leading-5 text-text-primary">
        Requests for alternatives
      </p>
      {ordered.map((request) => {
        const hasNote = Boolean(request.note?.trim())
        return (
          <div
            key={request.id}
            className="flex w-full flex-col items-start gap-1 overflow-hidden"
          >
            <p
              className={`w-full text-sm leading-5 break-words ${
                hasNote ? 'text-text-primary' : 'text-text-secondary'
              }`}
            >
              {hasNote ? request.note : 'No note'}
            </p>
            <p className="text-xs leading-4 whitespace-nowrap text-text-secondary">
              {formatAdminDateTime(request.createdAt)}
            </p>
          </div>
        )
      })}
    </div>
  )
}

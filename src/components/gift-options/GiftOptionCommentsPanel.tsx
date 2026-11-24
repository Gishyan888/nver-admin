import type { GiftOptionComment as CommentModel } from './types'
import { GiftOptionComment } from './GiftOptionComment'

type GiftOptionCommentsPanelProps = {
  comments: CommentModel[]
}

/** Light grey "Comments" panel under a gift option description. Oldest first. */
export function GiftOptionCommentsPanel({
  comments,
}: GiftOptionCommentsPanelProps) {
  if (comments.length === 0) {
    return null
  }

  const ordered = [...comments].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  )

  return (
    <div className="flex w-full flex-col items-start gap-3 overflow-hidden rounded-lg bg-bg-subtle p-3">
      <p className="text-xs font-medium leading-4 text-text-secondary">
        Comments
      </p>
      {ordered.map((comment) => (
        <GiftOptionComment
          key={comment.id}
          text={comment.text}
          createdAt={comment.createdAt}
        />
      ))}
    </div>
  )
}

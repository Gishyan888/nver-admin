import { formatAdminDateTime } from '../../lib/formatDateTime'

type GiftOptionCommentProps = {
  text: string
  createdAt: string
}

export function GiftOptionComment({ text, createdAt }: GiftOptionCommentProps) {
  return (
    <div className="flex w-full flex-col items-start gap-1">
      <p className="w-full text-sm leading-5 break-words text-text-primary">
        {text}
      </p>
      <p className="text-xs leading-4 whitespace-nowrap text-text-secondary">
        {formatAdminDateTime(createdAt)}
      </p>
    </div>
  )
}

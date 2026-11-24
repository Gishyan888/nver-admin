import { useEffect, useState } from 'react'
import { fetchGiftOptionImageBlob } from '../../api/giftOptions'

type AuthenticatedImageProps = {
  imageUrl: string
  alt: string
  className?: string
}

export function AuthenticatedImage({
  imageUrl,
  alt,
  className,
}: AuthenticatedImageProps) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let revoked: string | null = null
    let cancelled = false

    async function load() {
      try {
        const blob = await fetchGiftOptionImageBlob(imageUrl)
        if (cancelled) {
          return
        }
        const objectUrl = URL.createObjectURL(blob)
        revoked = objectUrl
        setSrc(objectUrl)
      } catch {
        if (!cancelled) {
          setSrc(null)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
      if (revoked) {
        URL.revokeObjectURL(revoked)
      }
    }
  }, [imageUrl])

  if (!src) {
    return <div className={className ?? 'size-[120px] rounded-lg bg-bg-muted'} />
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className ?? 'size-[120px] rounded-lg object-cover'}
    />
  )
}

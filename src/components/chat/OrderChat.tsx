import { useCallback, useEffect, useRef, useState } from 'react'
import {
  listAdminChatMessages,
  markAdminChatRead,
  sendAdminChatPhoto,
  sendAdminChatText,
  shareAdminChatGiftOption,
} from '../../api/chat'
import { listGiftOptions } from '../../api/giftOptions'
import { NetworkError } from '../../api/types'
import type { GiftRequestStatus } from '../../lib/giftRequestStatus'
import {
  buildDemoChatMessages,
  DEMO_ADMIN_EMAIL,
  DEMO_SHAREABLE_OPTIONS,
} from './chatDemo'
import { ChatPanel } from './ChatPanel'
import { ChatSection } from './ChatSection'
import {
  getChatSocket,
  joinChatRoom,
  leaveChatRoom,
  type ChatSocketMessageEvent,
} from './chatSocket'
import { chatGiftOptionRefFromApi, chatMessageFromApi } from './mapChatMessage'
import type { ChatGiftOptionRef, ChatMessage } from './types'

type PanelOverlay = 'none' | 'loading' | 'error' | 'offline'

type PendingSend =
  | { kind: 'text'; text: string }
  | { kind: 'photo'; file: File; previewUrl: string }
  | { kind: 'gift-option'; option: ChatGiftOptionRef }

type OrderChatProps = {
  giftRequestId: string
  orderId: string
  customerName: string
  status: GiftRequestStatus
  unread: boolean
  onUnreadChange: (unread: boolean) => void
  fixturesOnly?: boolean
}

function upsertMessage(prev: ChatMessage[], next: ChatMessage): ChatMessage[] {
  if (prev.some((item) => item.id === next.id)) {
    return prev
  }
  return [...prev, next]
}

export function OrderChat({
  giftRequestId,
  orderId,
  customerName,
  status,
  unread,
  onUnreadChange,
  fixturesOnly = false,
}: OrderChatProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [giftOptions, setGiftOptions] = useState<ChatGiftOptionRef[]>([])
  const [canSend, setCanSend] = useState(
    status !== 'Completed' && status !== 'Canceled',
  )
  const [overlay, setOverlay] = useState<PanelOverlay>('none')
  const pendingRef = useRef<Map<string, PendingSend>>(new Map())
  const openRef = useRef(false)
  openRef.current = open
  const onUnreadChangeRef = useRef(onUnreadChange)
  onUnreadChangeRef.current = onUnreadChange

  const loadMessages = useCallback(async () => {
    if (fixturesOnly) {
      setMessages(buildDemoChatMessages())
      setGiftOptions(DEMO_SHAREABLE_OPTIONS)
      setCanSend(status !== 'Completed' && status !== 'Canceled')
      setOverlay('none')
      onUnreadChangeRef.current(false)
      return
    }
    if (!navigator.onLine) {
      setOverlay('offline')
      return
    }
    setOverlay('loading')
    try {
      const [chat, options] = await Promise.all([
        listAdminChatMessages(giftRequestId),
        listGiftOptions(giftRequestId),
      ])
      const mapped = chat.items
        .map(chatMessageFromApi)
        .filter((item): item is ChatMessage => item !== null)
      setMessages(mapped)
      setCanSend(chat.canSend)
      setGiftOptions(
        options.items.map((item) => chatGiftOptionRefFromApi(item)),
      )
      setOverlay('none')
      onUnreadChangeRef.current(false)
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
        return
      }
      setOverlay('error')
    }
  }, [fixturesOnly, giftRequestId, status])

  useEffect(() => {
    if (!open) {
      return
    }
    void loadMessages()
  }, [loadMessages, open])

  useEffect(() => {
    if (!open || fixturesOnly) {
      return
    }

    let cancelled = false
    let leave: (() => void) | undefined

    void (async () => {
      try {
        const socket = await getChatSocket()
        if (cancelled) {
          return
        }
        const ack = await joinChatRoom(socket, giftRequestId)
        if (cancelled || !ack.ok) {
          return
        }

        const onMessage = (payload: ChatSocketMessageEvent) => {
          if (payload.giftRequestId !== giftRequestId) {
            return
          }
          const mapped = chatMessageFromApi(payload.message)
          if (!mapped) {
            return
          }
          setMessages((prev) => upsertMessage(prev, mapped))
          if (openRef.current) {
            void markAdminChatRead(giftRequestId).catch(() => undefined)
            onUnreadChangeRef.current(false)
          }
        }

        socket.on('message', onMessage)
        leave = () => {
          socket.off('message', onMessage)
          leaveChatRoom(socket, giftRequestId)
        }
      } catch {
        // Chat still works over HTTP without realtime.
      }
    })()

    return () => {
      cancelled = true
      leave?.()
    }
  }, [fixturesOnly, giftRequestId, open])

  function markLocalFailed(id: string) {
    setMessages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, failed: true } : item)),
    )
  }

  async function sendText(text: string, localId?: string) {
    const id = localId ?? `local-text-${Date.now()}`
    if (fixturesOnly) {
      setMessages((prev) => [
        ...prev,
        {
          id,
          kind: 'text',
          sender: 'admin',
          adminEmail: DEMO_ADMIN_EMAIL,
          text,
          sentAt: new Date().toISOString(),
        },
      ])
      return
    }
    if (!localId) {
      setMessages((prev) => [
        ...prev,
        {
          id,
          kind: 'text',
          sender: 'admin',
          adminEmail: DEMO_ADMIN_EMAIL,
          text,
          sentAt: new Date().toISOString(),
        },
      ])
    }
    pendingRef.current.set(id, { kind: 'text', text })
    try {
      const result = await sendAdminChatText(giftRequestId, text)
      const mapped = chatMessageFromApi(result)
      pendingRef.current.delete(id)
      setMessages((prev) => {
        const withoutLocal = prev.filter((item) => item.id !== id)
        return mapped ? upsertMessage(withoutLocal, mapped) : withoutLocal
      })
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
      }
      markLocalFailed(id)
    }
  }

  async function sendPhoto(
    file: File,
    localId?: string,
    previewUrl?: string,
  ) {
    const preview = previewUrl ?? URL.createObjectURL(file)
    const id = localId ?? `local-photo-${Date.now()}`
    if (fixturesOnly) {
      setMessages((prev) => [
        ...prev,
        {
          id,
          kind: 'photo',
          sender: 'admin',
          adminEmail: DEMO_ADMIN_EMAIL,
          photoUrl: preview,
          sentAt: new Date().toISOString(),
        },
      ])
      return
    }
    if (!localId) {
      setMessages((prev) => [
        ...prev,
        {
          id,
          kind: 'photo',
          sender: 'admin',
          adminEmail: DEMO_ADMIN_EMAIL,
          photoUrl: preview,
          sentAt: new Date().toISOString(),
        },
      ])
    }
    pendingRef.current.set(id, { kind: 'photo', file, previewUrl: preview })
    try {
      const result = await sendAdminChatPhoto(giftRequestId, file)
      const mapped = chatMessageFromApi(result)
      pendingRef.current.delete(id)
      setMessages((prev) => {
        const withoutLocal = prev.filter((item) => item.id !== id)
        return mapped ? upsertMessage(withoutLocal, mapped) : withoutLocal
      })
      if (!previewUrl) {
        URL.revokeObjectURL(preview)
      }
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
      }
      markLocalFailed(id)
    }
  }

  async function shareOption(option: ChatGiftOptionRef, localId?: string) {
    const id = localId ?? `local-share-${Date.now()}`
    if (fixturesOnly) {
      setMessages((prev) => [
        ...prev,
        {
          id,
          kind: 'gift-option',
          sender: 'admin',
          adminEmail: DEMO_ADMIN_EMAIL,
          giftOption: { ...option },
          sentAt: new Date().toISOString(),
        },
      ])
      return
    }
    if (!localId) {
      setMessages((prev) => [
        ...prev,
        {
          id,
          kind: 'gift-option',
          sender: 'admin',
          adminEmail: DEMO_ADMIN_EMAIL,
          giftOption: { ...option },
          sentAt: new Date().toISOString(),
        },
      ])
    }
    pendingRef.current.set(id, { kind: 'gift-option', option })
    try {
      const result = await shareAdminChatGiftOption(giftRequestId, option.id)
      const mapped = chatMessageFromApi(result)
      pendingRef.current.delete(id)
      setMessages((prev) => {
        const withoutLocal = prev.filter((item) => item.id !== id)
        return mapped ? upsertMessage(withoutLocal, mapped) : withoutLocal
      })
    } catch (error) {
      if (error instanceof NetworkError) {
        setOverlay('offline')
      }
      markLocalFailed(id)
    }
  }

  async function handleTryAgain(messageId: string) {
    const pending = pendingRef.current.get(messageId)
    if (!pending) {
      return
    }
    setMessages((prev) =>
      prev.map((item) =>
        item.id === messageId ? { ...item, failed: false } : item,
      ),
    )
    if (pending.kind === 'text') {
      await sendText(pending.text, messageId)
      return
    }
    if (pending.kind === 'photo') {
      await sendPhoto(pending.file, messageId, pending.previewUrl)
      return
    }
    await shareOption(pending.option, messageId)
  }

  return (
    <>
      <ChatSection
        unread={unread}
        onOpenChat={() => {
          setOpen(true)
          onUnreadChange(false)
        }}
      />
      {open ? (
        <ChatPanel
          orderId={orderId}
          customerName={customerName}
          status={status}
          canSendOverride={fixturesOnly ? undefined : canSend}
          messages={messages}
          giftOptions={giftOptions}
          overlay={overlay}
          onClose={() => setOpen(false)}
          onSendText={(text) => {
            void sendText(text)
          }}
          onSendPhoto={(file) => {
            void sendPhoto(file)
          }}
          onShareGiftOption={(option) => {
            void shareOption(option)
          }}
          onTryAgain={(messageId) => {
            void handleTryAgain(messageId)
          }}
        />
      ) : null}
    </>
  )
}

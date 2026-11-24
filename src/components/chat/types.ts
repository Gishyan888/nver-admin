export type ChatSender = 'customer' | 'admin'

export type ChatGiftOptionRef = {
  id: string
  title: string
  priceUsd: number
  /** Empty string → muted placeholder. */
  imageUrl: string
  deleted?: boolean
}

export type ChatMessage =
  | {
      id: string
      kind: 'text'
      sender: ChatSender
      /** Admin only — e-mail of the account that sent it. */
      adminEmail?: string
      text: string
      sentAt: string
      failed?: boolean
    }
  | {
      id: string
      kind: 'photo'
      sender: ChatSender
      adminEmail?: string
      /** Object URL or path for UI demo. */
      photoUrl: string
      sentAt: string
      failed?: boolean
    }
  | {
      id: string
      kind: 'gift-option'
      sender: 'admin'
      adminEmail: string
      giftOption: ChatGiftOptionRef
      sentAt: string
      failed?: boolean
    }
  | {
      id: string
      kind: 'consultation'
      sender: 'customer'
      sentAt: string
    }

export const CHAT_TEXT_MAX = 1000

import type { ApiChatMessage } from '../../api/chat'
import type { ChatGiftOptionRef, ChatMessage } from './types'

export function chatGiftOptionRefFromApi(
  option: NonNullable<ApiChatMessage['giftOption']> | ChatGiftOptionRef,
): ChatGiftOptionRef {
  if ('imageUrl' in option) {
    return option
  }
  return {
    id: option.id,
    title: option.title,
    priceUsd: option.priceUsd,
    imageUrl: option.image?.url ?? '',
  }
}

export function chatMessageFromApi(message: ApiChatMessage): ChatMessage | null {
  const sender = message.from === 'customer' ? 'customer' : 'admin'
  const adminEmail =
    sender === 'admin' ? (message.adminEmail ?? undefined) : undefined

  if (
    message.kind === 'text' &&
    sender === 'customer' &&
    message.text?.trim() === 'Consultation requested'
  ) {
    return {
      id: message.id,
      kind: 'consultation',
      sender: 'customer',
      sentAt: message.sentAt,
    }
  }

  if (message.kind === 'text') {
    return {
      id: message.id,
      kind: 'text',
      sender,
      adminEmail,
      text: message.text ?? '',
      sentAt: message.sentAt,
    }
  }

  if (message.kind === 'photo') {
    return {
      id: message.id,
      kind: 'photo',
      sender,
      adminEmail,
      photoUrl: message.photo?.url ?? '',
      sentAt: message.sentAt,
    }
  }

  if (message.kind === 'gift_option') {
    if (!message.giftOption) {
      return {
        id: message.id,
        kind: 'gift-option',
        sender: 'admin',
        adminEmail: adminEmail ?? '',
        giftOption: {
          id: '',
          title: '',
          priceUsd: 0,
          imageUrl: '',
          deleted: true,
        },
        sentAt: message.sentAt,
      }
    }
    return {
      id: message.id,
      kind: 'gift-option',
      sender: 'admin',
      adminEmail: adminEmail ?? '',
      giftOption: chatGiftOptionRefFromApi(message.giftOption),
      sentAt: message.sentAt,
    }
  }

  return null
}

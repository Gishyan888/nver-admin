import type { ChatGiftOptionRef, ChatMessage } from './types'

export const DEMO_CHAT_ORDER_ID = 'NV-10114'
export const DEMO_CHAT_CUSTOMER_NAME = 'Sofia Martirosyan'
export const DEMO_ADMIN_EMAIL = 'lilit@example.com'

export const DEMO_SHAREABLE_OPTIONS: ChatGiftOptionRef[] = [
  {
    id: 'demo-opt-1',
    title: 'Leather watch roll',
    priceUsd: 1250,
    imageUrl: '',
  },
  {
    id: 'demo-opt-2',
    title: 'Vintage jazz vinyl set',
    priceUsd: 1150,
    imageUrl: '',
  },
]

export function buildDemoChatMessages(): ChatMessage[] {
  return [
    {
      id: 'm1',
      kind: 'text',
      sender: 'customer',
      text: 'Hello! Could the watch roll be ready before Friday?',
      sentAt: '2026-11-23T10:02:00.000Z',
    },
    {
      id: 'm2',
      kind: 'text',
      sender: 'admin',
      adminEmail: 'lilit@example.com',
      text: 'Hello Sofia, yes. We will have it ready on Thursday.',
      sentAt: '2026-11-23T10:15:00.000Z',
    },
    {
      id: 'm3',
      kind: 'photo',
      sender: 'customer',
      photoUrl: '',
      sentAt: '2026-11-23T10:20:00.000Z',
    },
    {
      id: 'm4',
      kind: 'text',
      sender: 'customer',
      text: 'This is the engraving I would like, in gold.',
      sentAt: '2026-11-23T10:21:00.000Z',
    },
    {
      id: 'm5',
      kind: 'consultation',
      sender: 'customer',
      sentAt: '2026-11-24T09:00:00.000Z',
    },
    {
      id: 'm6',
      kind: 'text',
      sender: 'admin',
      adminEmail: 'aram@example.com',
      text: 'I will call you at 11:00 to go over the engraving together.',
      sentAt: '2026-11-24T09:12:00.000Z',
    },
    {
      id: 'm7',
      kind: 'text',
      sender: 'customer',
      text: 'Perfect, thank you.',
      sentAt: '2026-11-24T09:14:00.000Z',
    },
  ]
}

export function buildDemoSharedGiftMessage(): ChatMessage {
  return {
    id: 'm-share',
    kind: 'gift-option',
    sender: 'admin',
    adminEmail: DEMO_ADMIN_EMAIL,
    giftOption: { ...DEMO_SHAREABLE_OPTIONS[0] },
    sentAt: '2026-11-24T09:30:00.000Z',
  }
}

export function buildDemoDeletedGiftMessage(): ChatMessage {
  return {
    id: 'm-deleted',
    kind: 'gift-option',
    sender: 'admin',
    adminEmail: DEMO_ADMIN_EMAIL,
    giftOption: {
      ...DEMO_SHAREABLE_OPTIONS[0],
      deleted: true,
    },
    sentAt: '2026-11-24T09:31:00.000Z',
  }
}

export function buildDemoFailedMessage(): ChatMessage {
  return {
    id: 'm-fail',
    kind: 'text',
    sender: 'admin',
    adminEmail: DEMO_ADMIN_EMAIL,
    text: 'Could you confirm the initials?',
    sentAt: '2026-11-24T09:40:00.000Z',
    failed: true,
  }
}

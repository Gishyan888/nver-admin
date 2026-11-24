import type { GiftOption } from '../../api/giftOptions'
import type { AlternativeRequest, GiftOptionComment } from './types'

/** Frame 127:2854 / 127:2908 fixtures for UI QA until T-03-06. */
export const DEMO_GIFT_OPTIONS: GiftOption[] = [
  {
    id: 'demo-option-1',
    title: 'Leather watch roll',
    description:
      'Hand-stitched Italian leather roll for three watches, lined in suede, with his initials embossed on the flap.',
    priceUsd: 1250,
    image: {
      id: 'demo-image-1',
      contentType: 'image/png',
      sizeBytes: 0,
      url: '',
    },
    selected: true,
    createdAt: '2026-11-20T10:00:00.000Z',
    updatedAt: '2026-11-20T10:00:00.000Z',
  },
  {
    id: 'demo-option-2',
    title: 'Vintage jazz vinyl set',
    description:
      'Three first pressings from the Blue Note catalogue, cleaned and graded, in a walnut record box.',
    priceUsd: 1150,
    image: {
      id: 'demo-image-2',
      contentType: 'image/png',
      sizeBytes: 0,
      url: '',
    },
    selected: false,
    createdAt: '2026-11-20T11:00:00.000Z',
    updatedAt: '2026-11-20T11:00:00.000Z',
  },
  {
    id: 'demo-option-3',
    title: 'Single malt tasting evening',
    description:
      'A private tasting of five rare single malts for two, with a whisky expert, in Yerevan.',
    priceUsd: 1600,
    image: {
      id: 'demo-image-3',
      contentType: 'image/png',
      sizeBytes: 0,
      url: '',
    },
    selected: false,
    createdAt: '2026-11-20T12:00:00.000Z',
    updatedAt: '2026-11-20T12:00:00.000Z',
  },
]

export const DEMO_COMMENTS_BY_OPTION_ID: Record<string, GiftOptionComment[]> = {
  'demo-option-1': [
    {
      id: 'demo-comment-1',
      text: 'Could the initials be in gold rather than blind embossed?',
      createdAt: '2026-11-24T14:20:00.000Z',
    },
    {
      id: 'demo-comment-2',
      text: 'Also, is there a version for four watches?',
      createdAt: '2026-11-24T14:26:00.000Z',
    },
  ],
}

export const DEMO_ALTERNATIVE_REQUESTS: AlternativeRequest[] = [
  {
    id: 'demo-request-1',
    note: 'Could you look for something more personal, maybe engraved?',
    createdAt: '2026-11-24T18:40:00.000Z',
  },
  {
    id: 'demo-request-2',
    note: null,
    createdAt: '2026-11-25T10:15:00.000Z',
  },
]

/** In Progress frame shows two options; Paid frame shows three. */
export function demoItemsForStatus(paidReadOnly: boolean): GiftOption[] {
  return paidReadOnly ? DEMO_GIFT_OPTIONS : DEMO_GIFT_OPTIONS.slice(0, 2)
}

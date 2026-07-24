import { describe, expect, it } from 'vitest'
import {
  buildConversations,
  formatConversationTime,
  formatMessageDay,
  formatMessageTime,
  withDateDividers,
  type ConversationMessage,
} from './chat.format'
import type { ChatMessage } from './chat.types'

function convMessage(overrides: Partial<ConversationMessage> = {}): ConversationMessage {
  return {
    id: 'm1',
    text: 'Привет',
    senderId: 'other',
    receiverId: 'me',
    isRead: false,
    createdAt: '2026-07-24T10:00:00.000Z',
    otherUser: { id: 'other', name: 'Ольга Иванова', avatar: null },
    ...overrides,
  }
}

const now = new Date('2026-07-24T15:00:00Z')

function message(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: 'm1',
    text: 'Привет',
    isOwn: false,
    createdAt: '2026-07-24T10:12:00.000Z',
    ...overrides,
  }
}

describe('formatMessageTime', () => {
  it('форматирует время как ЧЧ:ММ по UTC', () => {
    expect(formatMessageTime('2026-07-24T10:12:00.000Z')).toBe('10:12')
  })

  it('добавляет ведущий ноль в часах', () => {
    expect(formatMessageTime('2026-07-24T09:05:00.000Z')).toBe('09:05')
  })
})

describe('formatMessageDay', () => {
  it('сегодняшнее сообщение помечает «Сегодня»', () => {
    expect(formatMessageDay('2026-07-24T08:00:00.000Z', now)).toBe('Сегодня')
  })

  it('вчерашнее помечает «Вчера»', () => {
    expect(formatMessageDay('2026-07-23T20:00:00.000Z', now)).toBe('Вчера')
  })

  it('более старое даёт день и месяц', () => {
    expect(formatMessageDay('2026-05-02T10:00:00.000Z', now)).toBe('2 мая')
  })
})

describe('withDateDividers', () => {
  it('ставит разделитель на первое сообщение дня', () => {
    const items = withDateDividers(
      [
        message({ id: 'a', createdAt: '2026-07-23T10:00:00.000Z' }),
        message({ id: 'b', createdAt: '2026-07-23T11:00:00.000Z' }),
        message({ id: 'c', createdAt: '2026-07-24T09:00:00.000Z' }),
      ],
      now,
    )

    expect(items[0].dayLabel).toBe('Вчера')
    expect(items[1].dayLabel).toBeNull()
    expect(items[2].dayLabel).toBe('Сегодня')
  })

  it('на пустом списке не падает', () => {
    expect(withDateDividers([], now)).toEqual([])
  })
})

describe('formatConversationTime', () => {
  it('сегодняшнее сообщение показывает время', () => {
    expect(formatConversationTime('2026-07-24T12:45:00.000Z', now)).toBe('12:45')
  })

  it('вчерашнее показывает «Вчера»', () => {
    expect(formatConversationTime('2026-07-23T18:00:00.000Z', now)).toBe('Вчера')
  })
})

describe('buildConversations', () => {
  it('по одному диалогу на собеседника', () => {
    const conversations = buildConversations(
      [
        convMessage({ id: 'a', createdAt: '2026-07-24T10:00:00.000Z' }),
        convMessage({ id: 'b', createdAt: '2026-07-24T11:00:00.000Z' }),
      ],
      'me',
      now,
    )

    expect(conversations).toHaveLength(1)
    expect(conversations[0].userId).toBe('other')
  })

  it('последнее сообщение — самое свежее', () => {
    const conversations = buildConversations(
      [
        convMessage({ id: 'a', text: 'старое', createdAt: '2026-07-24T10:00:00.000Z' }),
        convMessage({ id: 'b', text: 'новое', createdAt: '2026-07-24T12:00:00.000Z' }),
      ],
      'me',
      now,
    )

    expect(conversations[0].lastMessage).toBe('новое')
  })

  it('считает непрочитанными только входящие непрочитанные', () => {
    const conversations = buildConversations(
      [
        convMessage({ id: 'a', receiverId: 'me', isRead: false }),
        convMessage({ id: 'b', receiverId: 'me', isRead: false }),
        convMessage({ id: 'c', senderId: 'me', receiverId: 'other', isRead: false }),
      ],
      'me',
      now,
    )

    expect(conversations[0].unread).toBe(2)
  })

  it('прочитанные не идут в счётчик', () => {
    const conversations = buildConversations([convMessage({ isRead: true })], 'me', now)

    expect(conversations[0].unread).toBe(0)
  })

  it('разделяет собеседников', () => {
    const conversations = buildConversations(
      [
        convMessage({ id: 'a', otherUser: { id: 'u1', name: 'Первый', avatar: null } }),
        convMessage({ id: 'b', otherUser: { id: 'u2', name: 'Второй', avatar: null } }),
      ],
      'me',
      now,
    )

    expect(conversations.map((c) => c.userId).sort()).toEqual(['u1', 'u2'])
  })
})

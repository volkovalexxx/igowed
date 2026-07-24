import { describe, expect, it, vi } from 'vitest'
import { getConversation, isChatError, listConversations, sendMessage } from './chat.service'
import { ChatValidationError } from './chat.validation'

const now = new Date('2026-07-24T15:00:00Z')

function userRef(id: string, name = 'Ольга') {
  return { id, name, image: null, vendor: null }
}

function messageRecord(overrides = {}) {
  return {
    id: 'm1',
    text: 'Привет',
    senderId: 'other',
    receiverId: 'me',
    isRead: false,
    createdAt: new Date('2026-07-24T10:00:00.000Z'),
    sender: userRef('other'),
    receiver: userRef('me', 'Я'),
    ...overrides,
  }
}

function deps(overrides = {}) {
  return {
    listUserMessages: vi.fn().mockResolvedValue([messageRecord()]),
    findUser: vi.fn().mockResolvedValue(userRef('other')),
    listThreadMessages: vi.fn().mockResolvedValue([messageRecord()]),
    markThreadRead: vi.fn().mockResolvedValue(undefined),
    createMessage: vi.fn().mockResolvedValue(messageRecord({ id: 'new', senderId: 'me', receiverId: 'other' })),
    ...overrides,
  }
}

describe('listConversations', () => {
  it('без пользователя отдаёт пустой список', async () => {
    expect(await listConversations('', deps(), now)).toEqual([])
  })

  it('строит диалоги из сообщений', async () => {
    const conversations = await listConversations('me', deps(), now)

    expect(conversations[0].userId).toBe('other')
    expect(conversations[0].unread).toBe(1)
  })
})

describe('getConversation', () => {
  it('без собеседника отдаёт null', async () => {
    expect(await getConversation('me', '', deps(), now)).toBeNull()
  })

  it('null, если собеседник не найден', async () => {
    expect(await getConversation('me', 'x', deps({ findUser: vi.fn().mockResolvedValue(null) }), now)).toBeNull()
  })

  it('отдаёт профиль собеседника и ленту с разделителями', async () => {
    const result = await getConversation('me', 'other', deps(), now)

    expect(result?.peer.id).toBe('other')
    expect(result?.messages[0].dayLabel).toBe('Сегодня')
    expect(result?.messages[0].isOwn).toBe(false)
  })

  it('помечает входящие сообщения прочитанными', async () => {
    const dependencies = deps()
    await getConversation('me', 'other', dependencies, now)

    expect(dependencies.markThreadRead).toHaveBeenCalledWith('other', 'me')
  })

  it('пустой диалог возвращает профиль и пустую ленту', async () => {
    const result = await getConversation('me', 'other', deps({ listThreadMessages: vi.fn().mockResolvedValue([]) }), now)

    expect(result?.peer.id).toBe('other')
    expect(result?.messages).toEqual([])
  })
})

describe('sendMessage', () => {
  it('создаёт сообщение и отдаёт его от своего имени', async () => {
    const message = await sendMessage('me', 'other', { text: 'Привет' }, deps())

    expect(message.isOwn).toBe(true)
  })

  it('не даёт писать самому себе', async () => {
    await expect(sendMessage('me', 'me', { text: 'Привет' }, deps())).rejects.toThrow('Нельзя написать самому себе')
  })

  it('падает, если собеседник не найден', async () => {
    const dependencies = deps({ findUser: vi.fn().mockResolvedValue(null) })

    await expect(sendMessage('me', 'x', { text: 'Привет' }, dependencies)).rejects.toThrow(ChatValidationError)
    expect(dependencies.createMessage).not.toHaveBeenCalled()
  })

  it('отклоняет пустой текст до похода в базу', async () => {
    const dependencies = deps()

    await expect(sendMessage('me', 'other', { text: '   ' }, dependencies)).rejects.toThrow('Введите сообщение')
    expect(dependencies.findUser).not.toHaveBeenCalled()
  })
})

describe('isChatError', () => {
  it('узнаёт ошибку валидации чата', () => {
    expect(isChatError(new ChatValidationError('нет'))).toBe(true)
  })

  it('не путает с обычной ошибкой', () => {
    expect(isChatError(new Error('нет'))).toBe(false)
  })
})

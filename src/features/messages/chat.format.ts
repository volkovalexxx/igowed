import type { ChatMessage, ChatMessageWithDivider, Conversation } from './chat.types'

/** Сообщение с обоими участниками — сырьё для сборки списка диалогов. */
export type ConversationMessage = {
  id: string
  text: string
  senderId: string
  receiverId: string
  isRead: boolean
  createdAt: string
  otherUser: { id: string; name: string; avatar: string | null }
}

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function dayNumber(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

const DAY_MS = 24 * 60 * 60 * 1000

export function formatMessageTime(iso: string): string {
  const date = new Date(iso)
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
}

export function formatMessageDay(iso: string, now: Date): string {
  const date = new Date(iso)
  const diffDays = (dayNumber(now) - dayNumber(date)) / DAY_MS

  if (diffDays <= 0) return 'Сегодня'
  if (diffDays === 1) return 'Вчера'

  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`
}

/** Время последнего сообщения в списке диалогов: сегодня — ЧЧ:ММ, иначе день. */
export function formatConversationTime(iso: string, now: Date): string {
  const diffDays = (dayNumber(now) - dayNumber(new Date(iso))) / DAY_MS
  return diffDays <= 0 ? formatMessageTime(iso) : formatMessageDay(iso, now)
}

/**
 * Сворачивает плоский список сообщений в диалоги: по одному на собеседника,
 * с последним сообщением и числом непрочитанных. Порядок — от свежего к старому.
 */
export function buildConversations(messages: readonly ConversationMessage[], currentUserId: string, now: Date): Conversation[] {
  const byUser = new Map<string, Conversation>()

  const ordered = [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  for (const message of ordered) {
    const other = message.otherUser
    const isUnread = !message.isRead && message.receiverId === currentUserId

    const existing = byUser.get(other.id)
    if (existing) {
      if (isUnread) existing.unread += 1
      continue
    }

    byUser.set(other.id, {
      userId: other.id,
      name: other.name,
      avatar: other.avatar,
      lastMessage: message.text,
      lastTime: formatConversationTime(message.createdAt, now),
      unread: isUnread ? 1 : 0,
    })
  }

  return [...byUser.values()]
}

/** Помечает первое сообщение каждого дня меткой-разделителем для рендера ленты. */
export function withDateDividers(messages: readonly ChatMessage[], now: Date): ChatMessageWithDivider[] {
  let previousDay: number | null = null

  return messages.map((message) => {
    const day = dayNumber(new Date(message.createdAt))
    const dayLabel = day === previousDay ? null : formatMessageDay(message.createdAt, now)
    previousDay = day

    return { ...message, dayLabel }
  })
}

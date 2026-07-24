import type { ConversationMessage } from '../chat.format'
import type { ChatMessage } from '../chat.types'

type UserRef = {
  id: string
  name: string | null
  image: string | null
  vendor: { avatar: string | null } | null
}

export type MessageRecord = {
  id: string
  text: string
  senderId: string
  receiverId: string
  isRead: boolean
  createdAt: Date
  sender: UserRef
  receiver: UserRef
}

export type PeerProfile = {
  id: string
  name: string
  avatar: string | null
}

function displayName(user: UserRef): string {
  return user.name?.trim() || 'Пользователь'
}

function avatarOf(user: UserRef): string | null {
  return user.vendor?.avatar ?? user.image ?? null
}

export function mapPeerProfile(user: UserRef): PeerProfile {
  return { id: user.id, name: displayName(user), avatar: avatarOf(user) }
}

export function mapChatMessage(record: MessageRecord, currentUserId: string): ChatMessage {
  return {
    id: record.id,
    text: record.text,
    isOwn: record.senderId === currentUserId,
    createdAt: record.createdAt.toISOString(),
  }
}

export function mapConversationMessage(record: MessageRecord, currentUserId: string): ConversationMessage {
  const other = record.senderId === currentUserId ? record.receiver : record.sender

  return {
    id: record.id,
    text: record.text,
    senderId: record.senderId,
    receiverId: record.receiverId,
    isRead: record.isRead,
    createdAt: record.createdAt.toISOString(),
    otherUser: mapPeerProfile(other),
  }
}

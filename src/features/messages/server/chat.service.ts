import { buildConversations, withDateDividers } from '../chat.format'
import type { ChatMessageWithDivider, Conversation } from '../chat.types'
import {
  mapChatMessage,
  mapConversationMessage,
  mapPeerProfile,
  type MessageRecord,
  type PeerProfile,
} from './chat.mapper'
import { ChatValidationError, parseSendMessageInput } from './chat.validation'

type UserRecord = Parameters<typeof mapPeerProfile>[0]

type ChatDeps = {
  listUserMessages(userId: string): Promise<MessageRecord[]>
  findUser(userId: string): Promise<UserRecord | null>
  listThreadMessages(userId: string, otherUserId: string): Promise<MessageRecord[]>
  markThreadRead(senderId: string, receiverId: string): Promise<void>
  createMessage(senderId: string, receiverId: string, text: string): Promise<MessageRecord>
}

export type ConversationThread = {
  peer: PeerProfile
  messages: ChatMessageWithDivider[]
}

export async function listConversations(userId: string, deps: ChatDeps, now: Date): Promise<Conversation[]> {
  if (!userId) return []

  const records = await deps.listUserMessages(userId)
  return buildConversations(
    records.map((record) => mapConversationMessage(record, userId)),
    userId,
    now,
  )
}

export async function getConversation(
  userId: string,
  otherUserId: string,
  deps: ChatDeps,
  now: Date,
): Promise<ConversationThread | null> {
  if (!userId || !otherUserId) return null

  const peer = await deps.findUser(otherUserId)
  if (!peer) return null

  const records = await deps.listThreadMessages(userId, otherUserId)
  await deps.markThreadRead(otherUserId, userId)

  const messages = withDateDividers(
    records.map((record) => mapChatMessage(record, userId)),
    now,
  )

  return { peer: mapPeerProfile(peer), messages }
}

export async function sendMessage(userId: string, otherUserId: string, rawInput: unknown, deps: ChatDeps) {
  const input = parseSendMessageInput(rawInput)

  if (userId === otherUserId) {
    throw new ChatValidationError('Нельзя написать самому себе')
  }

  const peer = await deps.findUser(otherUserId)
  if (!peer) {
    throw new ChatValidationError('Собеседник не найден')
  }

  const record = await deps.createMessage(userId, otherUserId, input.text)
  return mapChatMessage(record, userId)
}

export function isChatError(error: unknown): error is ChatValidationError {
  return error instanceof ChatValidationError
}

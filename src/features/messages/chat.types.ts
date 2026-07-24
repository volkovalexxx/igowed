export type ChatMessage = {
  id: string
  text: string
  isOwn: boolean
  createdAt: string
}

export type ChatMessageWithDivider = ChatMessage & {
  /** Метка дня, если это первое сообщение нового дня, иначе null. */
  dayLabel: string | null
}

export type Conversation = {
  userId: string
  name: string
  avatar: string | null
  lastMessage: string
  lastTime: string
  unread: number
}

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { MessagesClient, type InitialThread } from '@/features/messages/MessagesClient'
import { chatRepository } from '@/features/messages/server/chat.repository'
import { getConversation, listConversations } from '@/features/messages/server/chat.service'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Сообщения | I GO WED',
}

type MessagesRouteProps = {
  searchParams: Promise<{ to?: string }>
}

export default async function MessagesRoute({ searchParams }: MessagesRouteProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login?next=/dashboard/messages')
  }

  const { to } = await searchParams
  const now = new Date()

  const conversations = await listConversations(session.user.id, chatRepository, now)

  const targetUserId = to ?? conversations[0]?.userId ?? null
  const thread: InitialThread | null =
    targetUserId && targetUserId !== session.user.id
      ? await getConversation(session.user.id, targetUserId, chatRepository, now)
      : null

  return <MessagesClient initialConversations={conversations} initialThread={thread} />
}

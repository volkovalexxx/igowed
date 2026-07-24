import { NextResponse, type NextRequest } from 'next/server'
import { chatRepository } from '@/features/messages/server/chat.repository'
import { getSessionUserId, toChatErrorResponse, unauthorizedResponse } from '@/features/messages/server/chat.http'
import { listConversations } from '@/features/messages/server/chat.service'

export async function GET(_request: NextRequest) {
  const userId = await getSessionUserId()

  if (!userId) return unauthorizedResponse()

  try {
    const conversations = await listConversations(userId, chatRepository, new Date())
    return NextResponse.json({ conversations })
  } catch (error) {
    return toChatErrorResponse(error)
  }
}

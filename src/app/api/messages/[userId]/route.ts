import { NextResponse, type NextRequest } from 'next/server'
import { chatRepository } from '@/features/messages/server/chat.repository'
import {
  getSessionUserId,
  toChatErrorResponse,
  unauthorizedResponse,
  type ChatThreadRouteContext,
} from '@/features/messages/server/chat.http'
import { getConversation, sendMessage } from '@/features/messages/server/chat.service'
import { enforceRateLimit } from '@/lib/rate-limit/enforce'

export async function GET(_request: NextRequest, context: ChatThreadRouteContext) {
  const currentUserId = await getSessionUserId()
  const { userId } = await context.params

  if (!currentUserId) return unauthorizedResponse()

  try {
    const thread = await getConversation(currentUserId, userId, chatRepository, new Date())

    if (!thread) {
      return NextResponse.json({ error: 'Собеседник не найден' }, { status: 404 })
    }

    return NextResponse.json({ thread })
  } catch (error) {
    return toChatErrorResponse(error)
  }
}

export async function POST(request: NextRequest, context: ChatThreadRouteContext) {
  const currentUserId = await getSessionUserId()
  const { userId } = await context.params

  if (!currentUserId) return unauthorizedResponse()

  const limited = await enforceRateLimit('message', currentUserId)
  if (limited) return limited

  try {
    const message = await sendMessage(currentUserId, userId, await request.json(), chatRepository)
    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    return toChatErrorResponse(error)
  }
}

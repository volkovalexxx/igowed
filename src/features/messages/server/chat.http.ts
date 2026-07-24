import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isChatError } from './chat.service'

export type ChatThreadRouteContext = {
  params: Promise<{ userId: string }>
}

export function toChatErrorResponse(error: unknown) {
  if (isChatError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: 'Не удалось обработать сообщение' }, { status: 500 })
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
}

export async function getSessionUserId() {
  const session = await auth()
  return session?.user?.id ?? null
}

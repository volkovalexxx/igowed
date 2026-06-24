import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { eventRepository } from '@/features/events/server/event.repository'
import { createEventForUser, isEventError } from '@/features/events/server/event.service'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const event = await createEventForUser(session.user.id, await req.json(), eventRepository)
    return NextResponse.json({ event }, { status: 201 })
  } catch (err) {
    if (isEventError(err)) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }

    console.error('[POST /api/events]', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

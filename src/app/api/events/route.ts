import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { createEventForUser, isEventError } from '@/features/events/server/event.service'
import type { EventDeps } from '@/features/events/server/event.types'

const eventDeps: EventDeps = {
  createEvent: (input) =>
    prisma.event.create({
      data: input,
    }),
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const event = await createEventForUser(session.user.id, await req.json(), eventDeps)
    return NextResponse.json({ event }, { status: 201 })
  } catch (err) {
    if (isEventError(err)) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }

    console.error('[POST /api/events]', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

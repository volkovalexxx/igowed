import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { eventGuestRepository } from '@/features/events/guests/server/eventGuest.repository'
import { createGuestForEvent, isEventGuestError, listGuestsForEvent } from '@/features/events/guests/server/eventGuest.service'

type GuestsRouteContext = {
  params: Promise<{
    id: string
  }>
}

function toErrorResponse(error: unknown) {
  if (isEventGuestError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: 'Не удалось обработать список гостей' }, { status: 500 })
}

export async function GET(_request: NextRequest, context: GuestsRouteContext) {
  const session = await auth()
  const { id } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    const guests = await listGuestsForEvent(session.user.id, id, eventGuestRepository)
    return NextResponse.json({ guests })
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function POST(request: NextRequest, context: GuestsRouteContext) {
  const session = await auth()
  const { id } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    const guest = await createGuestForEvent(session.user.id, id, await request.json(), eventGuestRepository)
    return NextResponse.json({ guest }, { status: 201 })
  } catch (error) {
    return toErrorResponse(error)
  }
}

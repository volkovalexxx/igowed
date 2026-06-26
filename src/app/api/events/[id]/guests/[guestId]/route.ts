import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { eventGuestRepository } from '@/features/events/guests/server/eventGuest.repository'
import { isEventGuestError, updateGuestForEvent } from '@/features/events/guests/server/eventGuest.service'

type GuestRouteContext = {
  params: Promise<{
    id: string
    guestId: string
  }>
}

function toErrorResponse(error: unknown) {
  if (isEventGuestError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: 'Не удалось обновить гостя' }, { status: 500 })
}

export async function PATCH(request: NextRequest, context: GuestRouteContext) {
  const session = await auth()
  const { id, guestId } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    const guest = await updateGuestForEvent(session.user.id, id, guestId, await request.json(), eventGuestRepository)
    return NextResponse.json({ guest })
  } catch (error) {
    return toErrorResponse(error)
  }
}

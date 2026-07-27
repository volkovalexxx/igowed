import { NextResponse, type NextRequest } from 'next/server'
import { clientBookingsRepository } from '@/features/bookings/list/server/clientBookings.repository'
import { cancelClientBooking, isClientBookingError } from '@/features/bookings/list/server/clientBookings.service'
import { auth } from '@/lib/auth'

type BookingRouteContext = {
  params: Promise<{ bookingId: string }>
}

/** Клиент отменяет свою заявку. Тело: `{ action: 'cancel' }`. */
export async function PATCH(request: NextRequest, context: BookingRouteContext) {
  const session = await auth()
  const { bookingId } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  if ((body as { action?: string }).action !== 'cancel') {
    return NextResponse.json({ error: 'Неизвестное действие' }, { status: 400 })
  }

  try {
    const result = await cancelClientBooking(session.user.id, bookingId, clientBookingsRepository)
    return NextResponse.json(result)
  } catch (error) {
    if (isClientBookingError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Не удалось отменить заявку' }, { status: 500 })
  }
}

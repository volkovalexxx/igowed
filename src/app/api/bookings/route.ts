import { NextResponse, type NextRequest } from 'next/server'
import { bookingRepository } from '@/features/bookings/create/server/booking.repository'
import { createBooking, isBookingError } from '@/features/bookings/create/server/booking.service'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    const result = await createBooking(session.user.id, await request.json(), bookingRepository)
    return NextResponse.json(result, { status: result.existing ? 200 : 201 })
  } catch (error) {
    if (isBookingError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Не удалось отправить заявку' }, { status: 500 })
  }
}

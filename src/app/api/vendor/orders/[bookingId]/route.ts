import { NextResponse, type NextRequest } from 'next/server'
import { ordersRepository } from '@/features/vendors/orders/server/orders.repository'
import { isOrdersError, updateOrderStatus } from '@/features/vendors/orders/server/orders.service'
import { auth } from '@/lib/auth'

type OrderRouteContext = {
  params: Promise<{ bookingId: string }>
}

function toErrorResponse(error: unknown) {
  if (isOrdersError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: 'Не удалось обновить заявку' }, { status: 500 })
}

export async function PATCH(request: NextRequest, context: OrderRouteContext) {
  const session = await auth()
  const { bookingId } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    const result = await updateOrderStatus(session.user.id, bookingId, await request.json(), ordersRepository)
    return NextResponse.json(result)
  } catch (error) {
    return toErrorResponse(error)
  }
}

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isEventVendorError } from './eventVendor.service'

export type EventVendorRouteContext = {
  params: Promise<{ id: string }>
}

export type EventVendorItemRouteContext = {
  params: Promise<{ id: string; vendorId: string }>
}

export function toEventVendorErrorResponse(error: unknown) {
  if (isEventVendorError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: 'Не удалось обработать подрядчика мероприятия' }, { status: 500 })
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
}

export async function getSessionUserId() {
  const session = await auth()
  return session?.user?.id ?? null
}

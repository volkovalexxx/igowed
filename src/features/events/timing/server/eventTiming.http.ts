import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isEventTimingError } from './eventTiming.service'

export type TimingRouteContext = {
  params: Promise<{ id: string }>
}

export type TimingEntryRouteContext = {
  params: Promise<{ id: string; entryId: string }>
}

export function toTimingErrorResponse(error: unknown) {
  if (isEventTimingError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: 'Не удалось обработать тайминг' }, { status: 500 })
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
}

export async function getSessionUserId() {
  const session = await auth()
  return session?.user?.id ?? null
}

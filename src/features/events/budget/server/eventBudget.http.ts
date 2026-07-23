import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isEventBudgetError } from './eventBudget.service'

export type BudgetRouteContext = {
  params: Promise<{ id: string }>
}

export type BudgetItemRouteContext = {
  params: Promise<{ id: string; itemId: string }>
}

export function toBudgetErrorResponse(error: unknown) {
  if (isEventBudgetError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: 'Не удалось обработать бюджет' }, { status: 500 })
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
}

export async function getSessionUserId() {
  const session = await auth()
  return session?.user?.id ?? null
}

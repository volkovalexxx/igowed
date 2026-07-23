import { NextResponse, type NextRequest } from 'next/server'
import {
  getSessionUserId,
  toBudgetErrorResponse,
  unauthorizedResponse,
  type BudgetRouteContext,
} from '@/features/events/budget/server/eventBudget.http'
import { eventBudgetRepository } from '@/features/events/budget/server/eventBudget.repository'
import { createBudgetItemForEvent } from '@/features/events/budget/server/eventBudget.service'

export async function POST(request: NextRequest, context: BudgetRouteContext) {
  const userId = await getSessionUserId()
  const { id } = await context.params

  if (!userId) return unauthorizedResponse()

  try {
    const item = await createBudgetItemForEvent(userId, id, await request.json(), eventBudgetRepository)
    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    return toBudgetErrorResponse(error)
  }
}

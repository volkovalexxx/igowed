import { NextResponse, type NextRequest } from 'next/server'
import {
  getSessionUserId,
  toBudgetErrorResponse,
  unauthorizedResponse,
  type BudgetItemRouteContext,
} from '@/features/events/budget/server/eventBudget.http'
import { eventBudgetRepository } from '@/features/events/budget/server/eventBudget.repository'
import { updateBudgetItemForEvent } from '@/features/events/budget/server/eventBudget.service'

export async function PATCH(request: NextRequest, context: BudgetItemRouteContext) {
  const userId = await getSessionUserId()
  const { id, itemId } = await context.params

  if (!userId) return unauthorizedResponse()

  try {
    const item = await updateBudgetItemForEvent(userId, id, itemId, await request.json(), eventBudgetRepository)
    return NextResponse.json({ item })
  } catch (error) {
    return toBudgetErrorResponse(error)
  }
}

import { NextResponse, type NextRequest } from 'next/server'
import {
  getSessionUserId,
  toBudgetErrorResponse,
  unauthorizedResponse,
  type BudgetRouteContext,
} from '@/features/events/budget/server/eventBudget.http'
import { eventBudgetRepository } from '@/features/events/budget/server/eventBudget.repository'
import {
  createBudgetCategoryForEvent,
  listBudgetCategoriesForEvent,
} from '@/features/events/budget/server/eventBudget.service'

export async function GET(_request: NextRequest, context: BudgetRouteContext) {
  const userId = await getSessionUserId()
  const { id } = await context.params

  if (!userId) return unauthorizedResponse()

  try {
    const categories = await listBudgetCategoriesForEvent(userId, id, eventBudgetRepository)
    return NextResponse.json({ categories })
  } catch (error) {
    return toBudgetErrorResponse(error)
  }
}

export async function POST(request: NextRequest, context: BudgetRouteContext) {
  const userId = await getSessionUserId()
  const { id } = await context.params

  if (!userId) return unauthorizedResponse()

  try {
    const category = await createBudgetCategoryForEvent(userId, id, await request.json(), eventBudgetRepository)
    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    return toBudgetErrorResponse(error)
  }
}

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { EventBudgetPage } from '@/features/events/budget/EventBudgetPage'
import { eventBudgetRepository } from '@/features/events/budget/server/eventBudget.repository'
import { getBudgetSummaryCurrency, listBudgetCategoriesForEvent } from '@/features/events/budget/server/eventBudget.service'
import { auth } from '@/lib/auth'

type EventBudgetRouteProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: 'Бюджет | I GO WED',
}

export default async function EventBudgetRoute({ params }: EventBudgetRouteProps) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.id) {
    redirect(`/login?next=/event/${id}/budget`)
  }

  const [categories, summaryCurrency] = await Promise.all([
    listBudgetCategoriesForEvent(session.user.id, id, eventBudgetRepository),
    getBudgetSummaryCurrency(session.user.id, id, eventBudgetRepository),
  ])

  return <EventBudgetPage eventId={id} initialCategories={categories} summaryCurrency={summaryCurrency} />
}

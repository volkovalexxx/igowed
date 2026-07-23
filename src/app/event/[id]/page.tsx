import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { EventDetailsPage } from '@/features/events/details/EventDetailsPage'
import { isEventFinished } from '@/features/events/review/eventPhase'
import { eventReviewRepository } from '@/features/events/review/server/eventReview.repository'
import { listEventVendorsForReview } from '@/features/events/review/server/eventReview.service'
import { eventRepository } from '@/features/events/server/event.repository'
import { getEventForUser } from '@/features/events/server/event.service'
import { auth } from '@/lib/auth'

type EventPageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: 'Мероприятие | I GO WED',
}

export default async function EventPage({ params }: EventPageProps) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.id) {
    redirect(`/login?next=/event/${id}`)
  }

  const event = await getEventForUser(session.user.id, id, eventRepository)

  if (!event) {
    notFound()
  }

  const isFinished = isEventFinished(event.eventDate, new Date())
  const reviewVendors = isFinished ? await listEventVendorsForReview(session.user.id, id, eventReviewRepository) : []

  return <EventDetailsPage event={event} isFinished={isFinished} reviewVendors={reviewVendors} />
}

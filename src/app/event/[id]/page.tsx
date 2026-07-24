import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { EventDetailsPage } from '@/features/events/details/EventDetailsPage'
import { isEventFinished } from '@/features/events/review/eventPhase'
import { eventReviewRepository } from '@/features/events/review/server/eventReview.repository'
import { listEventVendorsForReview } from '@/features/events/review/server/eventReview.service'
import { eventVendorRepository } from '@/features/events/vendors/server/eventVendor.repository'
import { listEventVendorSlots } from '@/features/events/vendors/server/eventVendor.service'
import { eventRepository } from '@/features/events/server/event.repository'
import { getEventForUser } from '@/features/events/server/event.service'
import { vendorBoardRepository } from '@/features/vendors/board/server/vendorBoard.repository'
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

  const [reviewVendors, vendorSlots, vendorCandidates] = await Promise.all([
    isFinished ? listEventVendorsForReview(session.user.id, id, eventReviewRepository) : Promise.resolve([]),
    isFinished ? Promise.resolve([]) : listEventVendorSlots(session.user.id, id, eventVendorRepository),
    isFinished ? Promise.resolve([]) : vendorBoardRepository.listFavorites(session.user.id),
  ])

  return (
    <EventDetailsPage
      event={event}
      isFinished={isFinished}
      reviewVendors={reviewVendors}
      vendorCandidates={vendorCandidates}
      vendorSlots={vendorSlots}
    />
  )
}

import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { EventDetailsPage } from '@/features/events/details/EventDetailsPage'
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

  return <EventDetailsPage event={event} />
}

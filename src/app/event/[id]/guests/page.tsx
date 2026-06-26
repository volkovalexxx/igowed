import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { EventGuestsPage } from '@/features/events/guests/EventGuestsPage'
import { eventGuestRepository } from '@/features/events/guests/server/eventGuest.repository'
import { listGuestsForEvent } from '@/features/events/guests/server/eventGuest.service'
import { auth } from '@/lib/auth'

type EventGuestsRouteProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: 'Список гостей | I GO WED',
}

export default async function EventGuestsRoute({ params }: EventGuestsRouteProps) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.id) {
    redirect(`/login?next=/event/${id}/guests`)
  }

  const guests = await listGuestsForEvent(session.user.id, id, eventGuestRepository)

  return <EventGuestsPage eventId={id} initialGuests={guests} />
}

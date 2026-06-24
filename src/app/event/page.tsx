import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { EventListPage } from '@/features/events/list/EventListPage'
import { eventRepository } from '@/features/events/server/event.repository'
import { listEventsForUser } from '@/features/events/server/event.service'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Мои мероприятия | I GO WED',
  description: 'Рабочий список свадебных мероприятий в I GO WED',
}

export default async function EventsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login?next=/event')
  }

  const events = await listEventsForUser(session.user.id, eventRepository)

  return <EventListPage events={events} />
}

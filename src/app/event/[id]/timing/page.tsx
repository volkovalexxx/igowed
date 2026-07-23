import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { EventTimingPage } from '@/features/events/timing/EventTimingPage'
import { eventTimingRepository } from '@/features/events/timing/server/eventTiming.repository'
import { listTimelinesForEvent } from '@/features/events/timing/server/eventTiming.service'
import { auth } from '@/lib/auth'

type EventTimingRouteProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: 'Тайминг | I GO WED',
}

export default async function EventTimingRoute({ params }: EventTimingRouteProps) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.id) {
    redirect(`/login?next=/event/${id}/timing`)
  }

  const timelines = await listTimelinesForEvent(session.user.id, id, eventTimingRepository)

  return <EventTimingPage eventId={id} initialTimelines={timelines} />
}

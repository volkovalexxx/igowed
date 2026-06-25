import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { EventTasksPage } from '@/features/events/tasks/EventTasksPage'
import { auth } from '@/lib/auth'

type EventTasksRouteProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: 'Список задач | I GO WED',
}

export default async function EventTasksRoute({ params }: EventTasksRouteProps) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.id) {
    redirect(`/login?next=/event/${id}/tasks`)
  }

  return <EventTasksPage eventId={id} />
}

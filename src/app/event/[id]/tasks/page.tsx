import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { EventTasksPage } from '@/features/events/tasks/EventTasksPage'
import { eventTaskRepository } from '@/features/events/tasks/server/eventTask.repository'
import { listTaskGroupsForEvent } from '@/features/events/tasks/server/eventTask.service'
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

  const taskGroups = await listTaskGroupsForEvent(session.user.id, id, eventTaskRepository)

  return <EventTasksPage eventId={id} initialGroups={taskGroups} />
}

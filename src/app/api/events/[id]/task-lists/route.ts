import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { createTaskListForEvent, isEventTaskError, listTaskGroupsForEvent } from '@/features/events/tasks/server/eventTask.service'
import { eventTaskRepository } from '@/features/events/tasks/server/eventTask.repository'

type TaskListsRouteContext = {
  params: Promise<{
    id: string
  }>
}

function toErrorResponse(error: unknown) {
  if (isEventTaskError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: 'Не удалось обработать список задач' }, { status: 500 })
}

export async function GET(_request: NextRequest, context: TaskListsRouteContext) {
  const session = await auth()
  const { id } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    const groups = await listTaskGroupsForEvent(session.user.id, id, eventTaskRepository)
    return NextResponse.json({ groups })
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function POST(request: NextRequest, context: TaskListsRouteContext) {
  const session = await auth()
  const { id } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    const list = await createTaskListForEvent(session.user.id, id, await request.json(), eventTaskRepository)
    return NextResponse.json({ list }, { status: 201 })
  } catch (error) {
    return toErrorResponse(error)
  }
}

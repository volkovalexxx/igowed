import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { createTaskForEvent, isEventTaskError } from '@/features/events/tasks/server/eventTask.service'
import { eventTaskRepository } from '@/features/events/tasks/server/eventTask.repository'

type TasksRouteContext = {
  params: Promise<{
    id: string
  }>
}

function toErrorResponse(error: unknown) {
  if (isEventTaskError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: 'Не удалось обработать задачу' }, { status: 500 })
}

export async function POST(request: NextRequest, context: TasksRouteContext) {
  const session = await auth()
  const { id } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    const task = await createTaskForEvent(session.user.id, id, await request.json(), eventTaskRepository)
    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    return toErrorResponse(error)
  }
}

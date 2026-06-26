import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { isEventTaskError, updateTaskForEvent } from '@/features/events/tasks/server/eventTask.service'
import { eventTaskRepository } from '@/features/events/tasks/server/eventTask.repository'

type TaskRouteContext = {
  params: Promise<{
    id: string
    taskId: string
  }>
}

function toErrorResponse(error: unknown) {
  if (isEventTaskError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: 'Не удалось обновить задачу' }, { status: 500 })
}

export async function PATCH(request: NextRequest, context: TaskRouteContext) {
  const session = await auth()
  const { id, taskId } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    const task = await updateTaskForEvent(session.user.id, id, taskId, await request.json(), eventTaskRepository)
    return NextResponse.json({ task })
  } catch (error) {
    return toErrorResponse(error)
  }
}

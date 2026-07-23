import { NextResponse, type NextRequest } from 'next/server'
import { eventTimingRepository } from '@/features/events/timing/server/eventTiming.repository'
import {
  getSessionUserId,
  toTimingErrorResponse,
  unauthorizedResponse,
  type TimingEntryRouteContext,
} from '@/features/events/timing/server/eventTiming.http'
import { updateTimelineEntryForEvent } from '@/features/events/timing/server/eventTiming.service'

export async function PATCH(request: NextRequest, context: TimingEntryRouteContext) {
  const userId = await getSessionUserId()
  const { id, entryId } = await context.params

  if (!userId) return unauthorizedResponse()

  try {
    const entry = await updateTimelineEntryForEvent(userId, id, entryId, await request.json(), eventTimingRepository)
    return NextResponse.json({ entry })
  } catch (error) {
    return toTimingErrorResponse(error)
  }
}

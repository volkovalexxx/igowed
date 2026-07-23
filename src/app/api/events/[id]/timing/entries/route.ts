import { NextResponse, type NextRequest } from 'next/server'
import { eventTimingRepository } from '@/features/events/timing/server/eventTiming.repository'
import {
  getSessionUserId,
  toTimingErrorResponse,
  unauthorizedResponse,
  type TimingRouteContext,
} from '@/features/events/timing/server/eventTiming.http'
import { createTimelineEntryForEvent } from '@/features/events/timing/server/eventTiming.service'

export async function POST(request: NextRequest, context: TimingRouteContext) {
  const userId = await getSessionUserId()
  const { id } = await context.params

  if (!userId) return unauthorizedResponse()

  try {
    const entry = await createTimelineEntryForEvent(userId, id, await request.json(), eventTimingRepository)
    return NextResponse.json({ entry }, { status: 201 })
  } catch (error) {
    return toTimingErrorResponse(error)
  }
}

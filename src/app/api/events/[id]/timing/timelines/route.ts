import { NextResponse, type NextRequest } from 'next/server'
import { eventTimingRepository } from '@/features/events/timing/server/eventTiming.repository'
import {
  getSessionUserId,
  toTimingErrorResponse,
  unauthorizedResponse,
  type TimingRouteContext,
} from '@/features/events/timing/server/eventTiming.http'
import { createTimelineForEvent, listTimelinesForEvent } from '@/features/events/timing/server/eventTiming.service'

export async function GET(_request: NextRequest, context: TimingRouteContext) {
  const userId = await getSessionUserId()
  const { id } = await context.params

  if (!userId) return unauthorizedResponse()

  try {
    const timelines = await listTimelinesForEvent(userId, id, eventTimingRepository)
    return NextResponse.json({ timelines })
  } catch (error) {
    return toTimingErrorResponse(error)
  }
}

export async function POST(request: NextRequest, context: TimingRouteContext) {
  const userId = await getSessionUserId()
  const { id } = await context.params

  if (!userId) return unauthorizedResponse()

  try {
    const timeline = await createTimelineForEvent(userId, id, await request.json(), eventTimingRepository)
    return NextResponse.json({ timeline }, { status: 201 })
  } catch (error) {
    return toTimingErrorResponse(error)
  }
}

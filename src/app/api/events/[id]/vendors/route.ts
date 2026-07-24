import { NextResponse, type NextRequest } from 'next/server'
import {
  getSessionUserId,
  toEventVendorErrorResponse,
  unauthorizedResponse,
  type EventVendorRouteContext,
} from '@/features/events/vendors/server/eventVendor.http'
import { eventVendorRepository } from '@/features/events/vendors/server/eventVendor.repository'
import { addVendorToEvent, listEventVendorSlots } from '@/features/events/vendors/server/eventVendor.service'

export async function GET(_request: NextRequest, context: EventVendorRouteContext) {
  const userId = await getSessionUserId()
  const { id } = await context.params

  if (!userId) return unauthorizedResponse()

  try {
    const slots = await listEventVendorSlots(userId, id, eventVendorRepository)
    return NextResponse.json({ slots })
  } catch (error) {
    return toEventVendorErrorResponse(error)
  }
}

export async function POST(request: NextRequest, context: EventVendorRouteContext) {
  const userId = await getSessionUserId()
  const { id } = await context.params

  if (!userId) return unauthorizedResponse()

  try {
    const vendor = await addVendorToEvent(userId, id, await request.json(), eventVendorRepository)
    return NextResponse.json({ vendor }, { status: 201 })
  } catch (error) {
    return toEventVendorErrorResponse(error)
  }
}

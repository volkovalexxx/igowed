import { NextResponse, type NextRequest } from 'next/server'
import {
  getSessionUserId,
  toEventVendorErrorResponse,
  unauthorizedResponse,
  type EventVendorItemRouteContext,
} from '@/features/events/vendors/server/eventVendor.http'
import { eventVendorRepository } from '@/features/events/vendors/server/eventVendor.repository'
import { removeVendorFromEvent } from '@/features/events/vendors/server/eventVendor.service'

export async function DELETE(_request: NextRequest, context: EventVendorItemRouteContext) {
  const userId = await getSessionUserId()
  const { id, vendorId } = await context.params

  if (!userId) return unauthorizedResponse()

  try {
    await removeVendorFromEvent(userId, id, vendorId, eventVendorRepository)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return toEventVendorErrorResponse(error)
  }
}

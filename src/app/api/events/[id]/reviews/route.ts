import { NextResponse, type NextRequest } from 'next/server'
import { eventReviewRepository } from '@/features/events/review/server/eventReview.repository'
import { isEventReviewError, rateEventVendor } from '@/features/events/review/server/eventReview.service'
import { auth } from '@/lib/auth'

type ReviewsRouteContext = {
  params: Promise<{ id: string }>
}

function toErrorResponse(error: unknown) {
  if (isEventReviewError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: 'Не удалось сохранить отзыв' }, { status: 500 })
}

export async function POST(request: NextRequest, context: ReviewsRouteContext) {
  const session = await auth()
  const { id } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    const review = await rateEventVendor(session.user.id, id, await request.json(), eventReviewRepository)
    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    return toErrorResponse(error)
  }
}

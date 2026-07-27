import { NextResponse, type NextRequest } from 'next/server'
import { reviewCreateRepository } from '@/features/reviews/create/reviewCreate.repository'
import { createBookingReview, isReviewError } from '@/features/reviews/create/reviewCreate.service'
import { auth } from '@/lib/auth'
import { enforceRateLimit } from '@/lib/rate-limit/enforce'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  const limited = await enforceRateLimit('review', session.user.id)
  if (limited) return limited

  try {
    const review = await createBookingReview(session.user.id, await request.json(), reviewCreateRepository)
    return NextResponse.json(review, { status: review.updated ? 200 : 201 })
  } catch (error) {
    if (isReviewError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Не удалось сохранить отзыв' }, { status: 500 })
  }
}

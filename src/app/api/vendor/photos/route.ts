import { NextResponse, type NextRequest } from 'next/server'
import { galleryRepository } from '@/features/vendors/gallery/server/gallery.repository'
import { addPhoto, isGalleryError, listPhotos } from '@/features/vendors/gallery/server/gallery.service'
import { auth } from '@/lib/auth'

function toErrorResponse(error: unknown) {
  if (isGalleryError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: 'Не удалось обработать фото' }, { status: 500 })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  const photos = await listPhotos(session.user.id, galleryRepository)
  return NextResponse.json({ photos })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    const photo = await addPhoto(session.user.id, await request.json(), galleryRepository)
    return NextResponse.json({ photo }, { status: 201 })
  } catch (error) {
    return toErrorResponse(error)
  }
}

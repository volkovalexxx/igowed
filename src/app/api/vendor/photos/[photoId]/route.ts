import { NextResponse, type NextRequest } from 'next/server'
import { galleryRepository } from '@/features/vendors/gallery/server/gallery.repository'
import { deletePhoto, isGalleryError, setMainPhoto } from '@/features/vendors/gallery/server/gallery.service'
import { auth } from '@/lib/auth'

type PhotoRouteContext = {
  params: Promise<{ photoId: string }>
}

function toErrorResponse(error: unknown) {
  if (isGalleryError(error)) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return NextResponse.json({ error: 'Не удалось обработать фото' }, { status: 500 })
}

export async function PATCH(_request: NextRequest, context: PhotoRouteContext) {
  const session = await auth()
  const { photoId } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    await setMainPhoto(session.user.id, photoId, galleryRepository)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function DELETE(_request: NextRequest, context: PhotoRouteContext) {
  const session = await auth()
  const { photoId } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    await deletePhoto(session.user.id, photoId, galleryRepository)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return toErrorResponse(error)
  }
}

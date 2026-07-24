import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        photos: {
          orderBy: { order: 'asc' },
        },
        services: {
          include: { category: true, service: true },
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        specializations: true,
        user: {
          select: { id: true, email: true, name: true, image: true },
        },
      },
    })

    if (!vendor) {
      return NextResponse.json({ error: 'Подрядчик не найден' }, { status: 404 })
    }

    return NextResponse.json({ vendor })
  } catch (err) {
    console.error('[GET /api/vendors/[id]]', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params

    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const vendor = await prisma.vendor.findUnique({ where: { id } })
    if (!vendor) {
      return NextResponse.json({ error: 'Подрядчик не найден' }, { status: 404 })
    }

    const isOwner = vendor.userId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }

    const body = await req.json()

    // Whitelist updatable fields
    const allowedFields = [
      'firstName',
      'lastName',
      'username',
      'bio',
      'avatar',
      'cities',
      'phone',
      'phone2',
      'website',
      'instagram',
      'address',
      'lat',
      'lng',
      'workingHours',
      'businessType',
      'languages',
      'galleryDisplay',
      'cardDisplay',
      'pricePerHour',
      'currency',
      'isActive',
      'country',
      'bankDetails',
    ] as const

    const data: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        data[field] = body[field]
      }
    }

    // Специализации — связь, а не скалярное поле: пересобираем набор целиком.
    if (Array.isArray(body.specializations)) {
      const names = [...new Set((body.specializations as unknown[]).map((item) => String(item).trim()).filter(Boolean))]
      data.specializations = {
        deleteMany: {},
        create: names.map((name) => ({ name })),
      }
    }

    const updated = await prisma.vendor.update({
      where: { id },
      data,
    })

    return NextResponse.json({ vendor: updated })
  } catch (err) {
    console.error('[PATCH /api/vendors/[id]]', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

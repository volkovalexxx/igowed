import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        vendor: {
          include: {
            photos: {
              orderBy: { order: 'asc' },
              take: 4,
            },
            services: {
              include: { category: true },
            },
            specializations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ favorites })
  } catch (err) {
    console.error('[GET /api/favorites]', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const body = await req.json()
    const { vendorId } = body as { vendorId?: string }

    if (!vendorId) {
      return NextResponse.json({ error: 'vendorId обязателен' }, { status: 400 })
    }

    const vendorExists = await prisma.vendor.findUnique({ where: { id: vendorId } })
    if (!vendorExists) {
      return NextResponse.json({ error: 'Подрядчик не найден' }, { status: 404 })
    }

    const userId = session.user.id!

    const existing = await prisma.favorite.findUnique({
      where: { userId_vendorId: { userId, vendorId } },
    })

    if (existing) {
      await prisma.favorite.delete({
        where: { userId_vendorId: { userId, vendorId } },
      })
      return NextResponse.json({ action: 'removed' })
    }

    const favorite = await prisma.favorite.create({
      data: { userId, vendorId },
    })

    return NextResponse.json({ action: 'added', favorite }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/favorites]', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

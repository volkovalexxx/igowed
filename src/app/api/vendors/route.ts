import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Prisma } from '@/generated/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const category = searchParams.get('category') ?? undefined
    const city = searchParams.get('city') ?? undefined
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
    const minRating = searchParams.get('minRating')
      ? Number(searchParams.get('minRating'))
      : undefined
    const search = searchParams.get('search') ?? undefined
    const sort = searchParams.get('sort') ?? 'rating'
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '20')))

    const where: Prisma.VendorWhereInput = {
      isActive: true,
    }

    if (city) {
      where.cities = { has: city }
    }

    if (category) {
      where.services = {
        some: {
          category: { slug: category },
        },
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.pricePerHour = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      }
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating }
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ]
    }

    const orderBy: Prisma.VendorOrderByWithRelationInput =
      sort === 'price_asc'
        ? { pricePerHour: 'asc' }
        : sort === 'price_desc'
          ? { pricePerHour: 'desc' }
          : sort === 'reviews'
            ? { reviewCount: 'desc' }
            : sort === 'newest'
              ? { createdAt: 'desc' }
              : { rating: 'desc' }

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          photos: {
            orderBy: { order: 'asc' },
            take: 4,
          },
          services: {
            include: { category: true, service: true },
          },
          specializations: true,
        },
      }),
      prisma.vendor.count({ where }),
    ])

    return NextResponse.json({
      vendors,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('[GET /api/vendors]', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }
    if (session.user.role !== 'VENDOR') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
    }

    const body = await req.json()
    const {
      firstName,
      lastName,
      username,
      slug,
      bio,
      cities,
      phone,
      website,
      instagram,
      pricePerHour,
      currency,
      businessType,
    } = body

    if (!firstName || !lastName || !username || !slug) {
      return NextResponse.json(
        { error: 'Поля firstName, lastName, username и slug обязательны' },
        { status: 400 }
      )
    }

    const existing = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
    })
    if (existing) {
      return NextResponse.json({ error: 'Профиль подрядчика уже существует' }, { status: 409 })
    }

    const vendor = await prisma.vendor.create({
      data: {
        userId: session.user.id!,
        firstName,
        lastName,
        username,
        slug,
        bio: bio ?? null,
        cities: cities ?? [],
        phone: phone ?? null,
        website: website ?? null,
        instagram: instagram ?? null,
        pricePerHour: pricePerHour ?? null,
        currency: currency ?? 'RUB',
        businessType: businessType ?? null,
      },
    })

    return NextResponse.json({ vendor }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/vendors]', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

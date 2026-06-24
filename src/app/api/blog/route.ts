import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { MOCK_BLOG } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? '10')))
    const category = searchParams.get('category') ?? undefined

    try {
      const where = category ? { category } : {}

      const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
          where,
          orderBy: { publishedAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.blogPost.count({ where }),
      ])

      return NextResponse.json({
        posts,
        total,
        page,
        pages: Math.ceil(total / limit),
      })
    } catch {
      // DB not available — return mock data
      const filtered = category
        ? MOCK_BLOG.filter((p) => p.cat === category)
        : MOCK_BLOG

      const sliced = filtered.slice((page - 1) * limit, page * limit)

      return NextResponse.json({
        posts: sliced,
        total: filtered.length,
        page,
        pages: Math.ceil(filtered.length / limit),
        mock: true,
      })
    }
  } catch (err) {
    console.error('[GET /api/blog]', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
    }

    const role = (session.user as { role?: string }).role
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ разрешён только администраторам' }, { status: 403 })
    }

    const body = await req.json()
    const { title, slug, excerpt, content, image, category } = body

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Поля title и slug обязательны' },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt ?? null,
        content: content ?? '',
        image: image ?? null,
        category: category ?? null,
        publishedAt: new Date(),
      },
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/blog]', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

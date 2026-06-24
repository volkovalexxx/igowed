import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { MOCK_BLOG } from '@/lib/mock-data'

type Params = { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params

    try {
      const post = await prisma.blogPost.findUnique({
        where: { slug },
      })

      if (!post) {
        return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 })
      }

      return NextResponse.json({ post })
    } catch {
      // DB not available — return mock data
      const post = MOCK_BLOG.find((p) => p.slug === slug || String(p.id) === slug)

      if (!post) {
        return NextResponse.json({ error: 'Статья не найдена' }, { status: 404 })
      }

      return NextResponse.json({ post, mock: true })
    }
  } catch (err) {
    console.error('[GET /api/blog/[slug]]', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

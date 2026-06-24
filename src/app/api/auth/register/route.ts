import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { Role } from '@/generated/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name, role, category, city } = body as {
      email: string
      password: string
      name: string
      role: 'CLIENT' | 'VENDOR'
      category?: string
      city?: string
    }

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Поля email, password, name и role обязательны' }, { status: 400 })
    }

    if (!['CLIENT', 'VENDOR'].includes(role)) {
      return NextResponse.json({ error: 'Недопустимое значение role' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role as Role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    if (role === 'VENDOR') {
      const nameParts = name.trim().split(/\s+/)
      const firstName = nameParts[0] ?? name
      const lastName = nameParts.slice(1).join(' ') || firstName

      const baseSlug = slugify(name) || `vendor-${user.id.slice(0, 8)}`
      let slug = baseSlug
      let attempt = 0
      while (await prisma.vendor.findUnique({ where: { slug } })) {
        attempt += 1
        slug = `${baseSlug}-${attempt}`
      }

      const baseUsername = slugify(name).replace(/-/g, '_') || `user_${user.id.slice(0, 8)}`
      let username = baseUsername
      let uAttempt = 0
      while (await prisma.vendor.findUnique({ where: { username } })) {
        uAttempt += 1
        username = `${baseUsername}_${uAttempt}`
      }

      await prisma.vendor.create({
        data: {
          userId: user.id,
          slug,
          firstName,
          lastName,
          username,
          cities: city ? [city] : [],
          businessType: category ?? null,
        },
      })
    }

    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    console.error('[register]', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

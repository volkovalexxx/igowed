import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { createRegisterAccount, isRegisterError } from '@/features/auth/server/register.service'
import type { RegisterDeps } from '@/features/auth/server/register.types'

const registerDeps: RegisterDeps = {
  hashPassword: (password) => bcrypt.hash(password, 12),
  findUserByEmail: (email) => prisma.user.findUnique({ where: { email } }),
  createUser: (input) =>
    prisma.user.create({
      data: input,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    }),
  findVendorBySlug: (slug) => prisma.vendor.findUnique({ where: { slug } }),
  findVendorByUsername: (username) => prisma.vendor.findUnique({ where: { username } }),
  createVendor: async (input) => {
    await prisma.vendor.create({ data: input })
  },
}

export async function POST(req: NextRequest) {
  try {
    const user = await createRegisterAccount(await req.json(), registerDeps)
    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    if (isRegisterError(err)) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }

    console.error('[register]', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

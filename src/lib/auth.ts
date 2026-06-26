import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from './prisma'
import { isSessionRefreshDue, sessionMaxAgeSeconds, sessionUpdateAgeSeconds } from '@/features/auth/sessionPolicy'

async function refreshTokenUser(token: { id?: unknown; refreshedAt?: unknown }) {
  if (typeof token.id !== 'string' || !isSessionRefreshDue(token.refreshedAt)) return null

  return prisma.user.findUnique({
    where: {
      id: token.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
    },
  })
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: sessionMaxAgeSeconds,
    updateAge: sessionUpdateAgeSeconds,
  },
  jwt: {
    maxAge: sessionMaxAgeSeconds,
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) },
        })

        if (!user?.password) return null

        const ok = await bcrypt.compare(String(credentials.password), user.password)
        if (!ok) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { id: string; role?: string }).role
        token.refreshedAt = Date.now()
        return token
      }

      const refreshedUser = await refreshTokenUser(token)
      if (refreshedUser) {
        token.id = refreshedUser.id
        token.email = refreshedUser.email
        token.name = refreshedUser.name
        token.picture = refreshedUser.image
        token.role = refreshedUser.role
        token.refreshedAt = Date.now()
      }

      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from './prisma'
import { createTokenWindow, isRefreshTokenExpired, refreshTokenMaxAgeSeconds, shouldRefreshAccessToken } from '@/features/auth/sessionPolicy'

async function refreshTokenUser(token: { id?: unknown; accessTokenExpiresAt?: unknown; refreshTokenExpiresAt?: unknown }) {
  if (typeof token.id !== 'string') return null
  if (!shouldRefreshAccessToken(token.accessTokenExpiresAt, token.refreshTokenExpiresAt)) return null

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
    maxAge: refreshTokenMaxAgeSeconds,
    updateAge: 0,
  },
  jwt: {
    maxAge: refreshTokenMaxAgeSeconds,
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
        token.authExpired = false
        Object.assign(token, createTokenWindow())
        return token
      }

      if (isRefreshTokenExpired(token.refreshTokenExpiresAt)) {
        token.authExpired = true
        delete token.id
        delete token.role
        return token
      }

      const refreshedUser = await refreshTokenUser(token)
      if (refreshedUser) {
        token.id = refreshedUser.id
        token.email = refreshedUser.email
        token.name = refreshedUser.name
        token.picture = refreshedUser.image
        token.role = refreshedUser.role
        token.authExpired = false
        token.accessTokenExpiresAt = createTokenWindow().accessTokenExpiresAt
      }

      return token
    },
    session({ session, token }) {
      if (token && typeof token.id === 'string' && typeof token.role === 'string' && !token.authExpired) {
        session.user.id = token.id
        session.user.role = token.role
        session.accessTokenExpiresAt = token.accessTokenExpiresAt
        session.refreshTokenExpiresAt = token.refreshTokenExpiresAt
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})

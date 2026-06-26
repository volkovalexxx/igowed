import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
    accessTokenExpiresAt?: number
    refreshTokenExpiresAt?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
    accessTokenExpiresAt?: number
    refreshTokenExpiresAt?: number
    authExpired?: boolean
  }
}

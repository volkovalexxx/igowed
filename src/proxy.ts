import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

function getSignedInRedirect(role: unknown, req: NextRequest) {
  const target = role === 'VENDOR' ? '/dashboard/profile' : '/event'
  return NextResponse.redirect(new URL(target, req.url))
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isLoggedIn = Boolean(token)

  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/event')
  const isAuthEntry = pathname === '/login' || pathname === '/register' || pathname === '/register/email'

  if (isProtected && !isLoggedIn) {
    const url = new URL('/login', req.url)
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthEntry && isLoggedIn) {
    return getSignedInRedirect(token?.role, req)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/event/:path*', '/login', '/register', '/register/email'],
}

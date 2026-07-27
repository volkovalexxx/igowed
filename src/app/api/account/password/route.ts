import { NextResponse, type NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { isAccountError } from '@/features/account/account.errors'
import { accountSecurityRepository } from '@/features/account/security/accountSecurity.repository'
import { changePassword, type ChangePasswordDeps } from '@/features/account/security/accountSecurity.service'
import { auth } from '@/lib/auth'
import { enforceRateLimit } from '@/lib/rate-limit/enforce'

const deps: ChangePasswordDeps = {
  findPasswordHash: (userId) => accountSecurityRepository.findPasswordHash(userId),
  verifyPassword: (plain, hash) => bcrypt.compare(plain, hash),
  hashPassword: (plain) => bcrypt.hash(plain, 12),
  updatePassword: (userId, hash) => accountSecurityRepository.updatePassword(userId, hash),
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  const limited = await enforceRateLimit('password', session.user.id)
  if (limited) return limited

  try {
    await changePassword(session.user.id, await request.json(), deps)
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (isAccountError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Не удалось изменить пароль' }, { status: 500 })
  }
}

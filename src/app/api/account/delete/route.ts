import { NextResponse, type NextRequest } from 'next/server'
import { isAccountError } from '@/features/account/account.errors'
import { accountDeleteRepository } from '@/features/account/delete/accountDelete.repository'
import { deleteAccount } from '@/features/account/delete/accountDelete.service'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    await deleteAccount(session.user.id, await request.json(), accountDeleteRepository)
    return NextResponse.json({ ok: true })
  } catch (error) {
    if (isAccountError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Не удалось удалить аккаунт' }, { status: 500 })
  }
}

import { NextResponse, type NextRequest } from 'next/server'
import { adminVendorsRepository } from '@/features/admin/vendors/server/adminVendors.repository'
import { isAdminError, toggleVendorFlag } from '@/features/admin/vendors/server/adminVendors.service'
import { auth } from '@/lib/auth'

type AdminVendorContext = {
  params: Promise<{ vendorId: string }>
}

export async function PATCH(request: NextRequest, context: AdminVendorContext) {
  const session = await auth()
  const { vendorId } = await context.params

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 })
  }

  try {
    const result = await toggleVendorFlag(session.user.role, vendorId, await request.json(), adminVendorsRepository)
    return NextResponse.json(result)
  } catch (error) {
    if (isAdminError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Не удалось обновить подрядчика' }, { status: 500 })
  }
}

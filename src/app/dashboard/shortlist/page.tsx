import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { VendorBoardPage } from '@/features/vendors/board/VendorBoardPage'
import { vendorBoardRepository } from '@/features/vendors/board/server/vendorBoard.repository'
import { loadVendorBoard } from '@/features/vendors/board/server/vendorBoard.service'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Шорт-лист | I GO WED',
  description: 'Отобранные подрядчики для вашего мероприятия в личном кабинете I GO WED',
}

export default async function ShortlistRoute() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login?next=/dashboard/shortlist')
  }

  const board = await loadVendorBoard(session.user.id, 'shortlist', vendorBoardRepository)

  return <VendorBoardPage board={board} kind="shortlist" />
}

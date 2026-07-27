import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminVendorsClient } from '@/features/admin/vendors/AdminVendorsClient'
import { adminVendorsRepository } from '@/features/admin/vendors/server/adminVendors.repository'
import { listAdminVendors } from '@/features/admin/vendors/server/adminVendors.service'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Админ — подрядчики | I GO WED',
}

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login?next=/admin')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const vendors = await listAdminVendors(session.user.role, adminVendorsRepository)

  return <AdminVendorsClient initialVendors={vendors} />
}

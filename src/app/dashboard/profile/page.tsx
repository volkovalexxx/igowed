import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import VendorProfileEditor from '@/features/vendors/dashboard/VendorProfileEditor'
import { vendorDashboardRepository } from '@/features/vendors/dashboard/server/vendorDashboard.repository'
import { mapVendorToProfileForm } from '@/features/vendors/dashboard/vendorProfileForm'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Профиль | I GO WED',
}

export default async function DashboardProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login?next=/dashboard/profile')
  }

  const vendor = await vendorDashboardRepository.findByUserId(session.user.id)

  if (!vendor) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>
        <p style={{ fontSize: 16, marginBottom: 8 }}>Профиль подрядчика не найден</p>
        <p style={{ fontSize: 14 }}>Личный кабинет доступен подрядчикам. Зарегистрируйтесь как подрядчик, чтобы заполнить профиль.</p>
      </div>
    )
  }

  return <VendorProfileEditor initialAvatar={vendor.avatar} initialForm={mapVendorToProfileForm(vendor)} vendorId={vendor.id} />
}

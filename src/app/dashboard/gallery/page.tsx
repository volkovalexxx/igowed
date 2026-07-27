import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { GalleryClient } from '@/features/vendors/gallery/GalleryClient'
import { galleryRepository } from '@/features/vendors/gallery/server/gallery.repository'
import { listPhotos } from '@/features/vendors/gallery/server/gallery.service'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Галерея | I GO WED',
}

export default async function DashboardGalleryPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login?next=/dashboard/gallery')
  }

  const vendorId = await galleryRepository.findVendorIdForUser(session.user.id)

  if (!vendorId) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>
        <p style={{ fontSize: 16, marginBottom: 8 }}>Галерея доступна подрядчикам</p>
        <p style={{ fontSize: 14 }}>Зарегистрируйтесь как подрядчик, чтобы загружать работы.</p>
      </div>
    )
  }

  const photos = await listPhotos(session.user.id, galleryRepository)

  return <GalleryClient initialPhotos={photos} vendorId={vendorId} />
}

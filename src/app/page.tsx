import type { Metadata } from 'next'
import HomeMarketingPage from '@/features/home/HomeMarketingPage'
import { AuthenticatedHomePage } from '@/features/home/AuthenticatedHomePage'
import { homePreviewRepository } from '@/features/home/preview/server/homePreview.repository'
import { loadHomePreview } from '@/features/home/preview/server/homePreview.service'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'I GO WED',
  description: 'Сервис для организации мероприятий, поиска площадок и подрядчиков.',
}

export default async function HomePage() {
  const session = await auth()

  if (!session?.user?.id) {
    const preview = await loadHomePreview(homePreviewRepository)
    return <HomeMarketingPage blogPreview={preview.blog} vendorsPreview={preview.vendors} />
  }

  return <AuthenticatedHomePage user={session.user} />
}

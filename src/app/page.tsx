import type { Metadata } from 'next'
import HomeMarketingPage from '@/features/home/HomeMarketingPage'
import { AuthenticatedHomePage } from '@/features/home/AuthenticatedHomePage'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'I GO WED',
  description: 'Сервис для организации мероприятий, поиска площадок и подрядчиков.',
}

export default async function HomePage() {
  const session = await auth()

  if (!session?.user?.id) {
    return <HomeMarketingPage />
  }

  return <AuthenticatedHomePage user={session.user} />
}

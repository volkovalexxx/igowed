import type { Metadata } from 'next'
import HomeMarketingPage from '@/features/home/HomeMarketingPage'
import { AuthenticatedHomePage } from '@/features/home/AuthenticatedHomePage'
import { eventRepository } from '@/features/events/server/event.repository'
import { listEventsForUser } from '@/features/events/server/event.service'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'I GO WED',
  description: 'Сервис для организации мероприятий, поиска площадок и подрядчиков.',
}

async function getVendorSummary(userId: string) {
  return prisma.vendor.findUnique({
    where: {
      userId,
    },
    select: {
      slug: true,
      firstName: true,
      lastName: true,
      isActive: true,
      isVerified: true,
      rating: true,
      reviewCount: true,
      pricePerHour: true,
    },
  })
}

export default async function HomePage() {
  const session = await auth()

  if (!session?.user?.id) {
    return <HomeMarketingPage />
  }

  const isVendor = session.user.role === 'VENDOR'
  const [events, vendor] = await Promise.all([
    isVendor ? Promise.resolve([]) : listEventsForUser(session.user.id, eventRepository),
    isVendor ? getVendorSummary(session.user.id) : Promise.resolve(null),
  ])

  return <AuthenticatedHomePage user={session.user} events={events} vendor={vendor} />
}

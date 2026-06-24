import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { EventDetailsPage } from '@/features/events/details/EventDetailsPage'

type EventPageProps = {
  params: Promise<{
    id: string
  }>
}

export const metadata: Metadata = {
  title: 'Мероприятие | I GO WED',
}

export default async function EventPage({ params }: EventPageProps) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.id) {
    redirect(`/login?next=/event/${id}`)
  }

  const event = await prisma.event.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
  })

  if (!event) {
    notFound()
  }

  return <EventDetailsPage event={event} />
}

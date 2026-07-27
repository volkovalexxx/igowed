import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ClientBookingsClient } from '@/features/bookings/list/ClientBookingsClient'
import { clientBookingsRepository } from '@/features/bookings/list/server/clientBookings.repository'
import { listClientBookings } from '@/features/bookings/list/server/clientBookings.service'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Мои заявки | I GO WED',
}

export default async function BookingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login?next=/bookings')
  }

  const bookings = await listClientBookings(session.user.id, clientBookingsRepository)

  return <ClientBookingsClient initialBookings={bookings} />
}

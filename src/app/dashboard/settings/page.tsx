import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { SettingsClient } from '@/features/account/SettingsClient'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Настройки | I GO WED',
}

export default async function DashboardSettingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login?next=/dashboard/settings')
  }

  return <SettingsClient />
}

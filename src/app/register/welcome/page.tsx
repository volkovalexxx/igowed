import { AuthShell } from '@/features/auth/AuthShell'
import { WelcomeCard } from '@/features/auth/WelcomeCard'
import type { WelcomeRole } from '@/features/auth/auth.types'

type WelcomePageProps = {
  searchParams: Promise<{
    role?: string
  }>
}

export default async function RegisterWelcomePage({ searchParams }: WelcomePageProps) {
  const params = await searchParams
  const role: WelcomeRole = params.role === 'vendor' ? 'vendor' : 'client'

  return (
    <AuthShell centered showBrand={false}>
      <WelcomeCard role={role} />
    </AuthShell>
  )
}

import { AuthShell } from '@/features/auth/AuthShell'
import { WelcomeCard } from '@/features/auth/WelcomeCard'

type AuthenticatedHomePageProps = {
  user: {
    role?: string | null
  }
}

export function AuthenticatedHomePage({ user }: AuthenticatedHomePageProps) {
  const role = user.role === 'VENDOR' ? 'vendor' : 'client'

  return (
    <AuthShell centered showBrand={false}>
      <WelcomeCard role={role} />
    </AuthShell>
  )
}

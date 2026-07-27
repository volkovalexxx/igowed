import { AuthShell } from '@/features/auth/AuthShell'
import { HomeHub } from './hub/HomeHub'

type AuthenticatedHomePageProps = {
  user: {
    name?: string | null
    role?: string | null
  }
}

export function AuthenticatedHomePage({ user }: AuthenticatedHomePageProps) {
  return (
    <AuthShell centered showBrand={false}>
      <HomeHub name={user.name} role={user.role} />
    </AuthShell>
  )
}

export type HeaderViewer = {
  name: string | null
  role: string | null
}

type SessionLike = {
  user?: { id?: string | null; name?: string | null; role?: string | null } | null
} | null

/** Приводит серверную сессию к данным шапки; null — гость (покажем «Войти»). */
export function toHeaderViewer(session: SessionLike): HeaderViewer | null {
  const user = session?.user
  if (!user?.id) return null
  return { name: user.name ?? null, role: user.role ?? null }
}

/** Буква для аватара по имени; запасной символ, если имени нет. */
export function headerInitial(name: string | null): string {
  const trimmed = name?.trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() : '·'
}

export type WorkspaceTabKey = 'wedding' | 'favorites' | 'tasks' | 'guests' | 'seating' | 'timing' | 'budget'

export type WorkspaceTab = {
  key: WorkspaceTabKey
  label: string
  href: string
  isPlaceholder: boolean
}

type WorkspaceTabDefinition = {
  key: WorkspaceTabKey
  label: string
  buildHref(eventId: string): string
}

export const WORKSPACE_TABS: readonly WorkspaceTabDefinition[] = [
  { key: 'wedding', label: 'Моя свадьба', buildHref: (eventId) => `/event/${eventId}` },
  { key: 'favorites', label: 'Избранное', buildHref: () => '/dashboard/favorites' },
  { key: 'tasks', label: 'Список задач', buildHref: (eventId) => `/event/${eventId}/tasks` },
  { key: 'guests', label: 'Список гостей', buildHref: (eventId) => `/event/${eventId}/guests` },
  { key: 'seating', label: 'Рассадка', buildHref: () => '#' },
  { key: 'timing', label: 'Тайминг', buildHref: (eventId) => `/event/${eventId}/timing` },
  { key: 'budget', label: 'Бюджет', buildHref: (eventId) => `/event/${eventId}/budget` },
]

export function buildWorkspaceTabs(eventId: string): WorkspaceTab[] {
  return WORKSPACE_TABS.map((tab) => {
    const href = tab.buildHref(eventId)
    return { key: tab.key, label: tab.label, href, isPlaceholder: href === '#' }
  })
}

export function getWorkspaceTabLabels(): string[] {
  return WORKSPACE_TABS.map((tab) => tab.label)
}

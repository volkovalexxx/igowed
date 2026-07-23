import type { ReactNode } from 'react'
import { EventWorkspaceFooter } from './EventWorkspaceFooter'
import { EventWorkspaceHeader } from './EventWorkspaceHeader'
import { EventWorkspaceNav } from './EventWorkspaceNav'
import type { WorkspaceTabKey } from './workspaceTabs'
import styles from './EventWorkspaceChrome.module.css'

type EventWorkspaceChromeProps = {
  eventId: string
  active: WorkspaceTabKey
  children: ReactNode
}

/**
 * Рамка страниц воркспейса мероприятия: хедер, вкладки, футер.
 * Контентную обёртку страница задаёт сама — ширина и отступы отличаются от экрана к экрану.
 */
export function EventWorkspaceChrome({ eventId, active, children }: EventWorkspaceChromeProps) {
  return (
    <div className={styles.page}>
      <EventWorkspaceHeader />
      <EventWorkspaceNav active={active} eventId={eventId} />
      {children}
      <EventWorkspaceFooter />
    </div>
  )
}

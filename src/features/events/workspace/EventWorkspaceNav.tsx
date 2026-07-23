import Link from 'next/link'
import { buildWorkspaceTabs, type WorkspaceTabKey } from './workspaceTabs'
import styles from './EventWorkspaceChrome.module.css'

export function EventWorkspaceNav({ eventId, active }: { eventId: string; active: WorkspaceTabKey }) {
  return (
    <nav className={styles.workspaceNav} aria-label="Разделы мероприятия">
      {buildWorkspaceTabs(eventId).map((tab) => (
        <Link
          className={tab.key === active ? styles.activeTab : undefined}
          href={tab.href}
          key={tab.key}
          aria-current={tab.key === active ? 'page' : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}

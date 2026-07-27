import Link from 'next/link'
import { greetingName, hubLinksForRole, hubRoleLabel } from './hubLinks'
import { LogoutButton } from './LogoutButton'
import styles from './HomeHub.module.css'

export function HomeHub({ name, role }: { name?: string | null; role?: string | null }) {
  const links = hubLinksForRole(role)
  const displayName = greetingName(name)

  return (
    <section className={styles.hub}>
      <div className={styles.head}>
        <div>
          <span className={styles.roleBadge}>{hubRoleLabel(role)}</span>
          <h1 className={styles.title}>{displayName ? `Здравствуйте, ${displayName}!` : 'Здравствуйте!'}</h1>
          <p className={styles.subtitle}>Куда двигаемся дальше?</p>
        </div>
        <LogoutButton className={styles.logout} />
      </div>

      <div className={styles.grid}>
        {links.map((link) => (
          <Link className={styles.card} href={link.href} key={link.href}>
            <span className={styles.cardLabel}>{link.label}</span>
            <span className={styles.cardDesc}>{link.description}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

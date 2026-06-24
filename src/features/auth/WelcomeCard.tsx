import Link from 'next/link'
import styles from './AuthShell.module.css'
import type { WelcomeRole } from './auth.types'

type WelcomeCardProps = {
  role: WelcomeRole
}

export function WelcomeCard({ role }: WelcomeCardProps) {
  const isVendor = role === 'vendor'

  return (
    <section className={`${styles.welcomeCard} ${isVendor ? styles.welcomeVendor : ''}`}>
      <div className={styles.welcomeBadge}>
        <span>Благодарим за регистрацию</span>
        <span className={styles.welcomeHeart}>♥</span>
      </div>

      <h1 className={styles.welcomeTitle}>Добро пожаловать в сервис для организации мероприятий I GO WED!</h1>

      <p className={styles.welcomeText}>
        {isVendor
          ? 'Создайте профиль, добавьте портфолио и начните получать запросы от клиентов'
          : 'Здесь вы сможете создать мероприятие мечты, найти подрядчиков под ваш формат, стиль и бюджет и организовать все в одном месте'}
      </p>

      <div className={styles.welcomeActions}>
        {isVendor ? (
          <Link className={styles.actionDark} href="/dashboard/profile">
            Заполнить профиль
          </Link>
        ) : (
          <>
            <Link className={styles.actionDark} href="/dashboard">
              Создать мероприятие
            </Link>
            <Link className={styles.actionGold} href="/">
              На главную
            </Link>
          </>
        )}
      </div>
    </section>
  )
}

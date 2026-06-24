import Link from 'next/link'
import type { EventRecord } from '@/features/events/server/event.types'
import styles from './EventDetails.module.css'

function formatDate(date: Date | null) {
  if (!date) return 'Дата не выбрана'
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatRange(min: number | null, max: number | null, fallback: string) {
  if (min !== null && max !== null) return `${min} - ${max}`
  if (min !== null) return `от ${min}`
  if (max !== null) return `до ${max}`
  return fallback
}

function Header() {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarInner}>
        <Link className={styles.logo} href="/">
          I GO WED
        </Link>
        <nav className={styles.nav} aria-label="Основная навигация">
          <Link href="/">Главная</Link>
          <Link href="/event">Мои мероприятия</Link>
          <Link href="/catalog">Каталог</Link>
          <Link href="/blog">Блог</Link>
        </nav>
        <Link className={styles.goldButton} href="/event/new">
          Создать мероприятие
        </Link>
      </div>
    </header>
  )
}

export function EventDetailsPage({ event }: { event: EventRecord }) {
  const place = [event.country, event.city].filter(Boolean).join(', ') || 'Место не выбрано'
  const guests = formatRange(event.guestMin, event.guestMax, 'Гости не указаны')
  const budget = formatRange(event.budgetMin, event.budgetMax, 'Бюджет не указан')

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.summary}>
            <p className={styles.eyebrow}>{event.eventType}</p>
            <h1 className={styles.title}>{event.title}</h1>
            <div className={styles.meta}>
              <span className={styles.metaItem}>{formatDate(event.eventDate)}</span>
              <span className={styles.metaItem}>{event.eventTime || 'Время не выбрано'}</span>
              <span className={styles.metaItem}>{place}</span>
            </div>
          </div>

          <aside className={styles.sidePanel}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{guests}</span>
              <span className={styles.statLabel}>Количество гостей</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{budget}</span>
              <span className={styles.statLabel}>Бюджет</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{event.format || 'Не выбран'}</span>
              <span className={styles.statLabel}>Формат</span>
            </div>
            <Link className={styles.ghostButton} href="/event">
              К списку
            </Link>
          </aside>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Участники</h2>
          <div className={styles.chips}>
            {event.brideName ? <span className={styles.chip}>Невеста: {event.brideName}</span> : null}
            {event.groomName ? <span className={styles.chip}>Жених: {event.groomName}</span> : null}
            {!event.brideName && !event.groomName ? <p className={styles.empty}>Участники пока не указаны</p> : null}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Атмосфера</h2>
          {event.atmospheres.length > 0 ? (
            <div className={styles.chips}>
              {event.atmospheres.map((atmosphere) => (
                <span className={styles.chip} key={atmosphere}>
                  {atmosphere}
                </span>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Атмосфера пока не выбрана</p>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Комментарии</h2>
          {event.notes ? <p className={styles.notes}>{event.notes}</p> : <p className={styles.empty}>Комментариев пока нет</p>}
        </section>
      </main>
    </div>
  )
}

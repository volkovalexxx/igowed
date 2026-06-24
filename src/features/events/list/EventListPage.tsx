import Link from 'next/link'
import type { EventRecord } from '@/features/events/server/event.types'
import { formatEventDate, formatEventPlace, formatEventRange } from './eventList.format'
import styles from './EventList.module.css'

function Header() {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarInner}>
        <Link className={styles.logo} href="/">
          I GO WED
        </Link>
        <nav className={styles.nav} aria-label="Основная навигация">
          <Link href="/">Главная</Link>
          <Link href="/catalog?cat=venues">Площадки</Link>
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

function EventCover({ event }: { event: EventRecord }) {
  if (!event.coverUrl) {
    return (
      <div className={`${styles.cover} ${styles.coverEmpty}`}>
        <span>I GO WED</span>
      </div>
    )
  }

  return (
    <div
      aria-label={`Обложка мероприятия ${event.title}`}
      className={styles.cover}
      role="img"
      style={{ backgroundImage: `url(${event.coverUrl})` }}
    />
  )
}

function EventCard({ event }: { event: EventRecord }) {
  return (
    <Link className={styles.card} href={`/event/${event.id}`}>
      <EventCover event={event} />
      <div className={styles.cardBody}>
        <div className={styles.cardHead}>
          <div>
            <p className={styles.type}>{event.eventType}</p>
            <h2 className={styles.cardTitle}>{event.title}</h2>
          </div>
          <span className={styles.datePill}>{formatEventDate(event.eventDate)}</span>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Место</span>
            <span className={styles.metaValue}>{formatEventPlace(event.country, event.city)}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Гости</span>
            <span className={styles.metaValue}>{formatEventRange(event.guestMin, event.guestMax, 'чел.')}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Бюджет</span>
            <span className={styles.metaValue}>{formatEventRange(event.budgetMin, event.budgetMax, '₽')}</span>
          </span>
        </div>

        <div className={styles.chips}>
          {event.format ? <span className={styles.chip}>{event.format}</span> : null}
          {event.atmospheres.slice(0, 3).map((atmosphere) => (
            <span className={styles.chip} key={atmosphere}>
              {atmosphere}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <section className={styles.empty}>
      <h2 className={styles.emptyTitle}>Создайте первое мероприятие</h2>
      <p className={styles.emptyText}>
        Здесь будут храниться ваши события, референсы, бюджет, участники и выбранные подрядчики. Начните с базовой
        карточки, а детали будем наращивать по мере готовности модулей.
      </p>
      <Link className={styles.goldButton} href="/event/new">
        Создать мероприятие
      </Link>
    </section>
  )
}

export function EventListPage({ events }: { events: EventRecord[] }) {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Рабочая область</p>
            <h1 className={styles.title}>Ваши мероприятия и подготовка к ним</h1>
          </div>
          <aside className={styles.summary}>
            <span className={styles.summaryValue}>{events.length}</span>
            <span className={styles.summaryLabel}>Активных мероприятий</span>
          </aside>
        </section>

        {events.length > 0 ? (
          <section className={styles.grid} aria-label="Список мероприятий">
            {events.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </section>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  )
}

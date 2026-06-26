import Link from 'next/link'
import type { EventRecord } from '@/features/events/server/event.types'
import { formatEventDateCompact, formatEventPlaceShort } from './eventList.format'
import styles from './EventList.module.css'

const profileLinks = ['Профиль', 'Мероприятия', 'Избранное', 'Шортлист', 'Календарь занятости', 'Отзывы']

const placeholderEvents = [
  'Свадьба Анны и Максима',
  'Свадьба Ольги и Павла',
  'Девичник Анны',
  'Юбилей Андрея',
  'Корпоратив 2026',
  'Гендер-пати Александра и Веры',
]

const coverFallbacks = [
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
  null,
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
]

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link className={styles.logo} href="/">
          I GO WED
        </Link>
        <nav className={styles.mainNav} aria-label="Основная навигация">
          <Link href="/">Главная</Link>
          <Link href="/catalog?cat=venues">Площадки</Link>
          <Link href="/catalog">Каталог</Link>
          <Link href="/catalog?cat=photo">Фото</Link>
          <Link href="/blog">Блог</Link>
        </nav>
        <div className={styles.headerActions}>
          <Link className={styles.createHeaderButton} href="/event/new">
            Создать мероприятие
          </Link>
          <span>RUB⌄</span>
          <span>RU⌄</span>
          <span className={styles.iconButton}>⌕</span>
          <span className={styles.badgeIcon}>123</span>
          <span className={styles.avatar}>Анна</span>
        </div>
        <div className={styles.mobileActions}>
          <span className={styles.badgeIcon}>12</span>
          <span className={styles.iconButton}>⌕</span>
          <span className={styles.menuIcon} aria-hidden="true" />
        </div>
      </div>
      <nav className={styles.profileNav} aria-label="Навигация профиля">
        {profileLinks.map((link) => (
          <Link className={link === 'Мероприятия' ? styles.activeProfileLink : ''} href={link === 'Мероприятия' ? '/event' : '#'} key={link}>
            {link}
          </Link>
        ))}
      </nav>
    </header>
  )
}

function Filters() {
  return (
    <section className={styles.filters} aria-label="Фильтры мероприятий">
      <div className={styles.filterDateGroup}>
        <span className={styles.filterCaption}>Дата проведения</span>
        <button className={styles.filterPill} type="button">
          От ...
          <span>▣</span>
        </button>
        <button className={styles.filterPill} type="button">
          До ...
          <span>▣</span>
        </button>
      </div>
      <button className={styles.filterPill} type="button">
        Страна, город
        <span>⌕</span>
      </button>
      <button className={styles.filterPill} type="button">
        Свадьба
        <span>⌄</span>
      </button>
      <button className={styles.filterPill} type="button">
        Поиск...
        <span>⌕</span>
      </button>
      <button className={styles.textFilter} type="button">
        Фильтр⌄
      </button>
      <button className={styles.textFilter} type="button">
        Сортировка⌄
      </button>
      <button className={styles.textFilter} type="button">
        Сбросить все ⊗
      </button>
    </section>
  )
}

function EventCover({ coverUrl, title }: { coverUrl: string | null; title: string }) {
  if (!coverUrl) {
    return (
      <div className={`${styles.cardCover} ${styles.emptyCover}`}>
        <span className={styles.imageGlyph}>♟</span>
        <span>Добавить изображение</span>
      </div>
    )
  }

  return <div aria-label={`Обложка мероприятия ${title}`} className={styles.cardCover} role="img" style={{ backgroundImage: `url(${coverUrl})` }} />
}

function EventCard({ event, index }: { event: EventRecord; index: number }) {
  const coverUrl = event.coverUrl || coverFallbacks[index % coverFallbacks.length]

  return (
    <Link className={styles.eventCard} href={`/event/${event.id}`}>
      <EventCover coverUrl={coverUrl} title={event.title} />
      <span className={styles.cardShade} />
      <span className={styles.cardTitle}>{event.title}</span>
      <span className={styles.cardMeta}>
        <span>▣ {formatEventDateCompact(event.eventDate)}</span>
        <span>● {formatEventPlaceShort(event.city)}</span>
      </span>
    </Link>
  )
}

function PlaceholderCard({ title, index }: { title: string; index: number }) {
  const coverUrl = coverFallbacks[index % coverFallbacks.length]

  return (
    <div className={styles.eventCard} aria-hidden="true">
      <EventCover coverUrl={coverUrl} title={title} />
      <span className={styles.cardShade} />
      <span className={styles.cardTitle}>{title}</span>
      <span className={styles.cardMeta}>
        <span>▣ 12.07.2026</span>
        <span>● Москва</span>
      </span>
    </div>
  )
}

function EmptyState() {
  return (
    <section className={styles.emptyState}>
      <h2>Создайте первое мероприятие</h2>
      <p>После создания здесь появятся карточки с датой, городом и обложкой.</p>
      <Link className={styles.createButton} href="/event/new">
        <span>+</span>
        Создать мероприятие
      </Link>
    </section>
  )
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div>
          <p className={styles.footerLogo}>I GO WED</p>
          <nav className={styles.footerLinks} aria-label="Правовая информация">
            <Link href="#">Правила</Link>
            <Link href="#">Обратная связь</Link>
            <Link href="#">О нас</Link>
          </nav>
        </div>
        <nav className={styles.footerLinks} aria-label="Сервис">
          <Link href="#">Реклама</Link>
          <Link href="#">Логотипы I GO WED</Link>
          <Link href="#">Политика конфиденциальности</Link>
        </nav>
        <div className={styles.footerPills}>
          <span>USD&nbsp;&nbsp; Доллар США⌄</span>
          <span>🇷🇺&nbsp;&nbsp; Русский⌄</span>
        </div>
        <span className={styles.ageMark}>18+</span>
      </div>
      <p className={styles.copyright}>©2025 Сообщество свадебных и семейных фотографов | I GO WED</p>
    </footer>
  )
}

export function EventListPage({ events }: { events: EventRecord[] }) {
  const previewEvents = events.slice(0, 24)
  const placeholders = events.length === 0 ? [] : placeholderEvents.slice(0, Math.max(0, 12 - previewEvents.length))

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Главная</Link>
          <span>›</span>
          <span>Мероприятия</span>
        </div>
        <div className={styles.headingRow}>
          <h1>Мои мероприятия</h1>
          <Filters />
        </div>
        <Link className={styles.createButton} href="/event/new">
          <span>+</span>
          Создать мероприятие
        </Link>

        {previewEvents.length > 0 ? (
          <>
            <section className={styles.grid} aria-label="Список мероприятий">
              {previewEvents.map((event, index) => (
                <EventCard event={event} index={index} key={event.id} />
              ))}
              {placeholders.map((title, index) => (
                <PlaceholderCard index={index + previewEvents.length} key={title} title={title} />
              ))}
            </section>
            <button className={styles.loadMore} type="button">
              {previewEvents.length > 8 ? 'Развернуть' : 'Загрузить еще'}
            </button>
          </>
        ) : (
          <EmptyState />
        )}
      </main>
      <Footer />
    </div>
  )
}

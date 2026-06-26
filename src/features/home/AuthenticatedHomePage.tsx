import Link from 'next/link'
import type { EventRecord } from '@/features/events/server/event.types'
import styles from './AuthenticatedHomePage.module.css'

type VendorSummary = {
  slug: string
  firstName: string
  lastName: string
  isActive: boolean
  isVerified: boolean
  rating: number
  reviewCount: number
  pricePerHour: number | null
}

type AuthenticatedHomePageProps = {
  user: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
  events: EventRecord[]
  vendor: VendorSummary | null
}

function formatDate(date: Date | null) {
  if (!date) return 'Дата не выбрана'
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatMoney(value: number | null) {
  if (!value) return 'Не указан'
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'
}

function getUserName(user: AuthenticatedHomePageProps['user']) {
  return user.name || user.email || 'Пользователь'
}

function Topbar({ user }: { user: AuthenticatedHomePageProps['user'] }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarInner}>
        <Link className={styles.logo} href="/">
          I GO WED
        </Link>
        <nav className={styles.nav} aria-label="Основная навигация">
          <Link href="/catalog?cat=venues">Площадки</Link>
          <Link href="/catalog">Каталог</Link>
          <Link href="/catalog?cat=photo">Фото</Link>
          <Link href="/blog">Блог</Link>
        </nav>
        <div className={styles.userPill}>
          <span>{getUserName(user)}</span>
          <span>{user.role === 'VENDOR' ? 'Подрядчик' : 'Клиент'}</span>
        </div>
      </div>
    </header>
  )
}

function ClientHome({ events }: { events: EventRecord[] }) {
  const nextEvent = events[0]
  const eventHref = nextEvent ? `/event/${nextEvent.id}` : '/event/new'

  return (
    <>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Рабочая область клиента</p>
          <h1>Организация свадьбы в одном месте</h1>
          <p>События, задачи, гости, бюджет и подрядчики собраны в личном пространстве.</p>
        </div>
        <div className={styles.heroActions}>
          <Link className={styles.primaryButton} href={eventHref}>
            {nextEvent ? 'Открыть мероприятие' : 'Создать мероприятие'}
          </Link>
          <Link className={styles.secondaryButton} href="/catalog">
            Найти подрядчиков
          </Link>
        </div>
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <span className={styles.panelLabel}>Активные события</span>
          <strong className={styles.metric}>{events.length}</strong>
          <Link href="/event">Все мероприятия</Link>
        </article>
        <article className={styles.panel}>
          <span className={styles.panelLabel}>Ближайшая дата</span>
          <strong>{formatDate(nextEvent?.eventDate ?? null)}</strong>
          <span>{nextEvent?.title ?? 'Событие еще не создано'}</span>
        </article>
        <article className={styles.panel}>
          <span className={styles.panelLabel}>Бюджет</span>
          <strong>{formatMoney(nextEvent?.budgetMax ?? nextEvent?.budgetMin ?? null)}</strong>
          <span>{nextEvent ? 'По выбранному мероприятию' : 'Заполните после создания события'}</span>
        </article>
      </section>

      {nextEvent ? (
        <section className={styles.quickLinks} aria-label="Быстрые действия">
          <Link href={`/event/${nextEvent.id}/tasks`}>Список задач</Link>
          <Link href={`/event/${nextEvent.id}/guests`}>Список гостей</Link>
          <Link href={`/event/${nextEvent.id}`}>Моя свадьба</Link>
          <Link href="/dashboard/favorites">Избранное</Link>
        </section>
      ) : null}
    </>
  )
}

function VendorHome({ vendor }: { vendor: VendorSummary | null }) {
  const profileHref = vendor ? `/vendor/${vendor.slug}` : '/dashboard/profile'

  return (
    <>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Рабочая область подрядчика</p>
          <h1>Профиль, заявки и портфолио</h1>
          <p>Следите за видимостью профиля, обновляйте услуги и готовьте портфолио к публикации.</p>
        </div>
        <div className={styles.heroActions}>
          <Link className={styles.primaryButton} href="/dashboard/profile">
            Редактировать профиль
          </Link>
          <Link className={styles.secondaryButton} href={profileHref}>
            Посмотреть профиль
          </Link>
        </div>
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <span className={styles.panelLabel}>Статус</span>
          <strong>{vendor?.isActive ? 'Опубликован' : 'Черновик'}</strong>
          <span>{vendor?.isVerified ? 'Профиль проверен' : 'Нужна проверка данных'}</span>
        </article>
        <article className={styles.panel}>
          <span className={styles.panelLabel}>Рейтинг</span>
          <strong>{vendor ? vendor.rating.toFixed(1) : '0.0'}</strong>
          <span>{vendor?.reviewCount ?? 0} отзывов</span>
        </article>
        <article className={styles.panel}>
          <span className={styles.panelLabel}>Стоимость</span>
          <strong>{formatMoney(vendor?.pricePerHour ?? null)}</strong>
          <span>За час работы</span>
        </article>
      </section>

      <section className={styles.quickLinks} aria-label="Быстрые действия">
        <Link href="/dashboard/gallery">Галерея</Link>
        <Link href="/dashboard/orders">Заказы</Link>
        <Link href="/dashboard/messages">Сообщения</Link>
        <Link href="/dashboard/settings">Настройки</Link>
      </section>
    </>
  )
}

export function AuthenticatedHomePage({ user, events, vendor }: AuthenticatedHomePageProps) {
  const isVendor = user.role === 'VENDOR'

  return (
    <div className={styles.page}>
      <Topbar user={user} />
      <main className={styles.content}>
        <div className={styles.welcome}>
          <span>Добро пожаловать</span>
          <strong>{getUserName(user)}</strong>
        </div>
        {isVendor ? <VendorHome vendor={vendor} /> : <ClientHome events={events} />}
      </main>
    </div>
  )
}

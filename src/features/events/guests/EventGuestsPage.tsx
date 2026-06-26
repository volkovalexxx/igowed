'use client'

import Link from 'next/link'
import type { ChangeEvent } from 'react'
import { useMemo, useState } from 'react'
import { booleanLabels, rsvpLabels, sideLabels } from './eventGuests.data'
import { filterGuestsByStatus, getRsvpLabel, getSideLabel } from './eventGuests.format'
import type { EventGuest, GuestRsvpStatus, GuestSide } from './eventGuests.types'
import styles from './EventGuestsPage.module.css'

type GuestPatch = Partial<Pick<EventGuest, 'fullName' | 'rsvpStatus' | 'side' | 'needsTransfer' | 'needsAccommodation' | 'comment'>>

function Header({ eventId }: { eventId: string }) {
  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
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
            <Link className={styles.goldButton} href="/event/new">
              Создать мероприятие
            </Link>
            <span className={styles.currency}>RUB⌄</span>
            <span className={styles.currency}>RU⌄</span>
            <button className={styles.iconButton} type="button" aria-label="Поиск">
              ⌕
            </button>
            <button className={styles.iconButton} type="button" aria-label="Уведомления">
              ♡<span className={styles.badge}>123</span>
            </button>
            <button className={styles.iconButton} type="button" aria-label="Сообщения">
              ✉<span className={styles.badge}>1</span>
            </button>
            <span className={styles.user}>Анна</span>
            <button className={styles.menuButton} type="button" aria-label="Меню">
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <nav className={styles.workspaceNav} aria-label="Разделы мероприятия">
        <Link href={`/event/${eventId}`}>Моя свадьба</Link>
        <Link href="/dashboard/favorites">Избранное</Link>
        <Link href={`/event/${eventId}/tasks`}>Список задач</Link>
        <Link className={styles.activeTab} href={`/event/${eventId}/guests`}>
          Список гостей
        </Link>
        <Link href="#">Рассадка</Link>
        <Link href="#">Тайминг</Link>
        <Link href="#">Бюджет</Link>
      </nav>
    </>
  )
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div>
          <p className={styles.footerLogo}>I GO WED</p>
          <div className={styles.footerLinks}>
            <Link href="#">Правила</Link>
            <Link href="#">Обратная связь</Link>
            <Link href="#">О нас</Link>
          </div>
        </div>
        <div className={styles.footerLinks}>
          <Link href="#">Реклама</Link>
          <Link href="#">Логотипы I GO WED</Link>
          <Link href="#">Политика конфиденциальности</Link>
        </div>
        <div className={styles.footerPills}>
          <span className={styles.footerPill}>USD&nbsp;&nbsp; Доллар США⌄</span>
          <span className={styles.footerPill}>RU&nbsp;&nbsp; Русский⌄</span>
        </div>
        <div className={styles.age}>18+</div>
      </div>
      <div className={styles.copyright}>©2025 Сообщество свадебных и семейных фотографов | I GO WED</div>
    </footer>
  )
}

function BooleanSelect({ value, onChange }: { value: boolean; onChange(value: boolean): void }) {
  return (
    <select className={styles.select} value={String(value)} onChange={(event) => onChange(event.target.value === 'true')}>
      <option value="true">{booleanLabels.true}</option>
      <option value="false">{booleanLabels.false}</option>
    </select>
  )
}

function RsvpSelect({ value, onChange }: { value: GuestRsvpStatus; onChange(value: GuestRsvpStatus): void }) {
  return (
    <select className={styles.select} value={value} onChange={(event) => onChange(event.target.value as GuestRsvpStatus)}>
      <option value="confirmed">{rsvpLabels.confirmed}</option>
      <option value="declined">{rsvpLabels.declined}</option>
      <option value="pending">{rsvpLabels.pending}</option>
    </select>
  )
}

function SideSelect({ value, onChange }: { value: GuestSide; onChange(value: GuestSide): void }) {
  return (
    <select className={styles.select} value={value} onChange={(event) => onChange(event.target.value as GuestSide)}>
      <option value="bride">{sideLabels.bride}</option>
      <option value="groom">{sideLabels.groom}</option>
    </select>
  )
}

function readErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Не удалось сохранить изменения'
}

async function readJsonOrThrow(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as { error?: string }
  if (!response.ok) throw new Error(payload.error ?? 'Не удалось сохранить изменения')
  return payload
}

export function EventGuestsPage({ eventId, initialGuests }: { eventId: string; initialGuests: EventGuest[] }) {
  const [guests, setGuests] = useState(initialGuests)
  const [status, setStatus] = useState<'all' | GuestRsvpStatus>('all')
  const [expandedGuestId, setExpandedGuestId] = useState(initialGuests[1]?.id ?? initialGuests[0]?.id ?? '')
  const [error, setError] = useState('')
  const visibleGuests = useMemo(() => filterGuestsByStatus(guests, status), [guests, status])

  async function updateGuest(guest: EventGuest, patch: GuestPatch) {
    setError('')
    const previousGuests = guests
    setGuests((current) => current.map((item) => (item.id === guest.id ? { ...item, ...patch } : item)))

    try {
      const payload = (await readJsonOrThrow(
        await fetch(`/api/events/${eventId}/guests/${guest.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        }),
      )) as { guest?: EventGuest }

      if (payload.guest) {
        setGuests((current) => current.map((item) => (item.id === guest.id ? (payload.guest as EventGuest) : item)))
      }
    } catch (saveError) {
      setGuests(previousGuests)
      setError(readErrorMessage(saveError))
    }
  }

  async function addGuest() {
    setError('')

    try {
      const payload = (await readJsonOrThrow(
        await fetch(`/api/events/${eventId}/guests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName: 'Введите данные...' }),
        }),
      )) as { guest?: EventGuest }

      if (payload.guest) {
        setGuests((current) => [...current, payload.guest as EventGuest])
        setExpandedGuestId(payload.guest.id)
      }
    } catch (saveError) {
      setError(readErrorMessage(saveError))
    }
  }

  function updateName(guest: EventGuest, event: ChangeEvent<HTMLInputElement>) {
    void updateGuest(guest, { fullName: event.target.value })
  }

  return (
    <div className={styles.page}>
      <Header eventId={eventId} />
      <main className={styles.content}>
        <div className={styles.breadcrumbs}>Главная › Моя свадьба › Список гостей</div>
        <section className={styles.headingRow}>
          <h1>Список гостей</h1>
          <div className={styles.actions}>
            <label className={styles.filter}>
              <span>Фильтр</span>
              <select value={status} onChange={(event) => setStatus(event.target.value as 'all' | GuestRsvpStatus)}>
                <option value="all">Все</option>
                <option value="confirmed">Подтвержденные</option>
                <option value="pending">Не подтвержденные</option>
                <option value="declined">Отказались</option>
              </select>
            </label>
            <button className={styles.addButton} type="button" onClick={addGuest}>
              Добавить гостя <span>+</span>
            </button>
          </div>
        </section>
        {error ? <p className={styles.error}>{error}</p> : null}

        <section className={styles.desktopTable} aria-label="Список гостей">
          <div className={styles.tableHead}>
            <span />
            <span>Имя, фамилия</span>
            <span>Подтвердил участие</span>
            <span>Сторона участия</span>
            <span>Нужен трансфер</span>
            <span>Нужно размещение</span>
            <span>Комментарий</span>
          </div>
          {visibleGuests.map((guest, index) => (
            <div className={styles.tableRow} key={guest.id}>
              <strong>{index + 1}</strong>
              <input className={styles.nameInput} value={guest.fullName} onChange={(event) => updateName(guest, event)} />
              <RsvpSelect value={guest.rsvpStatus} onChange={(value) => updateGuest(guest, { rsvpStatus: value })} />
              <SideSelect value={guest.side} onChange={(value) => updateGuest(guest, { side: value })} />
              <BooleanSelect value={guest.needsTransfer} onChange={(value) => updateGuest(guest, { needsTransfer: value })} />
              <BooleanSelect value={guest.needsAccommodation} onChange={(value) => updateGuest(guest, { needsAccommodation: value })} />
              <button className={styles.commentLink} type="button" onClick={() => updateGuest(guest, { comment: guest.comment ? null : 'Комментарий' })}>
                {guest.comment ? 'Смотреть комментарий' : 'Добавить комментарий'}
              </button>
            </div>
          ))}
        </section>

        <section className={styles.mobileList} aria-label="Список гостей">
          {visibleGuests.map((guest, index) => {
            const isExpanded = expandedGuestId === guest.id
            return (
              <article className={styles.mobileGuest} key={guest.id}>
                <button className={styles.mobileGuestHeader} type="button" onClick={() => setExpandedGuestId(isExpanded ? '' : guest.id)}>
                  <strong>
                    {index + 1}. {guest.fullName}
                  </strong>
                  <span className={guest.rsvpStatus === 'confirmed' ? styles.confirmed : styles.pending}>
                    {guest.rsvpStatus === 'confirmed' ? '✓ ' : ''}
                    {getRsvpLabel(guest.rsvpStatus)}
                  </span>
                  <span>{isExpanded ? '⌃' : '⌄'}</span>
                </button>
                {isExpanded ? (
                  <div className={styles.mobileGuestBody}>
                    <p>{getSideLabel(guest.side)}</p>
                    <p>{guest.needsTransfer ? 'Нужен трансфер' : 'Трансфер не нужен'}</p>
                    <p>{guest.needsAccommodation ? 'Нужно размещение' : 'Размещение не нужно'}</p>
                    <button className={styles.mobileComment} type="button">
                      Комментарий
                    </button>
                  </div>
                ) : null}
              </article>
            )
          })}
        </section>
      </main>
      <Footer />
    </div>
  )
}

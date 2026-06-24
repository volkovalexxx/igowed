'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, ReactNode, useState } from 'react'
import styles from './CreateEvent.module.css'
import { eventAtmospheres, eventFormats, eventWorkspaceTabs } from './createEvent.constants'

type CreateEventResponse = {
  event?: {
    id: string
  }
  error?: string
}

function IconImage() {
  return (
    <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 18h16L15 11l-4 5-3-3-4 5Z" fill="currentColor" />
      <circle cx="9" cy="8" r="2" fill="currentColor" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg className={styles.fieldIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconPin() {
  return (
    <svg className={styles.fieldIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function Header() {
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
          <div className={styles.topActions}>
            <Link className={`${styles.goldButton} ${styles.desktopOnly}`} href="/event/new">
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
            <button className={`${styles.iconButton} ${styles.mailButton}`} type="button" aria-label="Сообщения">
              ✉<span className={styles.badge}>1</span>
            </button>
            <Link className={styles.avatar} href="/event/new">
              <span className={styles.avatarCircle}>O</span>
              <span>Ольга</span>
            </Link>
          </div>
        </div>
      </header>
      <nav className={styles.workspaceNav} aria-label="Разделы мероприятия">
        <div className={styles.workspaceInner}>
          {eventWorkspaceTabs.map((tab, index) => (
            <span className={index === 0 ? styles.workspaceActive : ''} key={tab}>
              {tab}
            </span>
          ))}
        </div>
      </nav>
    </>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
    </label>
  )
}

function TextInput({
  name,
  placeholder,
  icon,
  type = 'text',
}: {
  name: string
  placeholder: string
  icon?: ReactNode
  type?: string
}) {
  return (
    <span className={styles.inputWrap}>
      <input className={styles.input} name={name} placeholder={placeholder} type={type} />
      {icon}
    </span>
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
          <span className={styles.footerPill}>
            <span>USD&nbsp;&nbsp; Доллар США</span>
            <span>⌄</span>
          </span>
          <span className={styles.footerPill}>
            <span>RU&nbsp;&nbsp; Русский</span>
            <span>⌄</span>
          </span>
        </div>
        <div className={styles.age}>18+</div>
      </div>
      <div className={styles.copyright}>©2025 Сообщество свадебных и семейных фотографов | I GO WED</div>
    </footer>
  )
}

function formValue(formData: FormData, name: string) {
  return formData.get(name)?.toString().trim() ?? ''
}

function numberValue(formData: FormData, name: string) {
  const value = formValue(formData, name)
  return value.length > 0 ? value : undefined
}

export function CreateEventPage() {
  const router = useRouter()
  const [selectedFormat, setSelectedFormat] = useState(eventFormats[0])
  const [selectedAtmospheres, setSelectedAtmospheres] = useState<string[]>([eventAtmospheres[0]])
  const [error, setError] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const payload = {
      eventType: formValue(formData, 'eventType'),
      title: formValue(formData, 'title'),
      eventDate: formValue(formData, 'eventDate'),
      eventTime: formValue(formData, 'eventTime'),
      country: formValue(formData, 'country'),
      city: formValue(formData, 'city'),
      brideName: formValue(formData, 'brideName'),
      groomName: formValue(formData, 'groomName'),
      guestMin: numberValue(formData, 'guestMin'),
      guestMax: numberValue(formData, 'guestMax'),
      budgetMin: numberValue(formData, 'budgetMin'),
      budgetMax: numberValue(formData, 'budgetMax'),
      format: selectedFormat,
      atmospheres: selectedAtmospheres,
      notes: formValue(formData, 'notes'),
    }

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = (await response.json()) as CreateEventResponse

      if (!response.ok || !result.event?.id) {
        setError(result.error ?? 'Не удалось создать мероприятие')
        return
      }

      router.push(`/event/${result.event.id}`)
      router.refresh()
    } catch {
      setError('Не удалось связаться с сервером')
    } finally {
      setSubmitting(false)
    }
  }

  function toggleAtmosphere(atmosphere: string) {
    setSelectedAtmospheres((current) =>
      current.includes(atmosphere) ? current.filter((item) => item !== atmosphere) : [...current, atmosphere],
    )
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <aside className={styles.mediaColumn}>
          <div className={styles.uploadBox}>
            <IconImage />
          </div>
          <button className={`${styles.darkButton} ${styles.uploadButton}`} type="button">
            ▣ Загрузить фото
          </button>
        </aside>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Создать мероприятие</h1>
          <p className={styles.formNotice}>Заполните базовые данные. После создания откроется рабочая карточка события.</p>
          {error ? <p className={styles.formError}>{error}</p> : null}

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Общие данные</h2>
            <div className={styles.gridTwo}>
              <Field label="Тип мероприятия">
                <span className={styles.inputWrap}>
                  <select className={styles.select} defaultValue="Свадьба" name="eventType">
                    <option>Свадьба</option>
                    <option>День рождения</option>
                    <option>Корпоратив</option>
                    <option>Вечеринка</option>
                  </select>
                  <span>⌄</span>
                </span>
              </Field>
              <Field label="Название мероприятия">
                <TextInput name="title" placeholder="Введите название" />
              </Field>
              <Field label="Дата">
                <TextInput icon={<IconCalendar />} name="eventDate" placeholder="Выберите дату" type="date" />
              </Field>
              <Field label="Время">
                <TextInput name="eventTime" placeholder="Введите время" type="time" />
              </Field>
              <Field label="Страна">
                <TextInput icon={<IconPin />} name="country" placeholder="Выберите страну" />
              </Field>
              <Field label="Город">
                <TextInput name="city" placeholder="Введите название" />
              </Field>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Участники мероприятия</h2>
            <div className={styles.participants}>
              <Field label="Невеста">
                <TextInput name="brideName" placeholder="Введите имя" />
              </Field>
              <Field label="Жених">
                <TextInput name="groomName" placeholder="Введите имя" />
              </Field>
              <button className={styles.addParticipant} type="button">
                Добавить участника <span className={styles.plusDot}>+</span>
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Масштаб и формат</h2>
            <div className={styles.optionRow}>
              <div>
                <p className={styles.label}>Количество гостей</p>
                <div className={styles.segmented}>
                  <span className={`${styles.segment} ${styles.segmentActive}`}>Диапазон</span>
                  <span className={styles.segment}>Точное количество</span>
                </div>
              </div>
              <div className={styles.rangeGrid}>
                <TextInput name="guestMin" placeholder="От" type="number" />
                <TextInput name="guestMax" placeholder="До" type="number" />
              </div>
            </div>
            <div className={styles.optionRow}>
              <div>
                <p className={styles.label}>Бюджет</p>
                <div className={styles.segmented}>
                  <span className={`${styles.segment} ${styles.segmentActive}`}>Диапазон</span>
                  <span className={styles.segment}>Точная сумма</span>
                </div>
              </div>
              <div className={styles.rangeGrid}>
                <TextInput name="budgetMin" placeholder="От" type="number" />
                <TextInput name="budgetMax" placeholder="До" type="number" />
              </div>
            </div>
            <div className={styles.section}>
              <p className={styles.label}>Формат</p>
              <div className={styles.chips}>
                {eventFormats.map((format) => (
                  <button
                    className={`${styles.chipButton} ${format === selectedFormat ? styles.chipActive : ''}`}
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    type="button"
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Дополнительные сведения</h2>
            <p className={styles.label}>Атмосфера</p>
            <div className={styles.chips}>
              {eventAtmospheres.map((atmosphere) => (
                <button
                  className={`${styles.chipButton} ${selectedAtmospheres.includes(atmosphere) ? styles.chipActive : ''}`}
                  key={atmosphere}
                  onClick={() => toggleAtmosphere(atmosphere)}
                  type="button"
                >
                  {atmosphere}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <Field label="Комментарии и особые пожелания">
              <textarea
                className={styles.textarea}
                defaultValue="Профессиональная съемка мероприятий по всей Европе. Сохраняю атмосферу вашего события в каждом кадре"
                name="notes"
              />
            </Field>
          </section>

          <section className={styles.section}>
            <p className={styles.label}>Референсы</p>
            <div className={styles.referenceActions}>
              <button className={styles.darkButton} type="button">
                ▣ Создать папку
              </button>
              <button className={styles.darkButton} type="button">
                ▣ Загрузить фото
              </button>
            </div>
          </section>

          <div className={styles.formActions}>
            <button className={styles.goldButton} disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Создаем...' : 'Создать мероприятие'}
            </button>
            <Link className={styles.ghostButton} href="/">
              Отменить
            </Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}

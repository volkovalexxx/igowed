import Link from 'next/link'
import { EventReviewSection } from '@/features/events/review/EventReviewSection'
import type { EventVendorReview } from '@/features/events/review/eventReview.types'
import { profileNavLinks } from '@/features/vendors/board/vendorBoard.data'
import type { EventRecord } from '@/features/events/server/event.types'
import { formatEventDateNumeric, formatEventDateShort, formatEventNumber, formatEventPlace, getDaysUntilEvent } from './eventDetails.format'
import styles from './EventDetails.module.css'

const tutorialCards = [
  {
    title: 'Как выбрать фотографа',
    image: 'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=360&h=200&q=80',
  },
  {
    title: 'Как выбрать видеографа',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=360&h=200&q=80',
  },
  {
    title: 'Как подобрать свадебное платье',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=360&h=200&q=80',
  },
  {
    title: 'Как подобрать свадебный макияж',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=360&h=200&q=80',
  },
  {
    title: 'Как выбрать площадку для свадьбы',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=360&h=200&q=80',
  },
  {
    title: 'Как выбрать организатора',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=360&h=200&q=80',
  },
]

const referenceFolders = ['Общие', 'Образ невесты', 'Костюм жениха', 'Свадебный торт']

const contractorSlots = [
  {
    role: 'Фотограф',
    name: 'Дмитрий Логинов',
    username: '@loginov_pho',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    selected: true,
  },
  {
    role: 'Видеограф 1 / 2',
    name: 'Елизавета Комарова',
    username: '@elis_photo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    selected: true,
  },
  { role: 'Ведущий' },
  { role: 'Площадка' },
  { role: 'Декоратор' },
  { role: 'Транспорт' },
  { role: 'Женский образ' },
  { role: 'Визажист' },
  { role: 'Мужской образ' },
]

const recommendedVendors = [
  {
    role: 'Фотограф',
    name: 'Ковалева Ольга',
    price: 'от 5 000 RUB / час',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=360&h=360&q=80',
  },
  {
    role: 'Фотограф',
    name: 'Ковалева Ольга',
    price: 'от 5 000 RUB / час',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=360&h=360&q=80',
  },
  {
    role: 'Фотограф',
    name: 'Ковалева Ольга',
    price: 'от 5 000 RUB / час',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=360&h=360&q=80',
  },
  {
    role: 'Фотограф',
    name: 'Ковалева Ольга',
    price: 'от 5 000 RUB / час',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=360&h=360&q=80',
  },
  {
    role: 'Фотограф',
    name: 'Ковалева Ольга',
    price: 'от 5 000 RUB / час',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=360&h=360&q=80',
  },
  {
    role: 'Видеограф',
    name: 'Ковалева Ольга',
    price: 'от 5 000 RUB / час',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=360&h=360&q=80',
  },
]

const blogPosts = [
  {
    title: 'Хранить ли свадебное платье и аксессуары после свадьбы?',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=520&h=340&q=80',
  },
  {
    title: 'Хранить ли свадебное платье и аксессуары после свадьбы?',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=520&h=340&q=80',
  },
  {
    title: 'Свадебные приметы',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=520&h=340&q=80',
  },
  {
    title: 'В чем заключается секрет успешной организации торжества',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=520&h=340&q=80',
  },
]

function Header() {
  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link className={styles.logo} href="/">
            I GO WED
          </Link>
          <nav className={styles.nav} aria-label="Основная навигация">
            <Link href="/">Главная</Link>
            <Link href="/catalog?cat=venues">Площадки</Link>
            <Link href="/catalog">Каталог</Link>
            <Link href="/catalog?cat=photo">Фото</Link>
            <Link href="/blog">Блог</Link>
          </nav>
          <div className={styles.actions}>
            <Link className={styles.goldButton} href="/event/new">
              Создать мероприятие
            </Link>
            <span className={styles.currency}>RUB⌄</span>
            <span className={styles.currency}>RU⌄</span>
            <button className={styles.iconButton} type="button" aria-label="Поиск">
              ⌕
            </button>
            <button className={styles.iconButton} type="button" aria-label="Уведомления">
              ♡<span className={styles.badge}>23</span>
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
      <nav className={styles.subnav} aria-label="Разделы профиля">
        {profileNavLinks.map((link) => (
          <Link href={link.href} key={link.label}>
            {link.label}
          </Link>
        ))}
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
          <span className={styles.footerPill}>🇷🇺&nbsp;&nbsp; Русский⌄</span>
        </div>
        <div className={styles.age}>18+</div>
      </div>
      <div className={styles.copyright}>©2025 Сообщество свадебных и семейных фотографов | I GO WED</div>
    </footer>
  )
}

function SliderDots() {
  return (
    <div className={styles.dots} aria-hidden="true">
      <span className={styles.dotActive} />
      <span />
      <span />
      <span />
    </div>
  )
}

function SectionHeader({ title, action = 'Перейти в каталог' }: { title: string; action?: string }) {
  return (
    <div className={styles.sectionHeader}>
      <h2>{title}</h2>
      <div className={styles.sectionActions}>
        <Link className={styles.goldSmall} href="/catalog">
          {action}
        </Link>
        <button type="button" aria-label="Назад">
          ‹
        </button>
        <button type="button" aria-label="Вперед">
          ›
        </button>
      </div>
    </div>
  )
}

function EventCover({ event }: { event: EventRecord }) {
  const image =
    event.coverUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=620&h=720&q=80'

  return <div className={styles.cover} aria-label={`Обложка мероприятия ${event.title}`} role="img" style={{ backgroundImage: `url(${image})` }} />
}

function VendorSlot({ slot }: { slot: (typeof contractorSlots)[number] }) {
  return (
    <article className={styles.contractorCard}>
      <h3>{slot.role}</h3>
      {slot.selected ? (
        <>
          <p className={styles.contractorName}>{slot.name}</p>
          <p className={styles.contractorUser}>{slot.username}</p>
          <div className={styles.avatarWrap}>
            <button type="button" aria-label="Предыдущий">
              ‹
            </button>
            <span className={styles.vendorAvatar} style={{ backgroundImage: `url(${slot.avatar})` }} />
            <button type="button" aria-label="Следующий">
              ›
            </button>
          </div>
          <p className={styles.rating}>★★★★★ <span>4.0</span></p>
          <Link className={styles.lightButton} href="/vendor/dmitry-loginov">
            Перейти в профиль
          </Link>
          <button className={styles.blackButton} type="button">
            Отправить сообщение
          </button>
        </>
      ) : (
        <>
          <span className={styles.emptyAvatar}>●</span>
          <p className={styles.emptyText}>Исполнитель не выбран</p>
          <button className={styles.lightButton} type="button">
            Перейти в избранное ♡
          </button>
          <Link className={styles.blackButton} href="/catalog">
            Перейти в каталог
          </Link>
        </>
      )}
    </article>
  )
}

type EventDetailsPageProps = {
  event: EventRecord
  /** Мероприятие прошло: слоты подрядчиков уступают место карточкам с оценкой. */
  isFinished: boolean
  reviewVendors: EventVendorReview[]
}

export function EventDetailsPage({ event, isFinished, reviewVendors }: EventDetailsPageProps) {
  const place = formatEventPlace(event.country, event.city)
  const guests = formatEventNumber(event.guestMax ?? event.guestMin)
  const budget = formatEventNumber(event.budgetMax ?? event.budgetMin)
  const days = getDaysUntilEvent(event.eventDate) ?? 125
  const createdAt = formatEventDateNumeric(event.createdAt)
  const eventDate = formatEventDateNumeric(event.eventDate)
  const atmospheres = event.atmospheres.length > 0 ? event.atmospheres : ['Романтичная', 'Элегантная', 'Минимализм', 'Официальная']

  return (
    <div className={styles.page}>
      <Header />

      <main>
        <section className={styles.tutorials} aria-label="Полезные материалы">
          <button className={styles.sliderArrow} type="button" aria-label="Назад">
            ‹
          </button>
          <div className={styles.tutorialTrack}>
            {tutorialCards.map((card) => (
              <article className={styles.tutorialCard} key={card.title} style={{ backgroundImage: `url(${card.image})` }}>
                <span className={styles.play}>▶</span>
                <h3>{card.title}</h3>
              </article>
            ))}
          </div>
          <button className={styles.sliderArrow} type="button" aria-label="Вперед">
            ›
          </button>
          <SliderDots />
        </section>

        <section className={styles.eventIntro}>
          <div className={styles.mobileContext}>
            <Link href="/event" aria-label="Назад к мероприятиям">
              ‹
            </Link>
            <span>{event.title}</span>
          </div>
          <div className={styles.breadcrumbs}>Главная › Мероприятия › {event.title}</div>
          <div className={styles.eventGrid}>
            <EventCover event={event} />
            <div className={styles.eventInfo}>
              <h1>{event.title}</h1>
              <div className={styles.metaLine}>
                <span>▦ {formatEventDateShort(event.eventDate)}</span>
                <span>{event.eventTime || '07:00'}</span>
                <span>● {place}</span>
              </div>
              <p className={styles.description}>
                {event.notes ||
                  'Хотим, чтобы атмосфера была лёгкой и романтичной, без излишней помпезности. Важно уложиться в бюджет и чтобы подрядчики говорили на английском, так как часть гостей из-за границы.'}
              </p>
              <dl className={styles.facts}>
                <div>
                  <dt>Тип мероприятия</dt>
                  <dd>{event.eventType}</dd>
                </div>
                <div>
                  <dt>Формат</dt>
                  <dd>{event.format || 'Официальный'}</dd>
                </div>
                <div>
                  <dt>Количество гостей</dt>
                  <dd>{guests}</dd>
                </div>
                <div>
                  <dt>Бюджет</dt>
                  <dd>{budget}</dd>
                </div>
              </dl>
              <div className={styles.atmosphereBlock}>
                <p>Атмосфера</p>
                <div className={styles.chips}>
                  {atmospheres.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
            <aside className={styles.planner}>
              <div className={styles.plannerTop}>
                <strong>⏱ {days}</strong>
                <span>дней до свадьбы</span>
              </div>
              <div className={styles.quickActions}>
                <Link href={`/event/${event.id}/tasks`}>
                  <span>▣</span>
                  Список задач
                </Link>
                {['Документы', 'Референсы', 'Заметки'].map((item) => (
                  <button type="button" key={item}>
                    <span>▣</span>
                    {item}
                  </button>
                ))}
              </div>
              <div className={styles.progress}>
                <div>
                  <strong>17%</strong>
                  <span>выполнено</span>
                </div>
                <span className={styles.progressBar}>
                  <span />
                </span>
                <p>
                  <span>Мероприятие создано: {createdAt}</span>
                  <span>{eventDate}</span>
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className={styles.references}>
          <SectionHeader title="Референсы" />
          <div className={styles.folderGrid}>
            {referenceFolders.map((folder) => (
              <button className={styles.folderCard} type="button" key={folder}>
                <span>■</span>
                {folder}
                <b>›</b>
              </button>
            ))}
          </div>
          <SliderDots />
        </section>

        {isFinished ? (
          <EventReviewSection eventId={event.id} initialVendors={reviewVendors} />
        ) : (
        <section className={styles.contractors}>
          <SectionHeader title="Подрядчики для вашего мероприятия" />
          <div className={styles.contractorGrid}>
            {contractorSlots.map((slot) => (
              <VendorSlot key={slot.role} slot={slot} />
            ))}
            <article className={`${styles.contractorCard} ${styles.addContractor}`}>
              <button type="button">+</button>
              <p>Добавить подрядчика</p>
            </article>
          </div>
          <div className={styles.mobileContractorActions}>
            <button type="button">Добавить подрядчика +</button>
            <Link href="/catalog">Перейти в каталог</Link>
          </div>
        </section>
        )}

        <section className={styles.recommendations}>
          <SectionHeader title="Подобрано для вас" action="" />
          <div className={styles.vendorRow}>
            {recommendedVendors.map((vendor, index) => (
              <article className={styles.recommendCard} key={`${vendor.name}-${index}`}>
                <span style={{ backgroundImage: `url(${vendor.image})` }} />
                <p>{vendor.role}</p>
                <h3>{vendor.name}</h3>
                <small>{vendor.price}</small>
              </article>
            ))}
          </div>
          <SliderDots />
        </section>

        <section className={styles.blog}>
          <SectionHeader title="Блог" action="Смотреть все" />
          <div className={styles.blogGrid}>
            {blogPosts.map((post) => (
              <article className={styles.blogCard} key={post.title}>
                <span style={{ backgroundImage: `url(${post.image})` }} />
                <p>12.12.2025</p>
                <h3>{post.title}</h3>
                <small>
                  Вот вам яркий пример современных тенденций — разбор внешних противоречий предоставляет широкие возможности.
                </small>
                <Link href="/blog">Читать полностью</Link>
              </article>
            ))}
          </div>
          <SliderDots />
        </section>
      </main>

      <Footer />
    </div>
  )
}

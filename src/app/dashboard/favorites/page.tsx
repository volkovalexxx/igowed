import Link from 'next/link'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import styles from './FavoritesPage.module.css'

export const metadata: Metadata = {
  title: 'Избранное | I GO WED',
  description: 'Избранные подрядчики и рекомендации в личном кабинете I GO WED',
}

const profileLinks = [
  { href: '/dashboard/profile', label: 'Профиль' },
  { href: '/event', label: 'Мероприятия' },
  { href: '/dashboard/favorites', label: 'Избранное' },
  { href: '/dashboard/shortlist', label: 'Шортлист' },
  { href: '#', label: 'Календарь занятости' },
  { href: '#', label: 'Отзывы' },
]

const filterGroups = [
  {
    title: 'Фотосъёмка',
    items: ['Свадьба', 'Love story', 'Корпоратив', 'День рождения', 'Портрет', 'Беременность', 'Новорожденные', 'Дети', 'Реклама', 'Интерьер', 'Обработка'],
  },
  {
    title: 'Специалисты',
    items: ['Все специалисты', 'Ведущий', 'Видеограф', 'Визажист', 'Водитель', 'Декоратор', 'Диджей', 'Организатор', 'Фотограф', 'Другое'],
  },
]

type FavoriteVendor = Awaited<ReturnType<typeof getFavoriteVendors>>[number]

async function getFavoriteVendors(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      vendor: {
        include: {
          photos: { orderBy: { order: 'asc' }, take: 1 },
          services: { include: { category: true, service: true }, take: 1 },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (favorites.length > 0) {
    return favorites.map((favorite) => favorite.vendor)
  }

  return prisma.vendor.findMany({
    where: { isActive: true },
    include: {
      photos: { orderBy: { order: 'asc' }, take: 1 },
      services: { include: { category: true, service: true }, take: 1 },
    },
    orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
    take: 11,
  })
}

async function getRecommendedVendors() {
  return prisma.vendor.findMany({
    where: { isActive: true },
    include: {
      photos: { orderBy: { order: 'asc' }, take: 1 },
      services: { include: { category: true, service: true }, take: 1 },
    },
    orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
    take: 6,
  })
}

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
          <Link className={styles.createButton} href="/event/new">
            Создать мероприятие
          </Link>
          <span>RUB⌄</span>
          <span>RU⌄</span>
          <span className={styles.searchIcon}>⌕</span>
          <span className={styles.badge}>123</span>
          <span className={styles.avatar}>Анна</span>
        </div>
        <div className={styles.mobileActions}>
          <span className={styles.badge}>4</span>
          <span className={styles.searchIcon}>⌕</span>
          <span className={styles.menuIcon} aria-hidden="true" />
        </div>
      </div>
      <nav className={styles.profileNav} aria-label="Навигация профиля">
        {profileLinks.map((link) => (
          <Link className={link.href === '/dashboard/favorites' ? styles.activeProfileLink : ''} href={link.href} key={link.label}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

function Filters() {
  return (
    <aside className={styles.filters} aria-label="Фильтры избранного">
      <label className={styles.searchBox}>
        <span hidden>Поиск услуги</span>
        <input placeholder="Название услуги..." />
        <span>⌕</span>
      </label>
      <nav className={styles.categoryList} aria-label="Категории">
        <Link href="#">Все категории</Link>
        <Link href="#">Организация мероприятий⌄</Link>
        <Link href="#">Ведение мероприятий⌄</Link>
      </nav>
      {filterGroups.map((group, groupIndex) => (
        <section className={styles.filterGroup} key={group.title}>
          <h2>{group.title}</h2>
          {group.items.map((item, index) => (
            <label className={styles.switchRow} key={item}>
              <span className={`${styles.switch} ${groupIndex === 0 && index === 0 ? styles.switchOn : ''}`} />
              <span>{item}</span>
            </label>
          ))}
        </section>
      ))}
    </aside>
  )
}

function Toolbar() {
  return (
    <div className={styles.toolbar}>
      <label className={styles.citySearch}>
        <span hidden>Страна, город</span>
        <input placeholder="Страна, город" />
        <span>⌕</span>
      </label>
      <button type="button">Фильтр⌄</button>
      <button type="button">Сортировка⌄</button>
      <button type="button">Сбросить все ⊗</button>
    </div>
  )
}

function MessagePanel() {
  return (
    <section className={styles.messagePanel}>
      <h2>✉ Отправить сообщение подрядчикам</h2>
      <textarea placeholder="Введите сообщение" />
      <div className={styles.messageFooter}>
        <label>
          <span className={styles.radio} />
          Отправить всем
        </label>
        <label>
          <span className={`${styles.radio} ${styles.radioActive}`} />
          Выбрать подрядчиков
        </label>
        <button type="button">Отправить</button>
      </div>
    </section>
  )
}

function getVendorName(vendor: FavoriteVendor) {
  return `${vendor.firstName} ${vendor.lastName}`.trim()
}

function getVendorRole(vendor: FavoriteVendor) {
  return vendor.services[0]?.category.name || 'ФОТОГРАФ'
}

function getVendorImage(vendor: FavoriteVendor, index: number) {
  return (
    vendor.avatar ||
    vendor.photos[0]?.url ||
    [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&h=300&q=80',
    ][index % 3]
  )
}

function VendorMiniCard({ vendor, index }: { vendor: FavoriteVendor; index: number }) {
  return (
    <article className={styles.vendorCard}>
      <div className={styles.cardTop}>
        <label aria-label="Выбрать подрядчика">
          <input type="checkbox" />
        </label>
        <strong>{getVendorRole(vendor).toUpperCase()}</strong>
        <button type="button" aria-label="Удалить из избранного">
          ×
        </button>
      </div>
      <div className={styles.vendorBody}>
        <h3>{getVendorName(vendor)}</h3>
        <p>@{vendor.username}</p>
        <span className={styles.avatarWrap}>
          <span className={styles.vendorAvatar} style={{ backgroundImage: `url(${getVendorImage(vendor, index)})` }} />
          {vendor.isPro ? <span className={styles.pro}>PRO</span> : null}
        </span>
        <div className={styles.rating}>
          <span>★ ★ ★ ★ ☆</span>
          <b>{vendor.rating.toFixed(1)}</b>
        </div>
        <Link className={styles.profileButton} href={`/vendor/${vendor.slug}`}>
          Перейти в профиль
        </Link>
        <button className={styles.messageButton} type="button">
          Отправить сообщение
        </button>
      </div>
    </article>
  )
}

function RecommendationCard({ vendor, index }: { vendor: FavoriteVendor; index: number }) {
  return (
    <Link className={styles.recommendationCard} href={`/vendor/${vendor.slug}`}>
      <span className={styles.recommendationImage} style={{ backgroundImage: `url(${getVendorImage(vendor, index)})` }} />
      <span>{getVendorRole(vendor).toLowerCase()}</span>
      <strong>{getVendorName(vendor).toUpperCase()}</strong>
      <small>от {vendor.pricePerHour ? new Intl.NumberFormat('ru-RU').format(vendor.pricePerHour) : '5 000'} RUB / час</small>
    </Link>
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

export default async function FavoritesPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login?next=/dashboard/favorites')
  }

  const [vendors, recommended] = await Promise.all([getFavoriteVendors(session.user.id), getRecommendedVendors()])

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <div className={styles.mobileContext}>
          <Link href="/" aria-label="Назад">
            ‹
          </Link>
          <span>Избранное</span>
        </div>
        <div className={styles.breadcrumbs}>
          <Link href="/">Главная</Link>
          <span>›</span>
          <span>Избранное</span>
        </div>
        <div className={styles.titleRow}>
          <h1>Избранное</h1>
          <Toolbar />
        </div>
        <div className={styles.mobileFilters}>
          <button type="button">Страна, город ⌕</button>
          <button type="button">Свадебный фотограф⌄</button>
          <button type="button">Фильтр⌄</button>
          <button type="button">Сортировка⌄</button>
          <button type="button">Сбросить ⊗</button>
        </div>

        <section className={styles.layout}>
          <Filters />
          <div className={styles.results}>
            <MessagePanel />
            {vendors.map((vendor, index) => (
              <VendorMiniCard index={index} key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </section>

        <section className={styles.recommendations}>
          <div className={styles.sectionHeader}>
            <h2>Подобрано для вас</h2>
            <Link href="/catalog">Перейти в каталог</Link>
          </div>
          <div className={styles.recommendationGrid}>
            {recommended.map((vendor, index) => (
              <RecommendationCard index={index} key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

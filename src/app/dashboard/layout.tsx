'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Chat } from '@/components/ui/Icons'
import styles from './DashboardLayout.module.css'

const NAV_ITEMS = [
  { href: '/dashboard/profile', label: 'Профиль', icon: <ProfileIcon /> },
  { href: '/dashboard/gallery', label: 'Галерея', icon: <GalleryIcon /> },
  { href: '/dashboard/orders', label: 'Заказы', icon: <OrdersIcon /> },
  { href: '/dashboard/messages', label: 'Сообщения', icon: <Chat size={18} /> },
  { href: '/dashboard/settings', label: 'Настройки', icon: <SettingsIcon /> },
]

function ProfileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function GalleryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

function OrdersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function useIsActive(href: string) {
  const pathname = usePathname()
  return pathname === href || pathname.startsWith(href + '/')
}

function NavLink({ href, icon, label }: (typeof NAV_ITEMS)[number]) {
  const isActive = useIsActive(href)

  return (
    <Link className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`} href={href}>
      <span className={styles.navIcon}>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Link className={styles.sidebarBrand} href="/">
        <span>I GO WED</span>
        <small>Панель подрядчика</small>
      </Link>
      <nav className={styles.sidebarNav} aria-label="Панель подрядчика">
        {NAV_ITEMS.map((item) => (
          <NavLink {...item} key={item.href} />
        ))}
      </nav>
      <div className={styles.sidebarUser}>
        <span className={styles.userAvatar}>А</span>
        <span>
          <strong>Анна Смирнова</strong>
          <small>Фотограф</small>
        </span>
      </div>
    </aside>
  )
}

function MobileHeader() {
  return (
    <header className={styles.mobileHeader}>
      <Link className={styles.mobileLogo} href="/">
        I GO WED
      </Link>
      <div className={styles.mobileHeaderActions}>
        <span className={styles.mobileBadge}>12</span>
        <span className={styles.mobileSearch}>⌕</span>
        <span className={styles.menuIcon} aria-hidden="true" />
      </div>
    </header>
  )
}

function MobileNav() {
  return (
    <nav className={styles.mobileNav} aria-label="Панель подрядчика">
      {NAV_ITEMS.map((item) => (
        <NavLink {...item} key={item.href} />
      ))}
    </nav>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullBleedProfilePage = pathname === '/dashboard/favorites' || pathname === '/dashboard/shortlist'

  if (isFullBleedProfilePage) {
    return <>{children}</>
  }

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.mainColumn}>
        <MobileHeader />
        <MobileNav />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}

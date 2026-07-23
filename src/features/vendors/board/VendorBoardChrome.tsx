import Link from 'next/link'
import type { ReactNode } from 'react'
import { profileNavLinks } from './vendorBoard.data'
import styles from './VendorBoardPage.module.css'

function Header({ activeHref }: { activeHref: string }) {
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
        {profileNavLinks.map((link) => (
          <Link
            className={link.href === activeHref ? styles.activeProfileLink : ''}
            href={link.href}
            key={link.label}
            aria-current={link.href === activeHref ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
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

/** Рамка досок подрядчика: топбар, профильная навигация, футер. */
export function VendorBoardChrome({ activeHref, children }: { activeHref: string; children: ReactNode }) {
  return (
    <div className={styles.page}>
      <Header activeHref={activeHref} />
      {children}
      <Footer />
    </div>
  )
}

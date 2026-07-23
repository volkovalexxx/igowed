import Link from 'next/link'
import styles from './EventWorkspaceChrome.module.css'

export function EventWorkspaceHeader() {
  return (
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
  )
}

import Link from 'next/link'
import styles from './AuthShell.module.css'
import { authCopy } from './auth.constants'

type AuthShellProps = {
  children: React.ReactNode
  centered?: boolean
  showBrand?: boolean
}

export function AuthShell({ children, centered = false, showBrand = true }: AuthShellProps) {
  return (
    <div className={styles.page}>
      <main className={`${styles.main} ${centered ? styles.mainCentered : ''}`}>
        {showBrand ? (
          <section className={styles.panel}>
            <AuthBrand />
            {children}
          </section>
        ) : (
          children
        )}
      </main>
      <AuthFooter />
    </div>
  )
}

export function AuthBrand() {
  return (
    <header className={styles.brand}>
      <h1 className={styles.brandLogo}>{authCopy.brand}</h1>
      <p className={styles.brandTagline}>{authCopy.tagline}</p>
    </header>
  )
}

export function AuthFooter() {
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
        <div className={styles.footerSelects}>
          <div className={styles.selectPill}>
            <span className={styles.selectLeft}>
              <span className={styles.selectMuted}>USD</span>
              <span>Доллар США</span>
            </span>
            <span>⌄</span>
          </div>
          <div className={styles.selectPill}>
            <span className={styles.selectLeft}>
              <span>RU</span>
              <span>Русский</span>
            </span>
            <span>⌄</span>
          </div>
        </div>
        <div className={styles.ageMark} aria-label="18+">
          <span className={styles.ageShape}>18+</span>
        </div>
      </div>
      <div className={styles.copyright}>©2025 Сообщество свадебных и семейных фотографов | I GO WED</div>
    </footer>
  )
}

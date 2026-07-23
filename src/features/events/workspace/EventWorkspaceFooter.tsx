import Link from 'next/link'
import styles from './EventWorkspaceChrome.module.css'

export function EventWorkspaceFooter() {
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

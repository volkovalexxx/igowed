import Link from 'next/link'
import styles from './AuthShell.module.css'
import { authSocialProviders } from './auth.constants'
import type { AuthTab } from './auth.types'

type AuthTabsProps = {
  active: AuthTab
}

export function AuthTabs({ active }: AuthTabsProps) {
  return (
    <nav className={styles.tabs} aria-label="Авторизация">
      <Link className={`${styles.tab} ${active === 'login' ? styles.tabActive : ''}`} href="/login">
        Вход
      </Link>
      <Link className={`${styles.tab} ${active === 'register' ? styles.tabActive : ''}`} href="/register">
        Регистрация
      </Link>
    </nav>
  )
}

export function SocialButtons() {
  return (
    <div className={styles.socials} aria-label="Социальные сети">
      {authSocialProviders.map((provider) => (
        <button
          className={styles.socialButton}
          data-provider={provider.id}
          key={provider.id}
          type="button"
          aria-label={provider.id}
        >
          {provider.label}
        </button>
      ))}
    </div>
  )
}

export function AuthLegal() {
  return (
    <p className={styles.legal}>
      Продолжая, вы соглашаетесь с <Link href="#">Пользовательским соглашением</Link>,{' '}
      <Link href="#">Политикой конфиденциальности</Link> платформы и правилами ресурса
    </p>
  )
}

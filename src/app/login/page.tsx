'use client'

import { FormEvent, useState } from 'react'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AuthPasswordField, AuthTextField } from '@/features/auth/AuthFields'
import { AuthShell } from '@/features/auth/AuthShell'
import { AuthLegal, AuthTabs, SocialButtons } from '@/features/auth/AuthShared'
import { getPostAuthRedirect } from '@/features/auth/authRedirect'
import styles from '@/features/auth/AuthShell.module.css'

function getNextParam() {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('next')
}

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(event.currentTarget)
    const email = String(form.get('login') ?? '')
    const password = String(form.get('password') ?? '')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Неверный логин или пароль')
        return
      }

      const session = await getSession()
      router.replace(getPostAuthRedirect(session?.user?.role, getNextParam()))
      router.refresh()
    } catch {
      setError('Не удалось войти. Попробуйте еще раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <section className={styles.formArea}>
        <h2 className={styles.title}>Добро пожаловать!</h2>
        <AuthTabs active="login" />

        <form className={styles.form} onSubmit={handleSubmit}>
          <AuthTextField name="login" placeholder="Логин" autoComplete="username" required />
          <AuthPasswordField />
          {error && <p className={styles.error}>{error}</p>}
          <button className={`${styles.button} ${styles.buttonNarrow}`} disabled={loading} type="submit">
            {loading ? 'Входим...' : 'Войти'}
          </button>
          <a className={styles.forgot} href="#">
            Забыли пароль?
          </a>
        </form>

        <SocialButtons />
        <AuthLegal />
      </section>
    </AuthShell>
  )
}

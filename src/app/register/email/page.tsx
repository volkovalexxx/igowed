'use client'

import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AuthPasswordField, AuthTextField } from '@/features/auth/AuthFields'
import { AuthShell } from '@/features/auth/AuthShell'
import { AuthLegal, AuthTabs, SocialButtons } from '@/features/auth/AuthShared'
import styles from '@/features/auth/AuthShell.module.css'

export default function RegisterEmailPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '')
    const password = String(form.get('password') ?? '')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: email.split('@')[0],
          role: 'CLIENT',
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error ?? 'Не удалось зарегистрироваться')
        return
      }

      await signIn('credentials', { email, password, redirect: false })
      router.push('/register/welcome?role=client')
    } catch {
      setError('Не удалось зарегистрироваться. Попробуйте еще раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <section className={styles.formArea}>
        <h2 className={styles.title}>Добро пожаловать!</h2>
        <AuthTabs active="register" />

        <form className={styles.form} onSubmit={handleSubmit}>
          <AuthTextField
            name="email"
            type="email"
            placeholder="Адрес электронной почты"
            autoComplete="email"
            required
          />
          <AuthPasswordField autoComplete="new-password" />
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.button} disabled={loading} type="submit">
            {loading ? 'Создаем...' : 'Продолжить'}
          </button>
        </form>

        <SocialButtons />
        <AuthLegal />
      </section>
    </AuthShell>
  )
}

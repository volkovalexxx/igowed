'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthPasswordField, PhoneField } from '@/features/auth/AuthFields'
import { AuthShell } from '@/features/auth/AuthShell'
import { AuthLegal, AuthTabs, SocialButtons } from '@/features/auth/AuthShared'
import styles from '@/features/auth/AuthShell.module.css'

export default function RegisterPhonePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    router.push('/register/code')
  }

  return (
    <AuthShell>
      <section className={styles.formArea}>
        <h2 className={styles.title}>Добро пожаловать!</h2>
        <AuthTabs active="register" />

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldBlock}>
            <PhoneField />
            <p className={styles.fieldHint}>На этот номер вы получите SMS с кодом подтверждения</p>
          </div>
          <AuthPasswordField autoComplete="new-password" minLength={8} />
          <button className={styles.button} disabled={loading} type="submit">
            {loading ? 'Отправляем...' : 'Продолжить'}
          </button>
        </form>

        <SocialButtons />
        <AuthLegal />
      </section>
    </AuthShell>
  )
}

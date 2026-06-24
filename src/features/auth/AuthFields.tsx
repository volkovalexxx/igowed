'use client'

import { useState } from 'react'
import styles from './AuthShell.module.css'

type AuthTextFieldProps = {
  name: string
  type?: string
  placeholder: string
  autoComplete?: string
  required?: boolean
}

type AuthPasswordFieldProps = {
  name?: string
  placeholder?: string
  autoComplete?: string
  minLength?: number
}

export function AuthTextField({ name, type = 'text', placeholder, autoComplete, required }: AuthTextFieldProps) {
  return (
    <div className={styles.inputWrap}>
      <input
        className={styles.input}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
      />
    </div>
  )
}

export function AuthPasswordField({
  name = 'password',
  placeholder = 'Пароль',
  autoComplete = 'current-password',
  minLength,
}: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={styles.inputWrap}>
      <input
        className={styles.input}
        name={name}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        required
      />
      <button
        className={styles.eye}
        type="button"
        aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
        onClick={() => setVisible((value) => !value)}
      >
        <svg width="19" height="14" viewBox="0 0 19 14" fill="none" aria-hidden="true">
          <path
            d="M1 7s3-5.5 8.5-5.5S18 7 18 7s-3 5.5-8.5 5.5S1 7 1 7Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <circle cx="9.5" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
    </div>
  )
}

export function PhoneField() {
  return (
    <div className={styles.inputWrap}>
      <span className={styles.phonePrefix}>
        <span className={styles.flag}>BY</span>
        <span className={styles.chevron}>⌄</span>
        <span>+ 375</span>
      </span>
      <input
        className={styles.input}
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        aria-label="Телефон"
      />
    </div>
  )
}

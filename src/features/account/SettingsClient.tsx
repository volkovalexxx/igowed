'use client'

import { signOut } from 'next-auth/react'
import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Toggle from '@/components/ui/Toggle'
import { DELETE_CONFIRM_WORD } from './delete/accountDelete.validation'
import styles from './SettingsPage.module.css'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <h2>{title}</h2>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
  last,
}: {
  label: string
  description?: string
  value: boolean
  onChange: (v: boolean) => void
  last?: boolean
}) {
  return (
    <div className={last ? styles.toggleRowLast : styles.toggleRow}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink, #1A1A1A)', marginBottom: description ? 2 : 0 }}>{label}</div>
        {description && <div style={{ fontSize: 12, color: 'var(--muted, #6B6B6B)', lineHeight: 1.4 }}>{description}</div>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  )
}

function Field({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
}: {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={styles.input} />
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className={styles.selectField}>
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={styles.select}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function SettingsClient() {
  /* Notifications (client-side пока: доставка уведомлений появится вместе с email/push) */
  const [notifRequests, setNotifRequests] = useState(true)
  const [notifMessages, setNotifMessages] = useState(true)
  const [notifReviews, setNotifReviews] = useState(true)
  const [notifPromo, setNotifPromo] = useState(false)

  /* Security */
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  /* Locale (client-side пока: интерфейс ещё не локализован) */
  const [language, setLanguage] = useState('ru')
  const [currency, setCurrency] = useState('RUB')

  /* Delete account */
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function handleSavePassword() {
    setPasswordError('')
    setPasswordSaved(false)

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('Заполните все поля')
      return
    }
    if (newPassword.length < 8) {
      setPasswordError('Новый пароль должен быть не менее 8 символов')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Пароли не совпадают')
      return
    }

    setSavingPassword(true)
    try {
      const response = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: oldPassword, newPassword, confirmPassword }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error ?? 'Не удалось изменить пароль')
      }
      setPasswordSaved(true)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Не удалось изменить пароль')
    } finally {
      setSavingPassword(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleteError('')
    setDeleting(true)
    try {
      const response = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: deleteConfirmText }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? 'Не удалось удалить аккаунт')
      }
      await signOut({ redirectTo: '/' })
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Не удалось удалить аккаунт')
      setDeleting(false)
    }
  }

  return (
    <div className={styles.page}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink, #1A1A1A)', margin: '0 0 24px' }}>Настройки</h1>

      <Section title="Уведомления">
        <ToggleRow label="Новые заявки" description="Уведомления о поступлении новых заявок" value={notifRequests} onChange={setNotifRequests} />
        <ToggleRow label="Сообщения" description="Уведомления о новых сообщениях от клиентов" value={notifMessages} onChange={setNotifMessages} />
        <ToggleRow label="Отзывы" description="Уведомления о новых отзывах на ваш профиль" value={notifReviews} onChange={setNotifReviews} />
        <ToggleRow label="Акции и новости" description="Специальные предложения и обновления платформы" value={notifPromo} onChange={setNotifPromo} last />
      </Section>

      <Section title="Безопасность">
        <Field label="Текущий пароль" type="password" placeholder="Введите текущий пароль" value={oldPassword} onChange={setOldPassword} />
        <Field label="Новый пароль" type="password" placeholder="Минимум 8 символов" value={newPassword} onChange={setNewPassword} />
        <Field label="Подтвердите новый пароль" type="password" placeholder="Повторите новый пароль" value={confirmPassword} onChange={setConfirmPassword} />

        {passwordError && <p style={{ margin: '10px 0 0', fontSize: 13, color: 'var(--red, #E02C2C)' }}>{passwordError}</p>}
        {passwordSaved && <p style={{ margin: '10px 0 0', fontSize: 13, color: '#15803D' }}>Пароль успешно изменён</p>}

        <button type="button" onClick={handleSavePassword} disabled={savingPassword} className={styles.primaryButton}>
          {savingPassword ? 'Сохранение...' : 'Сохранить'}
        </button>
      </Section>

      <Section title="Язык и валюта">
        <div className={styles.localeGrid}>
          <SelectField
            label="Язык интерфейса"
            value={language}
            onChange={setLanguage}
            options={[
              { value: 'ru', label: 'Русский' },
              { value: 'en', label: 'English' },
            ]}
          />
          <SelectField
            label="Валюта"
            value={currency}
            onChange={setCurrency}
            options={[
              { value: 'RUB', label: 'RUB — Российский рубль' },
              { value: 'USD', label: 'USD — Доллар США' },
              { value: 'BYN', label: 'BYN — Белорусский рубль' },
            ]}
          />
        </div>
      </Section>

      <Section title="Аккаунт">
        <p style={{ fontSize: 14, color: 'var(--muted, #6B6B6B)', margin: '8px 0 16px', lineHeight: 1.6 }}>
          Удаление аккаунта необратимо. Все ваши данные, профиль и история заказов будут безвозвратно удалены.
        </p>
        <button type="button" onClick={() => setDeleteModalOpen(true)} className={styles.dangerButton}>
          Удалить аккаунт
        </button>
      </Section>

      <Modal
        open={deleteModalOpen}
        onClose={() => {
          if (deleting) return
          setDeleteModalOpen(false)
          setDeleteConfirmText('')
          setDeleteError('')
        }}
        title="Удалить аккаунт"
        size="sm"
      >
        <p style={{ fontSize: 14, color: 'var(--muted, #6B6B6B)', lineHeight: 1.6, margin: '0 0 16px' }}>
          Это действие нельзя отменить. Введите слово <strong style={{ color: '#1A1A1A' }}>{DELETE_CONFIRM_WORD}</strong> для подтверждения.
        </p>
        <input
          type="text"
          placeholder={DELETE_CONFIRM_WORD}
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
          className={`${styles.input} ${styles.modalInput}`}
        />
        {deleteError && <p style={{ margin: '10px 0 0', fontSize: 13, color: 'var(--red, #E02C2C)' }}>{deleteError}</p>}
        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={() => {
              setDeleteModalOpen(false)
              setDeleteConfirmText('')
              setDeleteError('')
            }}
            disabled={deleting}
            className={styles.secondaryButton}
          >
            Отмена
          </button>
          <button type="button" disabled={deleteConfirmText.trim() !== DELETE_CONFIRM_WORD || deleting} onClick={handleDeleteAccount} className={styles.deleteButton}>
            {deleting ? 'Удаление...' : 'Удалить навсегда'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

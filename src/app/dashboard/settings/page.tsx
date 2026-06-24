'use client';

import React, { useState } from 'react';
import Toggle from '@/components/ui/Toggle';
import Modal from '@/components/ui/Modal';

/* ── Section wrapper ─────────────────────────────────────────────────────── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid var(--border, #E5E5E5)',
        overflow: 'hidden',
        marginBottom: 20,
      }}
    >
      <div
        style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border, #E5E5E5)',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--ink, #1A1A1A)',
          }}
        >
          {title}
        </h2>
      </div>
      <div style={{ padding: '8px 24px 20px' }}>{children}</div>
    </div>
  );
}

/* ── Toggle row ──────────────────────────────────────────────────────────── */

function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: '1px solid var(--border, #E5E5E5)',
      }}
    >
      <div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--ink, #1A1A1A)',
            marginBottom: description ? 2 : 0,
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{ fontSize: 12, color: 'var(--muted, #6B6B6B)', lineHeight: 1.4 }}
          >
            {description}
          </div>
        )}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

/* ── Field ───────────────────────────────────────────────────────────────── */

function Field({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginTop: 16 }}>
      <label
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--ink, #1A1A1A)',
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          height: 40,
          padding: '0 12px',
          borderRadius: 8,
          border: '1px solid var(--border-field, #707070)',
          fontSize: 14,
          color: 'var(--ink, #1A1A1A)',
          background: '#fff',
          outline: 'none',
          fontFamily: 'inherit',
          transition: 'border-color 150ms',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => {
          (e.target as HTMLInputElement).style.borderColor = 'var(--gold, #D39D55)';
          (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(211,157,85,0.12)';
        }}
        onBlur={(e) => {
          (e.target as HTMLInputElement).style.borderColor = 'var(--border-field, #707070)';
          (e.target as HTMLInputElement).style.boxShadow = 'none';
        }}
      />
    </div>
  );
}

/* ── Select ──────────────────────────────────────────────────────────────── */

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ flex: 1 }}>
      <label
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--ink, #1A1A1A)',
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          height: 40,
          padding: '0 12px',
          borderRadius: 8,
          border: '1px solid var(--border-field, #707070)',
          fontSize: 14,
          color: 'var(--ink, #1A1A1A)',
          background: '#fff',
          outline: 'none',
          fontFamily: 'inherit',
          appearance: 'auto',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => {
          (e.target as HTMLSelectElement).style.borderColor = 'var(--gold, #D39D55)';
        }}
        onBlur={(e) => {
          (e.target as HTMLSelectElement).style.borderColor = 'var(--border-field, #707070)';
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function SettingsPage() {
  /* Notifications */
  const [notifRequests, setNotifRequests] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifReviews, setNotifReviews] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);

  /* Security */
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  /* Locale */
  const [language, setLanguage] = useState('ru');
  const [currency, setCurrency] = useState('RUB');

  /* Delete account modal */
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  /* Save password handler */
  const handleSavePassword = () => {
    setPasswordError('');
    setPasswordSaved(false);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('Заполните все поля');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Новый пароль должен быть не менее 8 символов');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    setPasswordSaved(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '32px 24px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Page title */}
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--ink, #1A1A1A)',
          margin: '0 0 24px',
        }}
      >
        Настройки
      </h1>

      {/* ── Notifications ─────────────────────────────────────────── */}
      <Section title="Уведомления">
        <ToggleRow
          label="Новые заявки"
          description="Уведомления о поступлении новых заявок"
          value={notifRequests}
          onChange={setNotifRequests}
        />
        <ToggleRow
          label="Сообщения"
          description="Уведомления о новых сообщениях от клиентов"
          value={notifMessages}
          onChange={setNotifMessages}
        />
        <ToggleRow
          label="Отзывы"
          description="Уведомления о новых отзывах на ваш профиль"
          value={notifReviews}
          onChange={setNotifReviews}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 14,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--ink, #1A1A1A)',
                marginBottom: 2,
              }}
            >
              Акции и новости
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted, #6B6B6B)' }}>
              Специальные предложения и обновления платформы
            </div>
          </div>
          <Toggle value={notifPromo} onChange={setNotifPromo} />
        </div>
      </Section>

      {/* ── Security ──────────────────────────────────────────────── */}
      <Section title="Безопасность">
        <Field
          label="Текущий пароль"
          type="password"
          placeholder="Введите текущий пароль"
          value={oldPassword}
          onChange={setOldPassword}
        />
        <Field
          label="Новый пароль"
          type="password"
          placeholder="Минимум 8 символов"
          value={newPassword}
          onChange={setNewPassword}
        />
        <Field
          label="Подтвердите новый пароль"
          type="password"
          placeholder="Повторите новый пароль"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        {/* Feedback */}
        {passwordError && (
          <p
            style={{
              margin: '10px 0 0',
              fontSize: 13,
              color: 'var(--red, #E02C2C)',
            }}
          >
            {passwordError}
          </p>
        )}
        {passwordSaved && (
          <p
            style={{
              margin: '10px 0 0',
              fontSize: 13,
              color: '#15803D',
            }}
          >
            Пароль успешно изменён
          </p>
        )}

        <button
          type="button"
          onClick={handleSavePassword}
          style={{
            marginTop: 16,
            padding: '10px 24px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--gold, #D39D55)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 150ms',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-dark, #B8863E)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold, #D39D55)';
          }}
        >
          Сохранить
        </button>
      </Section>

      {/* ── Language & Currency ────────────────────────────────────── */}
      <Section title="Язык и валюта">
        <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
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

      {/* ── Account / Danger Zone ─────────────────────────────────── */}
      <Section title="Аккаунт">
        <p
          style={{
            fontSize: 14,
            color: 'var(--muted, #6B6B6B)',
            margin: '8px 0 16px',
            lineHeight: 1.6,
          }}
        >
          Удаление аккаунта необратимо. Все ваши данные, профиль и история заказов
          будут безвозвратно удалены.
        </p>
        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            border: '2px solid #E02C2C',
            background: 'transparent',
            color: '#E02C2C',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 150ms, color 150ms',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          Удалить аккаунт
        </button>
      </Section>

      {/* ── Delete confirmation modal ──────────────────────────────── */}
      <Modal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteConfirmText('');
        }}
        title="Удалить аккаунт"
        size="sm"
      >
        <p
          style={{
            fontSize: 14,
            color: 'var(--muted, #6B6B6B)',
            lineHeight: 1.6,
            margin: '0 0 16px',
          }}
        >
          Это действие нельзя отменить. Введите слово{' '}
          <strong style={{ color: '#1A1A1A' }}>УДАЛИТЬ</strong> для подтверждения.
        </p>
        <input
          type="text"
          placeholder="УДАЛИТЬ"
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
          style={{
            width: '100%',
            height: 40,
            padding: '0 12px',
            borderRadius: 8,
            border: '1px solid var(--border-field, #707070)',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'inherit',
            marginBottom: 16,
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => {
              setDeleteModalOpen(false);
              setDeleteConfirmText('');
            }}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid var(--border, #E5E5E5)',
              background: '#fff',
              color: 'var(--ink, #1A1A1A)',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Отмена
          </button>
          <button
            type="button"
            disabled={deleteConfirmText !== 'УДАЛИТЬ'}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: deleteConfirmText === 'УДАЛИТЬ' ? '#E02C2C' : '#E5E5E5',
              color: deleteConfirmText === 'УДАЛИТЬ' ? '#fff' : '#9B9B9B',
              fontSize: 14,
              fontWeight: 600,
              cursor: deleteConfirmText === 'УДАЛИТЬ' ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              transition: 'background 150ms, color 150ms',
            }}
          >
            Удалить навсегда
          </button>
        </div>
      </Modal>
    </div>
  );
}

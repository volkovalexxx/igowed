'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

type Tab = 'client' | 'vendor'

const VENDOR_CATEGORIES = [
  'Фотограф',
  'Видеограф',
  'Ведущий / Тамада',
  'Декоратор',
  'Флорист',
  'Кейтеринг',
  'Ди-джей',
  'Живая музыка',
  'Визажист',
  'Стилист',
  'Свадебный торт',
  'Аренда авто',
  'Организатор свадьбы',
  'Другое',
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #707070',
  borderRadius: 6,
  padding: '10px 14px',
  fontSize: 15,
  color: '#202222',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  background: '#fff',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  color: '#202222',
  marginBottom: 6,
}

export default function RegisterPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('client')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Пароли не совпадают')
      return
    }
    if (password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов')
      return
    }
    if (tab === 'vendor' && !category) {
      setError('Выберите деятельность')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          role: tab === 'vendor' ? 'VENDOR' : 'CLIENT',
          category: tab === 'vendor' ? category : undefined,
          city: tab === 'vendor' && city ? city : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Ошибка регистрации')
        return
      }

      // Auto-login after registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        // Registration succeeded but auto-login failed — redirect to login
        router.push('/login')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Произошла ошибка. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F7F7F7',
        fontFamily: 'Inter, sans-serif',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
          border: '1px solid #E5E5E5',
          padding: '40px 36px',
          width: '100%',
          maxWidth: 420,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: '0.04em',
              color: '#202222',
            }}
          >
            I{' '}
            <span style={{ color: '#D39D55' }}>GO</span>{' '}
            WED
          </span>
        </div>

        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#202222',
            margin: '0 0 20px',
            textAlign: 'center',
          }}
        >
          Регистрация
        </h2>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '2px solid #E5E5E5',
            marginBottom: 24,
          }}
        >
          {(
            [
              { key: 'client', label: 'Я пара / клиент' },
              { key: 'vendor', label: 'Я подрядчик' },
            ] as { key: Tab; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setTab(key); setError(null) }}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                borderBottom: tab === key ? '2px solid #D39D55' : '2px solid transparent',
                marginBottom: -2,
                padding: '8px 4px',
                fontSize: 14,
                fontWeight: tab === key ? 600 : 400,
                color: tab === key ? '#D39D55' : '#9E9E9E',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'color 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div
            style={{
              background: '#FFF2F2',
              border: '1px solid #FFCDD2',
              borderRadius: 6,
              padding: '10px 14px',
              marginBottom: 16,
              color: '#C62828',
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="name" style={labelStyle}>
              Имя
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ваше имя"
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="password" style={labelStyle}>
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Минимум 6 символов"
              style={inputStyle}
            />
          </div>

          {/* Confirm password */}
          <div style={{ marginBottom: tab === 'vendor' ? 16 : 24 }}>
            <label htmlFor="confirm" style={labelStyle}>
              Подтверждение пароля
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Повторите пароль"
              style={inputStyle}
            />
          </div>

          {/* Vendor-only fields */}
          {tab === 'vendor' && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="category" style={labelStyle}>
                  Деятельность
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  style={{ ...inputStyle, appearance: 'auto' }}
                >
                  <option value="">Выберите деятельность</option>
                  {VENDOR_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label htmlFor="city" style={labelStyle}>
                  Город
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Например: Минск"
                  style={inputStyle}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 0',
              background: loading ? '#c8a96e' : '#D39D55',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.2s',
              marginBottom: 20,
            }}
          >
            {loading ? 'Регистрация…' : 'Зарегистрироваться'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#9E9E9E', margin: 0 }}>
          Уже есть аккаунт?{' '}
          <Link
            href="/login"
            style={{ color: '#D39D55', fontWeight: 500, textDecoration: 'none' }}
          >
            Войти
          </Link>
        </p>
      </div>
    </main>
  )
}

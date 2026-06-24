'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        setError('Неверный email или пароль')
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

  async function handleGoogle() {
    await signIn('google', { callbackUrl: '/' })
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
          maxWidth: 400,
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
            margin: '0 0 24px',
            textAlign: 'center',
          }}
        >
          Вход
        </h2>

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
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: '#202222',
                marginBottom: 6,
              }}
            >
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
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #707070',
                borderRadius: 6,
                padding: '10px 14px',
                fontSize: 15,
                color: '#202222',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: '#202222',
                marginBottom: 6,
              }}
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #707070',
                borderRadius: 6,
                padding: '10px 14px',
                fontSize: 15,
                color: '#202222',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

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
              marginBottom: 12,
            }}
          >
            {loading ? 'Входим…' : 'Войти'}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            margin: '4px 0 12px',
          }}
        >
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #E5E5E5' }} />
          <span style={{ fontSize: 13, color: '#9E9E9E', whiteSpace: 'nowrap' }}>или</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #E5E5E5' }} />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          style={{
            width: '100%',
            padding: '11px 0',
            background: '#fff',
            color: '#202222',
            border: '1px solid #E5E5E5',
            borderRadius: 6,
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 24,
          }}
        >
          {/* Google SVG icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.01 17.64 11.78 17.64 9.2z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18L12.048 13.56C11.24 14.1 10.211 14.42 9 14.42c-2.392 0-4.414-1.616-5.138-3.787H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.862 10.633A5.44 5.44 0 0 1 3.545 9c0-.567.098-1.119.317-1.633V5.035H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.035l2.905-2.402z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 5.035L3.862 7.367C4.586 5.196 6.608 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Войти через Google
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#9E9E9E', margin: 0 }}>
          Нет аккаунта?{' '}
          <Link
            href="/register"
            style={{ color: '#D39D55', fontWeight: 500, textDecoration: 'none' }}
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </main>
  )
}

'use client'

import Link from 'next/link'
import { type CSSProperties, useEffect, useState } from 'react'
import { Check, Close } from '@/components/ui/Icons'

const fieldStyle: CSSProperties = {
  width: '100%',
  border: '1px solid var(--border-field)',
  borderRadius: 6,
  padding: '9px 12px',
  fontSize: 14,
  outline: 'none',
  background: '#fff',
  color: 'var(--dark)',
  fontFamily: 'inherit',
}

type Phase = 'idle' | 'form' | 'sending' | 'done'

export function BookingButton({
  vendorSlug,
  vendorName,
  isOwner,
  isAuthenticated,
  loginHref,
}: {
  vendorSlug: string
  vendorName: string
  isOwner: boolean
  isAuthenticated: boolean
  loginHref: string
}) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [date, setDate] = useState('')
  const [message, setMessage] = useState('')
  const [existing, setExisting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (phase !== 'form' && phase !== 'sending') return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPhase('idle')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase])

  if (isOwner) return null

  if (!isAuthenticated) {
    return (
      <Link className="btn btn-gold" href={loginHref}>
        Забронировать
      </Link>
    )
  }

  async function submit() {
    setError('')
    setPhase('sending')
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorSlug, date: date || null, message: message || null }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error ?? 'Не удалось отправить заявку')
      }
      setExisting(Boolean(payload.existing))
      setPhase('done')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Не удалось отправить заявку')
      setPhase('form')
    }
  }

  return (
    <>
      <button type="button" className="btn btn-gold" onClick={() => setPhase('form')}>
        Забронировать
      </button>

      {(phase === 'form' || phase === 'sending' || phase === 'done') && (
        <div
          onClick={() => phase !== 'sending' && setPhase('idle')}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{ width: 'min(100%, 440px)', background: '#fff', borderRadius: 14, padding: 24, position: 'relative' }}
          >
            <button
              type="button"
              onClick={() => setPhase('idle')}
              aria-label="Закрыть"
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: 'none',
                background: 'var(--paper)',
                color: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Close size={16} />
            </button>

            {phase === 'done' ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: '#DCFCE7',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                  }}
                >
                  <Check size={26} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark)', margin: '0 0 6px' }}>
                  {existing ? 'У вас уже есть заявка' : 'Заявка отправлена'}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 18px' }}>
                  {existing
                    ? `Вы уже писали ${vendorName}. Дождитесь ответа или напишите в чат.`
                    : `${vendorName} получит вашу заявку и свяжется с вами.`}
                </p>
                <button type="button" className="btn btn-gold" onClick={() => setPhase('idle')} style={{ minWidth: 140 }}>
                  Хорошо
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark)', margin: '0 40px 4px 0' }}>Забронировать</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 18px' }}>Заявка уйдёт подрядчику {vendorName}</p>

                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--dark)', marginBottom: 6 }}>
                  Дата события
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  style={{ ...fieldStyle, marginBottom: 16 }}
                />

                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--dark)', marginBottom: 6 }}>
                  Сообщение
                </label>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={4}
                  maxLength={2000}
                  placeholder="Расскажите о вашем событии..."
                  style={{ ...fieldStyle, resize: 'vertical', marginBottom: error ? 8 : 20 }}
                />

                {error ? <p style={{ margin: '0 0 16px', color: '#e53131', fontSize: 13 }}>{error}</p> : null}

                <button
                  type="button"
                  className="btn btn-gold"
                  disabled={phase === 'sending'}
                  onClick={submit}
                  style={{ width: '100%' }}
                >
                  {phase === 'sending' ? 'Отправка...' : 'Отправить заявку'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

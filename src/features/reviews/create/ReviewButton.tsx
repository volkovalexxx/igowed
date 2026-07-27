'use client'

import { useRouter } from 'next/navigation'
import { type CSSProperties, useEffect, useState } from 'react'
import { Close, Star } from '@/components/ui/Icons'
import { MAX_RATING, MAX_TEXT_LENGTH } from './reviewCreate.validation'

type Phase = 'idle' | 'form' | 'sending'

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

function StarPicker({ value, onChange }: { value: number; onChange(v: number): void }) {
  const [hover, setHover] = useState(0)
  const active = hover || value
  return (
    <div style={{ display: 'flex', gap: 4 }} onMouseLeave={() => setHover(0)}>
      {Array.from({ length: MAX_RATING }, (_, index) => index + 1).map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star}`}
          onMouseEnter={() => setHover(star)}
          onClick={() => onChange(star)}
          style={{ background: 'none', border: 0, padding: 2, cursor: 'pointer', lineHeight: 0 }}
        >
          <Star size={26} className={star <= active ? 'star-filled' : 'star-empty'} />
        </button>
      ))}
    </div>
  )
}

export function ReviewButton({ vendorSlug, vendorName, alreadyReviewed }: { vendorSlug: string; vendorName: string; alreadyReviewed: boolean }) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (phase === 'idle') return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && phase !== 'sending') setPhase('idle')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase])

  async function submit() {
    if (rating < 1) {
      setError('Поставьте оценку')
      return
    }
    setError('')
    setPhase('sending')
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorSlug, rating, text: text || null }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error ?? 'Не удалось сохранить отзыв')
      }
      setPhase('idle')
      router.refresh()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Не удалось сохранить отзыв')
      setPhase('form')
    }
  }

  return (
    <>
      <button type="button" className="btn btn-outline-gold btn-sm" onClick={() => setPhase('form')}>
        {alreadyReviewed ? 'Изменить отзыв' : 'Оставить отзыв'}
      </button>

      {phase !== 'idle' && (
        <div
          onClick={() => phase !== 'sending' && setPhase('idle')}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <div onClick={(event) => event.stopPropagation()} style={{ width: 'min(100%, 440px)', background: '#fff', borderRadius: 14, padding: 24, position: 'relative' }}>
            <button
              type="button"
              onClick={() => setPhase('idle')}
              aria-label="Закрыть"
              style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--paper)', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Close size={16} />
            </button>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark)', margin: '0 40px 4px 0' }}>Отзыв о подрядчике</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 18px' }}>{vendorName}</p>

            <div style={{ marginBottom: 18 }}>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={4}
              maxLength={MAX_TEXT_LENGTH}
              placeholder="Поделитесь впечатлением о работе (необязательно)"
              style={{ ...fieldStyle, resize: 'vertical', marginBottom: error ? 8 : 20 }}
            />

            {error ? <p style={{ margin: '0 0 16px', color: '#e53131', fontSize: 13 }}>{error}</p> : null}

            <button type="button" className="btn btn-gold" disabled={phase === 'sending'} onClick={submit} style={{ width: '100%' }}>
              {phase === 'sending' ? 'Сохранение...' : 'Отправить отзыв'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Cal } from '@/components/ui/Icons'
import { ReviewButton } from '@/features/reviews/create/ReviewButton'
import { formatOrderDate, STATUS_CONFIG } from '@/features/vendors/orders/orders.format'
import type { ClientBooking } from './clientBooking.types'
import styles from './ClientBookings.module.css'

function StatusBadge({ status }: { status: ClientBooking['status'] }) {
  const { label, color, bg } = STATUS_CONFIG[status]
  return (
    <span className="inline-block rounded-full px-2.5 py-0.5 font-medium" style={{ fontSize: 11, color, background: bg }}>
      {label}
    </span>
  )
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={name} className={styles.avatar} src={src} />
  }
  return <span className={styles.avatarFallback}>{name.charAt(0).toUpperCase()}</span>
}

function BookingCard({ booking, busy, onCancel }: { booking: ClientBooking; busy: boolean; onCancel(id: string): void }) {
  const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED'

  return (
    <div className={styles.card}>
      <div style={{ minWidth: 0 }}>
        <div className={styles.vendor}>
          <Avatar name={booking.vendorName} src={booking.vendorAvatar} />
          <div style={{ minWidth: 0 }}>
            <Link className={styles.vendorName} href={`/vendor/${booking.vendorSlug}`}>
              {booking.vendorName}
            </Link>
            <div className={styles.meta}>
              <span className="flex items-center gap-1">
                <Cal size={12} />
                {formatOrderDate(booking.date)}
              </span>
              <StatusBadge status={booking.status} />
            </div>
          </div>
        </div>
        {booking.message ? <p className={styles.message}>{booking.message}</p> : null}
      </div>

      <div className={styles.aside}>
        {canCancel && (
          <button className={styles.cancelBtn} disabled={busy} onClick={() => onCancel(booking.id)} type="button">
            {busy ? 'Отмена...' : 'Отменить заявку'}
          </button>
        )}
        {booking.status === 'COMPLETED' && (
          <ReviewButton alreadyReviewed={booking.alreadyReviewed} vendorName={booking.vendorName} vendorSlug={booking.vendorSlug} />
        )}
      </div>
    </div>
  )
}

export function ClientBookingsClient({ initialBookings }: { initialBookings: ClientBooking[] }) {
  const [bookings, setBookings] = useState(initialBookings)
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')

  async function handleCancel(id: string) {
    const previous = bookings
    setError('')
    setBusyId(id)
    setBookings((current) => current.map((booking) => (booking.id === id ? { ...booking, status: 'CANCELLED' } : booking)))
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? 'Не удалось отменить заявку')
      }
    } catch (cancelError) {
      setBookings(previous)
      setError(cancelError instanceof Error ? cancelError.message : 'Не удалось отменить заявку')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Мои заявки</h1>
      <p className={styles.subtitle}>Ваши брони подрядчиков и их статусы</p>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {bookings.length === 0 ? (
        <div className={styles.empty}>
          <p style={{ fontSize: 15, marginBottom: 6 }}>У вас пока нет заявок</p>
          <p style={{ fontSize: 13 }}>
            Найдите подрядчика в <Link href="/catalog" style={{ color: 'var(--gold)' }}>каталоге</Link> и оставьте заявку.
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {bookings.map((booking) => (
            <BookingCard booking={booking} busy={busyId === booking.id} key={booking.id} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  )
}

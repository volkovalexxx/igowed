'use client'

import { useState } from 'react'
import { EventVendorReviewCard } from './EventVendorReviewCard'
import type { EventVendorReview } from './eventReview.types'
import styles from './EventReviewSection.module.css'

type EventReviewSectionProps = {
  eventId: string
  initialVendors: EventVendorReview[]
}

async function readJsonOrThrow(response: Response) {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error ?? 'Не удалось сохранить отзыв')
  }

  return payload
}

/**
 * Секция страницы после мероприятия: подрядчики, которых можно оценить прямо в карточке.
 */
export function EventReviewSection({ eventId, initialVendors }: EventReviewSectionProps) {
  const [vendors, setVendors] = useState(initialVendors)
  const [savingVendorId, setSavingVendorId] = useState('')
  const [error, setError] = useState('')

  async function handleRate(vendor: EventVendorReview, rating: number) {
    const previous = vendors
    setError('')
    setSavingVendorId(vendor.vendorId)
    setVendors((current) => current.map((item) => (item.vendorId === vendor.vendorId ? { ...item, myRating: rating } : item)))

    try {
      await readJsonOrThrow(
        await fetch(`/api/events/${eventId}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vendorId: vendor.vendorId, rating }),
        }),
      )
    } catch (rateError) {
      setVendors(previous)
      setError(rateError instanceof Error ? rateError.message : 'Не удалось сохранить отзыв')
    } finally {
      setSavingVendorId('')
    }
  }

  return (
    <section className={styles.section} aria-labelledby="event-review-title">
      <div className={styles.sectionHeader}>
        <h2 id="event-review-title">Подрядчики вашего мероприятия</h2>
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {vendors.length === 0 ? (
        <p className={styles.empty}>К мероприятию не привязан ни один подрядчик — оценивать пока некого.</p>
      ) : (
        <div className={styles.grid}>
          {vendors.map((vendor) => (
            <EventVendorReviewCard
              isSaving={savingVendorId === vendor.vendorId}
              key={vendor.vendorId}
              vendor={vendor}
              onRate={(rating) => handleRate(vendor, rating)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

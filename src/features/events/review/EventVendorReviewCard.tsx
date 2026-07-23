'use client'

import Link from 'next/link'
import { StarRating } from './StarRating'
import type { EventVendorReview } from './eventReview.types'
import styles from './EventReviewSection.module.css'

type EventVendorReviewCardProps = {
  vendor: EventVendorReview
  isSaving: boolean
  onRate(rating: number): void
}

const FALLBACK_WORK_IMAGE =
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=520&h=560&q=80'

export function EventVendorReviewCard({ vendor, isSaving, onRate }: EventVendorReviewCardProps) {
  return (
    <article className={styles.card}>
      <span className={styles.roleTag}>{vendor.role}</span>
      <span
        className={styles.workImage}
        role="img"
        aria-label={`Работа: ${vendor.name}`}
        style={{ backgroundImage: `url(${vendor.workImage ?? FALLBACK_WORK_IMAGE})` }}
      />
      <span className={styles.avatarWrap}>
        <span className={styles.avatar} style={{ backgroundImage: `url(${vendor.avatar ?? FALLBACK_WORK_IMAGE})` }} />
        {vendor.isPro ? <span className={styles.pro}>PRO</span> : null}
      </span>
      <Link className={styles.name} href={`/vendor/${vendor.slug}`}>
        {vendor.name}
      </Link>
      <p className={styles.username}>@{vendor.username}</p>
      <div className={styles.rateRow}>
        <span>{vendor.myRating ? 'Ваша оценка' : 'Оставьте отзыв'}</span>
        <StarRating
          disabled={isSaving}
          label={`Оценка подрядчика ${vendor.name}`}
          value={vendor.myRating}
          onRate={onRate}
        />
      </div>
    </article>
  )
}

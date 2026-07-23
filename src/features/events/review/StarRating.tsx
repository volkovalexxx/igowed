'use client'

import { useState } from 'react'
import { MAX_RATING, MIN_RATING } from './server/eventReview.validation'
import styles from './EventReviewSection.module.css'

type StarRatingProps = {
  value: number | null
  label: string
  disabled?: boolean
  onRate(rating: number): void
}

const STARS = Array.from({ length: MAX_RATING }, (_, index) => index + MIN_RATING)

export function StarRating({ value, label, disabled = false, onRate }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const shown = hovered ?? value ?? 0

  return (
    <div className={styles.stars} role="radiogroup" aria-label={label} onMouseLeave={() => setHovered(null)}>
      {STARS.map((star) => (
        <button
          className={star <= shown ? `${styles.star} ${styles.starFilled}` : styles.star}
          disabled={disabled}
          key={star}
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} из ${MAX_RATING}`}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onFocus={() => setHovered(star)}
          onBlur={() => setHovered(null)}
          onClick={() => onRate(star)}
        >
          ★
        </button>
      ))}
    </div>
  )
}

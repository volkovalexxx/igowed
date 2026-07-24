'use client'

import { useState } from 'react'
import type { ProductPhoto } from './productCard.types'
import styles from './ProductCardPage.module.css'

const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&h=760&q=80'

export function ProductGallery({ photos, title }: { photos: ProductPhoto[]; title: string }) {
  const items = photos.length > 0 ? photos : [{ id: 'fallback', url: FALLBACK_PHOTO }]
  const [activeIndex, setActiveIndex] = useState(0)
  const active = items[Math.min(activeIndex, items.length - 1)]

  function step(delta: number) {
    setActiveIndex((value) => (value + delta + items.length) % items.length)
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.stage}>
        <span className={styles.stageImage} role="img" aria-label={title} style={{ backgroundImage: `url(${active.url})` }} />
        {items.length > 1 ? (
          <button className={styles.stageNext} type="button" aria-label="Следующее фото" onClick={() => step(1)}>
            ›
          </button>
        ) : null}
      </div>

      {items.length > 1 ? (
        <div className={styles.thumbs}>
          {items.map((photo, index) => (
            <button
              className={index === activeIndex ? `${styles.thumb} ${styles.thumbActive}` : styles.thumb}
              key={photo.id}
              type="button"
              aria-label={`Фото ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              <span style={{ backgroundImage: `url(${photo.url})` }} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

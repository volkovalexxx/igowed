'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { EventVendorSlot } from './eventVendors.types'
import detailStyles from '@/features/events/details/EventDetails.module.css'

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'

type EventVendorSlotCardProps = {
  slot: EventVendorSlot
  isRemoving: boolean
  onRemove(vendorId: string): void
}

export function EventVendorSlotCard({ slot, isRemoving, onRemove }: EventVendorSlotCardProps) {
  const [index, setIndex] = useState(0)
  const count = slot.vendors.length
  const current = count > 0 ? slot.vendors[Math.min(index, count - 1)] : null

  function step(delta: number) {
    setIndex((value) => (value + delta + count) % count)
  }

  const roleLabel = count > 1 ? `${slot.role}  ${Math.min(index, count - 1) + 1} / ${count}` : slot.role

  return (
    <article className={detailStyles.contractorCard}>
      <h3>{roleLabel}</h3>
      {current ? (
        <>
          <p className={detailStyles.contractorName}>{current.name}</p>
          <p className={detailStyles.contractorUser}>@{current.username}</p>
          <div className={detailStyles.avatarWrap}>
            <button type="button" aria-label="Предыдущий" disabled={count < 2} onClick={() => step(-1)}>
              ‹
            </button>
            <span className={detailStyles.vendorAvatar} style={{ backgroundImage: `url(${current.avatar ?? FALLBACK_AVATAR})` }} />
            <button type="button" aria-label="Следующий" disabled={count < 2} onClick={() => step(1)}>
              ›
            </button>
          </div>
          <p className={detailStyles.rating}>
            ★★★★★ <span>{current.rating.toFixed(1)}</span>
          </p>
          <Link className={detailStyles.lightButton} href={`/vendor/${current.slug}`}>
            Перейти в профиль
          </Link>
          <button
            className={detailStyles.blackButton}
            type="button"
            disabled={isRemoving}
            onClick={() => onRemove(current.vendorId)}
          >
            {isRemoving ? 'Удаление...' : 'Убрать подрядчика'}
          </button>
        </>
      ) : (
        <>
          <span className={detailStyles.emptyAvatar}>●</span>
          <p className={detailStyles.emptyText}>Исполнитель не выбран</p>
          <Link className={detailStyles.lightButton} href="/dashboard/favorites">
            Перейти в избранное ♡
          </Link>
          <Link className={detailStyles.blackButton} href="/catalog">
            Перейти в каталог
          </Link>
        </>
      )}
    </article>
  )
}

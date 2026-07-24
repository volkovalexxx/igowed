'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { BoardVendor } from '@/features/vendors/board/vendorBoard.types'
import { AddEventVendorModal } from './AddEventVendorModal'
import { EventVendorSlotCard } from './EventVendorSlotCard'
import { buildVendorSlots } from './eventVendors.format'
import type { EventVendorEntry, EventVendorSlot } from './eventVendors.types'
import detailStyles from '@/features/events/details/EventDetails.module.css'

type EventVendorsSectionProps = {
  eventId: string
  initialSlots: EventVendorSlot[]
  candidates: BoardVendor[]
}

async function readJsonOrThrow(response: Response) {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error ?? 'Не удалось сохранить изменения')
  }

  return payload
}

function collectEntries(slots: EventVendorSlot[]): EventVendorEntry[] {
  return slots.flatMap((slot) => slot.vendors)
}

export function EventVendorsSection({ eventId, initialSlots, candidates }: EventVendorsSectionProps) {
  const [slots, setSlots] = useState(initialSlots)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [removingVendorId, setRemovingVendorId] = useState('')
  const [error, setError] = useState('')

  const firstEmptyRole = slots.find((slot) => slot.isEmpty)?.role ?? slots[0]?.role ?? ''

  async function handleAdd(input: { vendorId: string; role: string }) {
    const payload = (await readJsonOrThrow(
      await fetch(`/api/events/${eventId}/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    )) as { vendor?: EventVendorEntry }

    if (payload.vendor) {
      setSlots(buildVendorSlots([...collectEntries(slots), payload.vendor]))
    }
  }

  async function handleRemove(vendorId: string) {
    const previous = slots
    setError('')
    setRemovingVendorId(vendorId)
    setSlots(buildVendorSlots(collectEntries(slots).filter((entry) => entry.vendorId !== vendorId)))

    try {
      await readJsonOrThrow(await fetch(`/api/events/${eventId}/vendors/${vendorId}`, { method: 'DELETE' }))
    } catch (removeError) {
      setSlots(previous)
      setError(removeError instanceof Error ? removeError.message : 'Не удалось убрать подрядчика')
    } finally {
      setRemovingVendorId('')
    }
  }

  return (
    <section className={detailStyles.contractors}>
      <div className={detailStyles.sectionHeader}>
        <h2>Подрядчики для вашего мероприятия</h2>
        <div className={detailStyles.sectionActions}>
          <button className={detailStyles.goldSmall} type="button" onClick={() => setIsModalOpen(true)}>
            Добавить подрядчика
          </button>
          <button type="button" aria-label="Назад">
            ‹
          </button>
          <button type="button" aria-label="Вперед">
            ›
          </button>
        </div>
      </div>

      {error ? (
        <p className={detailStyles.vendorsError} role="alert">
          {error}
        </p>
      ) : null}

      <div className={detailStyles.contractorGrid}>
        {slots.map((slot) => (
          <EventVendorSlotCard
            isRemoving={slot.vendors.some((vendor) => vendor.vendorId === removingVendorId)}
            key={slot.role}
            slot={slot}
            onRemove={handleRemove}
          />
        ))}
        <article className={`${detailStyles.contractorCard} ${detailStyles.addContractor}`}>
          <button type="button" onClick={() => setIsModalOpen(true)}>
            +
          </button>
          <p>Добавить подрядчика</p>
        </article>
      </div>

      <div className={detailStyles.mobileContractorActions}>
        <button type="button" onClick={() => setIsModalOpen(true)}>
          Добавить подрядчика +
        </button>
        <Link href="/catalog">Перейти в каталог</Link>
      </div>

      {isModalOpen ? (
        <AddEventVendorModal
          candidates={candidates}
          defaultRole={firstEmptyRole}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAdd}
        />
      ) : null}
    </section>
  )
}

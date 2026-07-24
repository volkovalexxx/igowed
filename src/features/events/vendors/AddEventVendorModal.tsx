'use client'

import { useState, type FormEvent } from 'react'
import type { BoardVendor } from '@/features/vendors/board/vendorBoard.types'
import { VENDOR_SLOT_ROLES } from './eventVendors.data'
import styles from './EventVendorsSection.module.css'

type AddEventVendorModalProps = {
  candidates: BoardVendor[]
  defaultRole: string
  onClose(): void
  onSave(input: { vendorId: string; role: string }): Promise<void>
}

export function AddEventVendorModal({ candidates, defaultRole, onClose, onSave }: AddEventVendorModalProps) {
  const [vendorId, setVendorId] = useState(candidates[0]?.id ?? '')
  const [role, setRole] = useState(defaultRole)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      await onSave({ vendorId, role })
      onClose()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Не удалось добавить подрядчика')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.modalBackdrop} role="presentation">
      <form className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="add-vendor-title" onSubmit={handleSubmit}>
        <button className={styles.modalClose} onClick={onClose} type="button" aria-label="Закрыть">
          ×
        </button>
        <h2 id="add-vendor-title">Добавить подрядчика</h2>

        {candidates.length === 0 ? (
          <p className={styles.hint}>
            Сначала добавьте подрядчиков в избранное — из него можно выбрать участника мероприятия.
          </p>
        ) : (
          <>
            <label>
              Роль
              <select value={role} onChange={(event) => setRole(event.target.value)} required>
                {VENDOR_SLOT_ROLES.map((slotRole) => (
                  <option key={slotRole} value={slotRole}>
                    {slotRole}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Подрядчик из избранного
              <select value={vendorId} onChange={(event) => setVendorId(event.target.value)} required>
                {candidates.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {`${vendor.firstName} ${vendor.lastName}`.trim()} · @{vendor.username}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        {candidates.length === 0 ? (
          <button className={styles.saveButton} type="button" onClick={onClose}>
            Понятно
          </button>
        ) : (
          <button className={styles.saveButton} type="submit" disabled={isSaving}>
            {isSaving ? 'Сохранение...' : 'Добавить подрядчика'}
          </button>
        )}
      </form>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { formatJoinDate, summarizeVendors } from './adminVendors.format'
import type { AdminVendorFlag, AdminVendorRow } from './adminVendors.types'
import styles from './AdminVendors.module.css'

function Switch({ on, busy, onToggle }: { on: boolean; busy: boolean; onToggle(): void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={busy}
      onClick={onToggle}
      className={`${styles.switch} ${on ? styles.switchOn : ''}`}
    >
      <span className={`${styles.knob} ${on ? styles.knobOn : ''}`} />
    </button>
  )
}

const STAT_LABELS: { key: keyof ReturnType<typeof summarizeVendors>; label: string }[] = [
  { key: 'total', label: 'Всего подрядчиков' },
  { key: 'verified', label: 'Верифицировано' },
  { key: 'active', label: 'Активны' },
  { key: 'hidden', label: 'Скрыты' },
]

export function AdminVendorsClient({ initialVendors }: { initialVendors: AdminVendorRow[] }) {
  const [vendors, setVendors] = useState(initialVendors)
  const [query, setQuery] = useState('')
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')

  const stats = summarizeVendors(vendors)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return vendors
    return vendors.filter(
      (vendor) => vendor.name.toLowerCase().includes(needle) || vendor.username.toLowerCase().includes(needle) || vendor.city.toLowerCase().includes(needle),
    )
  }, [vendors, query])

  async function toggle(vendor: AdminVendorRow, flag: AdminVendorFlag) {
    const field = flag === 'verified' ? 'isVerified' : 'isActive'
    const value = !vendor[field]
    const previous = vendors
    setError('')
    setBusyId(`${vendor.id}:${flag}`)
    setVendors((current) => current.map((row) => (row.id === vendor.id ? { ...row, [field]: value } : row)))
    try {
      const response = await fetch(`/api/admin/vendors/${vendor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag, value }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? 'Не удалось обновить подрядчика')
      }
    } catch (toggleError) {
      setVendors(previous)
      setError(toggleError instanceof Error ? toggleError.message : 'Не удалось обновить подрядчика')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Модерация подрядчиков</h1>
        <p className={styles.subtitle}>Верификация и видимость профилей в каталоге</p>
      </div>

      <div className={styles.stats}>
        {STAT_LABELS.map(({ key, label }) => (
          <div className={styles.statCard} key={key}>
            <div className={styles.statValue}>{stats[key]}</div>
            <div className={styles.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Поиск по имени, @username или городу"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <div className={styles.tableWrap}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>Подрядчики не найдены</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Подрядчик</th>
                <th>Город</th>
                <th>Рейтинг</th>
                <th>Регистрация</th>
                <th>Верифиц.</th>
                <th>Активен</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((vendor) => (
                <tr key={vendor.id}>
                  <td>
                    <div className={styles.vendorName}>
                      {vendor.name}
                      {vendor.isPro ? <span className={styles.proBadge}>PRO</span> : null}
                    </div>
                    <div className={styles.username}>{vendor.username}</div>
                  </td>
                  <td>{vendor.city}</td>
                  <td>
                    {vendor.rating.toFixed(1)} · {vendor.reviewCount}
                  </td>
                  <td>{formatJoinDate(vendor.createdAt)}</td>
                  <td>
                    <Switch busy={busyId === `${vendor.id}:verified`} on={vendor.isVerified} onToggle={() => toggle(vendor, 'verified')} />
                  </td>
                  <td>
                    <Switch busy={busyId === `${vendor.id}:active`} on={vendor.isActive} onToggle={() => toggle(vendor, 'active')} />
                  </td>
                  <td>
                    <Link className={styles.profileLink} href={`/vendor/${vendor.slug}`} target="_blank">
                      Профиль ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

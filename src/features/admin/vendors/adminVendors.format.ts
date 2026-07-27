import type { AdminVendorRow } from './adminVendors.types'

const DATE_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

/** Дата регистрации подрядчика (ISO) → «5 июн. 2026». */
export function formatJoinDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return DATE_FORMATTER.format(date).replace(/\s*г\.$/, '')
}

export type AdminVendorStats = {
  total: number
  verified: number
  active: number
  hidden: number
}

export function summarizeVendors(rows: AdminVendorRow[]): AdminVendorStats {
  return rows.reduce<AdminVendorStats>(
    (acc, row) => ({
      total: acc.total + 1,
      verified: acc.verified + (row.isVerified ? 1 : 0),
      active: acc.active + (row.isActive ? 1 : 0),
      hidden: acc.hidden + (row.isActive ? 0 : 1),
    }),
    { total: 0, verified: 0, active: 0, hidden: 0 },
  )
}

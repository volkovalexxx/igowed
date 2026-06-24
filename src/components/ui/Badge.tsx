import React from 'react';

/* ── Types ───────────────────────────────────────────────────────────────── */

export type BadgeStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'pro'
  | 'verified';

export interface BadgeProps {
  status: BadgeStatus;
  children?: React.ReactNode;
}

/* ── Style map ───────────────────────────────────────────────────────────── */

interface BadgeStyle {
  background: string;
  color: string;
  border?: string;
}

const STATUS_STYLES: Record<BadgeStatus, BadgeStyle> = {
  pending: {
    background: '#FFFBEB',  /* amber-50 */
    color: '#B45309',       /* amber-700 */
  },
  confirmed: {
    background: '#F0FDF4',  /* green-50 */
    color: '#15803D',       /* green-700 */
  },
  cancelled: {
    background: '#FEF2F2',  /* red-50 */
    color: '#B91C1C',       /* red-700 */
  },
  completed: {
    background: '#EFF6FF',  /* blue-50 */
    color: '#1D4ED8',       /* blue-700 */
  },
  pro: {
    background: 'rgba(211,157,85,0.10)',
    color: '#D39D55',
    border: '1px solid #D39D55',
  },
  verified: {
    background: '#D39D55',
    color: '#fff',
  },
};

/* ── Default labels ──────────────────────────────────────────────────────── */

const DEFAULT_LABELS: Record<BadgeStatus, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждено',
  cancelled: 'Отменено',
  completed: 'Завершено',
  pro: 'PRO',
  verified: 'Проверено',
};

/* ── Badge ───────────────────────────────────────────────────────────────── */

export default function Badge({ status, children }: BadgeProps) {
  const styles = STATUS_STYLES[status];
  const label = children ?? DEFAULT_LABELS[status];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.6,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        letterSpacing: '0.01em',
        background: styles.background,
        color: styles.color,
        border: styles.border ?? 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

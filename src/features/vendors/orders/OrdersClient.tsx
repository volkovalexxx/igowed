'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Cal, Chat, Check } from '@/components/ui/Icons'
import { countByStatus, filterByStatus, formatOrderDate, ORDER_TABS, STATUS_CONFIG } from './orders.format'
import type { OrderStatus, OrderTabKey, VendorOrder } from './orders.types'
import styles from './OrdersPage.module.css'

function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, color, bg } = STATUS_CONFIG[status]
  return (
    <span className="inline-block rounded-full px-2.5 py-0.5 font-medium" style={{ fontSize: 11, color, background: bg }}>
      {label}
    </span>
  )
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className="rounded-full object-cover shrink-0" style={{ width: 44, height: 44 }} />
  }
  return (
    <span
      className="flex items-center justify-center rounded-full shrink-0"
      style={{ width: 44, height: 44, background: 'var(--paper)', color: 'var(--muted)', fontSize: 16, fontWeight: 700 }}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

function OrderCard({
  order,
  busy,
  onUpdate,
}: {
  order: VendorOrder
  busy: boolean
  onUpdate(id: string, status: OrderStatus): void
}) {
  return (
    <div className={styles.orderCard}>
      <div className={styles.clientBlock}>
        <Avatar name={order.clientName} src={order.clientAvatar} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>{order.clientName}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{order.clientContact}</div>
        </div>
      </div>

      <div className={styles.orderBody}>
        <div className={styles.orderMeta}>
          <span className="flex items-center gap-1.5" style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
            <Cal size={13} />
            {formatOrderDate(order.date)}
          </span>
          <StatusBadge status={order.status} />
        </div>
        {order.message ? (
          <p
            style={{
              fontSize: 13,
              color: 'var(--muted)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {order.message}
          </p>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>Без сообщения</p>
        )}
      </div>

      <div className={styles.orderAside}>
        <div className={styles.orderActions}>
          {order.status === 'PENDING' && (
            <>
              <button
                type="button"
                className="btn btn-sm"
                disabled={busy}
                style={{ minWidth: 120, background: 'var(--dark)', color: '#fff', borderColor: 'var(--dark)' }}
                onClick={() => onUpdate(order.id, 'CONFIRMED')}
              >
                <Check size={13} />
                Принять
              </button>
              <button
                type="button"
                className="btn btn-sm"
                disabled={busy}
                style={{ minWidth: 120, border: '1px solid var(--red)', color: 'var(--red)', background: 'transparent', borderRadius: 6 }}
                onClick={() => onUpdate(order.id, 'CANCELLED')}
              >
                Отклонить
              </button>
            </>
          )}

          {order.status === 'CONFIRMED' && (
            <>
              <Link href={`/dashboard/messages?to=${order.clientId}`} className="btn btn-outline btn-sm" style={{ minWidth: 120 }}>
                <Chat size={13} />
                Написать
              </Link>
              <button type="button" className="btn btn-gold btn-sm" disabled={busy} style={{ minWidth: 120 }} onClick={() => onUpdate(order.id, 'COMPLETED')}>
                Завершить
              </button>
            </>
          )}

          {order.status === 'COMPLETED' && (
            <Link href={`/dashboard/messages?to=${order.clientId}`} className="btn btn-outline btn-sm" style={{ minWidth: 120 }}>
              <Chat size={13} />
              Написать
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-20 gap-4">
      <div className="flex items-center justify-center rounded-full" style={{ width: 72, height: 72, background: 'var(--paper)' }}>
        <Cal size={32} style={{ color: 'var(--muted)' }} />
      </div>
      <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>Пока нет заявок</p>
      <p style={{ fontSize: 13, color: 'var(--muted)' }}>Заявки от клиентов появятся здесь</p>
    </div>
  )
}

export function OrdersClient({ initialOrders }: { initialOrders: VendorOrder[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [activeTab, setActiveTab] = useState<OrderTabKey>('incoming')
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')

  const currentTab = ORDER_TABS.find((tab) => tab.key === activeTab) ?? ORDER_TABS[0]
  const visibleOrders = filterByStatus(orders, currentTab.status)

  async function handleUpdate(id: string, status: OrderStatus) {
    const previous = orders
    setError('')
    setBusyId(id)
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)))
    try {
      const response = await fetch(`/api/vendor/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error ?? 'Не удалось обновить заявку')
      }
    } catch (updateError) {
      setOrders(previous)
      setError(updateError instanceof Error ? updateError.message : 'Не удалось обновить заявку')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className={styles.page}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)', marginBottom: 24 }}>Заявки и заказы</h2>

      <div className={styles.tabsWrap}>
        <div className={styles.tabs} role="tablist" aria-label="Статусы заказов">
          {ORDER_TABS.map((tab) => {
            const isActive = activeTab === tab.key
            const count = countByStatus(orders, tab.status)
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ''}`}
                style={{ color: isActive ? 'var(--dark)' : 'var(--muted)' }}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={styles.tabCount}
                    style={{ background: isActive ? 'var(--dark)' : 'var(--border)', color: isActive ? '#fff' : 'var(--muted)' }}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {error ? (
        <p role="alert" style={{ margin: '0 0 14px', color: '#e53131', fontSize: 13 }}>
          {error}
        </p>
      ) : null}

      {visibleOrders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={styles.ordersList}>
          {visibleOrders.map((order) => (
            <OrderCard busy={busyId === order.id} key={order.id} onUpdate={handleUpdate} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

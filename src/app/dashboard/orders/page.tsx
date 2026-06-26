'use client';

import React, { useState } from 'react';
import { Cal, Chat, Check } from '@/components/ui/Icons';
import styles from './OrdersPage.module.css';

/* ── Types ───────────────────────────────────────────────────────────── */

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

interface Order {
  id: number;
  clientName: string;
  clientContact: string;
  clientAvatar: string;
  serviceType: string;
  date: string;
  message: string;
  price: number | null;
  status: OrderStatus;
}

/* ── Mock data ───────────────────────────────────────────────────────── */

const ORDERS: Order[] = [
  {
    id: 1,
    clientName: 'Ольга Иванова',
    clientContact: '@olga_ivanova',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    serviceType: 'Свадебная фотосъёмка',
    date: '14 июня 2026',
    message: 'Здравствуйте! Хотели бы забронировать вас для нашей свадьбы. Нам нужен полный день съёмки с 10:00 до 22:00, включая выездную регистрацию.',
    price: null,
    status: 'PENDING',
  },
  {
    id: 2,
    clientName: 'Максим и Юлия',
    clientContact: '@max_yulia_wed',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
    serviceType: 'Love story + свадьба',
    date: '7 августа 2026',
    message: 'Привет! Мы искали фотографа уже несколько месяцев, и ваше портфолио нас просто покорило. Хотим заказать love-story съёмку заранее и свадьбу летом.',
    price: 850,
    status: 'CONFIRMED',
  },
  {
    id: 3,
    clientName: 'Светлана Козлова',
    clientContact: '@sveta_k',
    clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    serviceType: 'Свадебная фотосъёмка',
    date: '22 марта 2026',
    message: 'Наша свадьба прошла замечательно, фотографии получили и в полном восторге! Спасибо за профессионализм и внимание к деталям.',
    price: 650,
    status: 'COMPLETED',
  },
  {
    id: 4,
    clientName: 'Андрей Романов',
    clientContact: '@andrey_r',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    serviceType: 'Репортажная съёмка',
    date: '15 февраля 2026',
    message: 'К сожалению, вынужден отменить бронирование из-за переноса даты свадьбы. Надеюсь, сможем перенести на осень.',
    price: 400,
    status: 'CANCELLED',
  },
];

/* ── Tab config ──────────────────────────────────────────────────────── */

type TabKey = 'all' | OrderStatus;

const TABS: { key: TabKey; label: string; statuses: OrderStatus[] }[] = [
  { key: 'all',       label: 'Входящие',       statuses: ['PENDING'] },
  { key: 'CONFIRMED', label: 'Подтверждённые', statuses: ['CONFIRMED'] },
  { key: 'COMPLETED', label: 'Завершённые',    statuses: ['COMPLETED'] },
  { key: 'CANCELLED', label: 'Отменённые',     statuses: ['CANCELLED'] },
];

/* ── Status badge ────────────────────────────────────────────────────── */

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  PENDING:   { label: 'Новая',           color: '#D39D55', bg: '#F5E6CC' },
  CONFIRMED: { label: 'Подтверждена',    color: '#16A34A', bg: '#DCFCE7' },
  COMPLETED: { label: 'Завершена',       color: '#6B6B6B', bg: '#F4F4F4' },
  CANCELLED: { label: 'Отменена',        color: '#E02C2C', bg: '#FEE2E2' },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, color, bg } = STATUS_CONFIG[status];
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 font-medium"
      style={{ fontSize: 11, color, background: bg }}
    >
      {label}
    </span>
  );
}

/* ── Order card ──────────────────────────────────────────────────────── */

function OrderCard({
  order,
  onAccept,
  onDecline,
  onComplete,
}: {
  order: Order;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
  onComplete: (id: number) => void;
}) {
  return (
    <div className={styles.orderCard}>
      {/* Left: avatar + name */}
      <div className={styles.clientBlock}>
        <img
          src={order.clientAvatar}
          alt={order.clientName}
          className="rounded-full object-cover shrink-0"
          style={{ width: 44, height: 44 }}
        />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>{order.clientName}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{order.clientContact}</div>
        </div>
      </div>

      {/* Center: details */}
      <div className={styles.orderBody}>
        <div className={styles.orderMeta}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{order.serviceType}</span>
          <StatusBadge status={order.status} />
        </div>
        <div className="flex items-center gap-1.5" style={{ fontSize: 12, color: 'var(--muted)' }}>
          <Cal size={12} />
          {order.date}
        </div>
        <p
          style={{
            fontSize: 13,
            color: 'var(--muted)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {order.message}
        </p>
      </div>

      {/* Right: price + actions */}
      <div className={styles.orderAside}>
        {order.price !== null && (
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--dark)' }}>
            ${order.price}
          </div>
        )}

        <div className={styles.orderActions}>
          {order.status === 'PENDING' && (
            <>
              <button
                type="button"
                className="btn btn-sm"
                style={{ minWidth: 120, background: 'var(--dark)', color: '#fff', borderColor: 'var(--dark)' }}
                onClick={() => onAccept(order.id)}
              >
                <Check size={13} />
                Принять
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  minWidth: 120,
                  border: '1px solid var(--red)',
                  color: 'var(--red)',
                  background: 'transparent',
                  borderRadius: 6,
                }}
                onClick={() => onDecline(order.id)}
              >
                Отклонить
              </button>
            </>
          )}

          {order.status === 'CONFIRMED' && (
            <>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ minWidth: 120 }}
              >
                <Chat size={13} />
                Написать
              </button>
              <button
                type="button"
                className="btn btn-gold btn-sm"
                style={{ minWidth: 120 }}
                onClick={() => onComplete(order.id)}
              >
                Завершить
              </button>
            </>
          )}

          {order.status === 'COMPLETED' && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ minWidth: 140 }}
            >
              Оставить отзыв
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────────────────── */

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-20 gap-4">
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: 72, height: 72, background: 'var(--paper)' }}
      >
        <Cal size={32} style={{ color: 'var(--muted)' }} />
      </div>
      <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>Пока нет заявок</p>
      <p style={{ fontSize: 13, color: 'var(--muted)' }}>Заявки от клиентов появятся здесь</p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [orders, setOrders] = useState<Order[]>(ORDERS);

  const currentTab = TABS.find((t) => t.key === activeTab) ?? TABS[0];
  const visibleOrders = orders.filter((o) => currentTab.statuses.includes(o.status));

  const countByStatus = (statuses: OrderStatus[]) =>
    orders.filter((o) => statuses.includes(o.status)).length;

  function handleAccept(id: number) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'CONFIRMED' } : o));
  }

  function handleDecline(id: number) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'CANCELLED' } : o));
  }

  function handleComplete(id: number) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'COMPLETED' } : o));
  }

  return (
    <div className={styles.page}>
      {/* Page title */}
      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dark)', marginBottom: 24 }}>
        Заявки и заказы
      </h2>

      {/* Tabs */}
      <div className={styles.tabsWrap}>
        <div className={styles.tabs} role="tablist" aria-label="Статусы заказов">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = countByStatus(tab.statuses);
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ''}`}
              style={{
                color: isActive ? 'var(--dark)' : 'var(--muted)',
              }}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={styles.tabCount}
                  style={{
                    background: isActive ? 'var(--dark)' : 'var(--border)',
                    color: isActive ? '#fff' : 'var(--muted)',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
        </div>
      </div>

      {/* Orders list */}
      {visibleOrders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={styles.ordersList}>
          {visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

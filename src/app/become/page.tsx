'use client';

import React, { useState } from 'react';

/* ── Shared primitives ───────────────────────────────────────────────────── */

function CheckIcon({ color = '#D39D55' }: { color?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function StarFilled() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="#D39D55"
      stroke="#D39D55"
      strokeWidth="1"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/* ── Step icons ──────────────────────────────────────────────────────────── */

function ProfileStepIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BellStepIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ChartStepIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

/* ── Data ────────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    num: 1,
    title: 'Создайте профиль',
    description:
      'Заполните информацию о себе, добавьте портфолио, укажите услуги и цены. Это займёт не более 15 минут.',
    Icon: ProfileStepIcon,
  },
  {
    num: 2,
    title: 'Получайте заявки',
    description:
      'Клиенты найдут вас в каталоге и отправят заявки напрямую. Уведомления в реальном времени — не пропустите ни одну.',
    Icon: BellStepIcon,
  },
  {
    num: 3,
    title: 'Работайте и зарабатывайте',
    description:
      'Управляйте заказами, общайтесь с клиентами и отслеживайте аналитику в личном кабинете.',
    Icon: ChartStepIcon,
  },
] as const;

const FREE_FEATURES = [
  'Профиль в каталоге',
  'До 5 фото в портфолио',
  'Приём заявок',
  'Чат с клиентами',
  'Базовая аналитика',
];

const PRO_FEATURES = [
  'Всё из бесплатного плана',
  'Неограниченное портфолио',
  'Приоритет в поиске',
  'Значок PRO и верификация',
  'Расширенная аналитика',
  'Промо-карточка на главной',
  'Приоритетная поддержка',
];

const TESTIMONIALS = [
  {
    name: 'Марина Козлова',
    role: 'Свадебный фотограф',
    initials: 'МК',
    rating: 5,
    text: 'Зарегистрировалась год назад и уже получила более 40 заказов. Платформа удобная, клиенты серьёзные. Обновила до PRO — количество заявок выросло вдвое.',
  },
  {
    name: 'Дмитрий Волков',
    role: 'Ведущий мероприятий',
    initials: 'ДВ',
    rating: 5,
    text: 'Отличный инструмент для развития бизнеса. Через I GO WED нашёл постоянных клиентов. Интерфейс интуитивно понятный, не нужно быть технарём.',
  },
  {
    name: 'Алина Серова',
    role: 'Флорист',
    initials: 'АС',
    rating: 5,
    text: 'Раньше искала клиентов только через Instagram. С I GO WED появился стабильный поток заявок. Очень довольна результатом!',
  },
] as const;

/* ── Reusable: PlanCard ──────────────────────────────────────────────────── */

function PlanCard({
  name,
  price,
  period,
  description,
  features,
  isPro,
  ctaLabel,
}: {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: readonly string[];
  isPro?: boolean;
  ctaLabel: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        flex: 1,
        minWidth: 280,
        maxWidth: 380,
        background: '#fff',
        borderRadius: 16,
        border: isPro
          ? '2px solid var(--gold, #D39D55)'
          : '1px solid var(--border, #E5E5E5)',
        padding: '28px 28px 32px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: isPro
          ? '0 8px 32px rgba(211,157,85,0.14)'
          : '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {/* PRO badge */}
      {isPro && (
        <div
          style={{
            position: 'absolute',
            top: -13,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--gold, #D39D55)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '3px 12px',
            borderRadius: 999,
          }}
        >
          ПОПУЛЯРНЫЙ
        </div>
      )}

      {/* Plan name */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: isPro ? 'var(--gold, #D39D55)' : '#1A1A1A',
          }}
        >
          {name}
        </span>
        {isPro && (
          <span
            style={{
              background: 'rgba(211,157,85,0.12)',
              color: 'var(--gold, #D39D55)',
              border: '1px solid var(--gold, #D39D55)',
              fontSize: 10,
              fontWeight: 700,
              padding: '1px 8px',
              borderRadius: 999,
              letterSpacing: '0.05em',
            }}
          >
            PRO
          </span>
        )}
      </div>

      {/* Price */}
      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: '#1A1A1A',
            lineHeight: 1.1,
          }}
        >
          {price}
        </span>
        {period && (
          <span
            style={{
              fontSize: 14,
              color: '#6B6B6B',
              marginLeft: 4,
              fontWeight: 400,
            }}
          >
            {period}
          </span>
        )}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 13,
          color: '#6B6B6B',
          margin: '0 0 20px',
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {/* Features */}
      <ul
        style={{
          listStyle: 'none',
          margin: '0 0 24px',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flex: 1,
        }}
      >
        {features.map((feature) => (
          <li
            key={feature}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 14,
              color: '#1A1A1A',
            }}
          >
            <CheckIcon color={isPro ? 'var(--gold, #D39D55)' : '#15803D'} />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        type="button"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          padding: '13px',
          borderRadius: 10,
          border: isPro ? 'none' : '2px solid var(--gold, #D39D55)',
          background: isPro
            ? hovered
              ? 'var(--gold-dark, #B8863E)'
              : 'var(--gold, #D39D55)'
            : hovered
            ? 'rgba(211,157,85,0.08)'
            : 'transparent',
          color: isPro ? '#fff' : 'var(--gold, #D39D55)',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'background 150ms, border-color 150ms',
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */

export default function BecomeVendorPage() {
  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#1A1A1A',
      }}
    >
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--dark, #202222)',
          padding: '80px 24px 88px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {/* Overline */}
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(211,157,85,0.15)',
              color: 'var(--gold, #D39D55)',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              padding: '5px 16px',
              borderRadius: 999,
              marginBottom: 24,
            }}
          >
            Для подрядчиков
          </div>

          {/* H1 */}
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.15,
              margin: '0 0 20px',
              letterSpacing: '-0.5px',
            }}
          >
            Развивайте свой бизнес <br />
            <span style={{ color: 'var(--gold, #D39D55)' }}>с I GO WED</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.70)',
              lineHeight: 1.65,
              margin: '0 0 40px',
              maxWidth: 520,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Тысячи пар ищут профессионалов для своей свадьбы. Станьте частью
            платформы и получайте стабильный поток заказов.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              style={{
                padding: '14px 32px',
                borderRadius: 10,
                border: 'none',
                background: 'var(--gold, #D39D55)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 150ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'var(--gold-dark, #B8863E)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  'var(--gold, #D39D55)';
              }}
            >
              Зарегистрироваться бесплатно
            </button>
            <button
              type="button"
              style={{
                padding: '14px 32px',
                borderRadius: 10,
                border: '2px solid rgba(255,255,255,0.35)',
                background: 'transparent',
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'border-color 150ms, background 150ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  'rgba(255,255,255,0.7)';
                (e.currentTarget as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  'rgba(255,255,255,0.35)';
                (e.currentTarget as HTMLButtonElement).style.background =
                  'transparent';
              }}
            >
              Узнать больше
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ROW ────────────────────────────────────────────── */}
      <section
        style={{
          background: '#fff',
          borderBottom: '1px solid var(--border, #E5E5E5)',
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          }}
        >
          {[
            { value: '150+', label: 'Специалистов' },
            { value: '2500+', label: 'Заказов выполнено' },
            { value: '4.8', label: 'Средний рейтинг' },
            { value: '0 ₽', label: 'Регистрация' },
          ].map((stat, i, arr) => (
            <div
              key={stat.label}
              style={{
                textAlign: 'center',
                padding: '36px 20px',
                borderRight:
                  i < arr.length - 1
                    ? '1px solid var(--border, #E5E5E5)'
                    : 'none',
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: 'var(--gold, #D39D55)',
                  lineHeight: 1.1,
                  marginBottom: 6,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: 'var(--muted, #6B6B6B)',
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--paper, #F4F4F4)',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          {/* Section heading */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2
              style={{
                fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 800,
                margin: '0 0 12px',
                color: '#1A1A1A',
                letterSpacing: '-0.3px',
              }}
            >
              Как это работает
            </h2>
            <p
              style={{
                fontSize: 16,
                color: '#6B6B6B',
                margin: 0,
                maxWidth: 440,
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: 1.6,
              }}
            >
              Три простых шага — и вы уже получаете заявки от реальных клиентов
            </p>
          </div>

          {/* Steps */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24,
            }}
          >
            {STEPS.map((step) => (
              <div
                key={step.num}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  border: '1px solid var(--border, #E5E5E5)',
                  padding: '28px 24px 32px',
                  position: 'relative',
                }}
              >
                {/* Number circle */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'rgba(211,157,85,0.12)',
                    marginBottom: 20,
                    color: 'var(--gold, #D39D55)',
                    position: 'relative',
                  }}
                >
                  <step.Icon />
                  {/* Step number badge */}
                  <span
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'var(--gold, #D39D55)',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    margin: '0 0 10px',
                    color: '#1A1A1A',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: '#6B6B6B',
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 800,
                margin: '0 0 12px',
                letterSpacing: '-0.3px',
              }}
            >
              Простые и прозрачные тарифы
            </h2>
            <p
              style={{
                fontSize: 16,
                color: '#6B6B6B',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Начните бесплатно, перейдите на PRO когда будете готовы
            </p>
          </div>

          {/* Cards */}
          <div
            style={{
              display: 'flex',
              gap: 24,
              justifyContent: 'center',
              flexWrap: 'wrap',
              alignItems: 'stretch',
            }}
          >
            <PlanCard
              name="Бесплатный"
              price="0 ₽"
              description="Идеально для старта. Всё необходимое для создания профиля и получения первых заказов."
              features={FREE_FEATURES}
              ctaLabel="Начать бесплатно"
            />
            <PlanCard
              name="PRO"
              price="990 ₽"
              period="/ месяц"
              description="Для профессионалов, которые хотят максимальный результат и постоянный поток клиентов."
              features={PRO_FEATURES}
              isPro
              ctaLabel="Подключить PRO"
            />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--paper, #F4F4F4)',
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 800,
                margin: '0 0 12px',
                letterSpacing: '-0.3px',
              }}
            >
              Что говорят подрядчики
            </h2>
            <p style={{ fontSize: 16, color: '#6B6B6B', margin: 0 }}>
              Реальные отзывы специалистов, работающих на платформе
            </p>
          </div>

          {/* Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  border: '1px solid var(--border, #E5E5E5)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {/* Stars */}
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <StarFilled key={i} />
                  ))}
                </div>

                {/* Quote */}
                <p
                  style={{
                    fontSize: 14,
                    color: '#333',
                    lineHeight: 1.7,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Avatar */}
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: 'rgba(211,157,85,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--gold, #D39D55)',
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}
                    >
                      {t.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 1 }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM ───────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--dark, #202222)',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          {/* Decoration rings */}
          <div
            aria-hidden="true"
            style={{ marginBottom: 28, opacity: 0.45 }}
          >
            <svg width="64" height="42" viewBox="0 0 64 42" fill="none">
              <circle cx="22" cy="21" r="17" stroke="#D39D55" strokeWidth="3" />
              <circle cx="42" cy="21" r="17" stroke="#D39D55" strokeWidth="3" />
            </svg>
          </div>

          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.2,
              margin: '0 0 16px',
              letterSpacing: '-0.4px',
            }}
          >
            Готовы начать?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.65,
              margin: '0 0 36px',
            }}
          >
            Присоединяйтесь к сотням специалистов, которые уже зарабатывают
            на I GO WED. Регистрация бесплатна и займёт всего несколько минут.
          </p>
          <button
            type="button"
            style={{
              padding: '15px 40px',
              borderRadius: 10,
              border: 'none',
              background: 'var(--gold, #D39D55)',
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 150ms, transform 150ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                'var(--gold-dark, #B8863E)';
              (e.currentTarget as HTMLButtonElement).style.transform =
                'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                'var(--gold, #D39D55)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'none';
            }}
          >
            Зарегистрироваться бесплатно
          </button>
        </div>
      </section>
    </div>
  );
}

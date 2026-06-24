'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Search,
  Heart,
  HeartFilled,
  Star,
  Users,
  Chart,
  Diamond,
  Wallet,
  Shield,
  Verified,
  Lock,
  Bell,
  ChevRight,
  Pin,
  Cal,
} from '@/components/ui/Icons';
import {
  STATS,
  FEATURES,
  PICKED,
  ADVANTAGES,
  SERVICES,
  VENUES,
  PHOTO_OF_DAY,
  BLOG,
  PHOTOGRAPHERS,
  DRESSES,
  SEO_TAGS,
} from '@/data/homeData';

/* ── Helpers ─────────────────────────────────────────────────────── */

function StarRow({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(rating) ? 'var(--gold)' : '#E5E5E5'}
          stroke={i <= Math.round(rating) ? 'var(--gold)' : '#E5E5E5'}
        />
      ))}
    </span>
  );
}

function SectionHeader({
  title,
  linkLabel = 'Смотреть все',
  right,
}: {
  title: string;
  linkLabel?: string;
  right?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: 'var(--ink)',
          letterSpacing: '-0.2px',
          margin: 0,
        }}
      >
        {title}
      </h2>
      {right !== undefined ? (
        right
      ) : (
        <a
          href="#"
          style={{
            fontSize: 13,
            color: 'var(--gold)',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold-dark)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold)';
          }}
        >
          {linkLabel}
          <ChevRight size={15} />
        </a>
      )}
    </div>
  );
}

function getFeatureIcon(icon: string, size = 28): React.ReactNode {
  switch (icon) {
    case 'diamond':  return <Diamond  size={size} />;
    case 'search':   return <Search   size={size} />;
    case 'chat':     return <Bell     size={size} />;
    case 'wallet':   return <Wallet   size={size} />;
    case 'shield':   return <Shield   size={size} />;
    default:         return <Diamond  size={size} />;
  }
}

function getAdvantageIcon(icon: string, size = 22): React.ReactNode {
  switch (icon) {
    case 'verified': return <Verified size={size} />;
    case 'lock':     return <Lock     size={size} />;
    case 'bell':     return <Bell     size={size} />;
    default:         return <Shield   size={size} />;
  }
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [favs, setFavs] = useState<Set<number>>(new Set());
  const [dateVal, setDateVal] = useState('');

  function toggleFav(id: number) {
    setFavs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <>
      <Header activePage="Главная" />

      <main>
        {/* ══════════════════════════════════════════════════════════
            1. HERO
        ══════════════════════════════════════════════════════════ */}
        <section style={{ padding: '16px 32px' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 16,
              overflow: 'hidden',
              height: 480,
              backgroundImage:
                'url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&h=700&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* dark overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.45)',
              }}
            />

            {/* centred content */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 24px',
                textAlign: 'center',
              }}
            >
              <h1
                style={{
                  color: '#fff',
                  fontSize: 36,
                  fontWeight: 500,
                  lineHeight: 1.25,
                  maxWidth: 700,
                  marginBottom: 32,
                  letterSpacing: '-0.3px',
                }}
              >
                Найдите лучших подрядчиков для вашего мероприятия в любой точке мира
              </h1>

              {/* search pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#fff',
                  borderRadius: 999,
                  padding: '6px 6px 6px 20px',
                  width: '100%',
                  maxWidth: 560,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                  gap: 10,
                }}
              >
                <Cal size={18} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Дата мероприятия"
                  value={dateVal}
                  onChange={(e) => setDateVal(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: 14,
                    color: 'var(--ink)',
                    background: 'transparent',
                    minWidth: 0,
                  }}
                />
                <button
                  type="button"
                  aria-label="Поиск"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: 'var(--gold)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-dark)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)';
                  }}
                >
                  <Search size={18} style={{ color: '#fff' }} />
                </button>
              </div>

              {/* hint */}
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 14 }}>
                Более 2500 мероприятий уже организовано с I GO WED —{' '}
                <Link
                  href="/catalog"
                  style={{ color: '#F5A623', fontWeight: 600 }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none';
                  }}
                >
                  Перейти к каталогу
                </Link>
              </p>
            </div>

            {/* slider dots */}
            <div
              style={{
                position: 'absolute',
                bottom: 18,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 7,
                zIndex: 2,
              }}
            >
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Слайд ${i + 1}`}
                  onClick={() => setActiveSlide(i)}
                  style={{
                    width: activeSlide === i ? 22 : 8,
                    height: 8,
                    borderRadius: 999,
                    border: 'none',
                    background: activeSlide === i ? '#fff' : 'rgba(255,255,255,0.45)',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 250ms',
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            2. STATS
        ══════════════════════════════════════════════════════════ */}
        <section style={{ padding: '48px 0' }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 8,
              }}
            >
              {STATS.map((s, idx) => (
                <div
                  key={`stat-${idx}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    padding: '20px 10px',
                  }}
                >
                  <span style={{ color: 'var(--ink)' }}>
                    {s.icon === 'users'  && <Users size={28} />}
                    {s.icon === 'search' && <Search size={28} />}
                    {s.icon === 'heart'  && <HeartFilled size={28} />}
                    {s.icon === 'chart'  && <Chart size={28} />}
                  </span>
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      color: 'var(--gold)',
                      lineHeight: 1.1,
                    }}
                  >
                    {s.value}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            3. FEATURES
        ══════════════════════════════════════════════════════════ */}
        <section style={{ background: '#fff', padding: '48px 0 56px' }}>
          <div className="container">
            <h2
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--ink)',
                textAlign: 'center',
                maxWidth: 680,
                margin: '0 auto 36px',
                lineHeight: 1.3,
                letterSpacing: '-0.2px',
              }}
            >
              Организовать любое мероприятие быстро и просто с I GO WED!
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 14,
              }}
            >
              {FEATURES.map((f, idx) => (
                <div
                  key={`feat-${idx}`}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '20px 18px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    background: '#fff',
                  }}
                >
                  <span style={{ color: 'var(--ink)' }}>
                    {getFeatureIcon(f.icon)}
                  </span>
                  <h4
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--ink)',
                      lineHeight: 1.35,
                      margin: 0,
                    }}
                  >
                    {f.title}
                  </h4>
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--muted)',
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            4. PICKED FOR YOU
        ══════════════════════════════════════════════════════════ */}
        <section style={{ padding: '48px 0' }}>
          <div className="container">
            <SectionHeader title="Подобрано для вас" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 14,
              }}
            >
              {PICKED.map((item) => (
                <div
                  key={item.id}
                  style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {/* category badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: '#fff',
                        borderRadius: 999,
                        padding: '3px 10px',
                        fontSize: 11,
                        fontWeight: 500,
                        color: 'var(--ink)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      {item.cat}
                    </span>
                    {/* fav button */}
                    <button
                      type="button"
                      onClick={() => toggleFav(item.id)}
                      aria-label={favs.has(item.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                      }}
                    >
                      {favs.has(item.id)
                        ? <HeartFilled size={15} />
                        : <Heart size={15} style={{ color: 'var(--muted)' }} />}
                    </button>
                  </div>
                  <div style={{ padding: '10px 12px 12px' }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--ink)',
                        margin: '0 0 6px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={13} fill="var(--gold)" stroke="var(--gold)" />
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>
                          {item.rating}
                        </span>
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                        от{' '}
                        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                          {item.price} ₽
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            5. DARK ADVANTAGES
        ══════════════════════════════════════════════════════════ */}
        <section style={{ background: 'var(--dark)', padding: '56px 0' }}>
          <div className="container">
            <h2
              style={{
                color: '#fff',
                fontSize: 22,
                fontWeight: 600,
                textAlign: 'center',
                marginBottom: 40,
                letterSpacing: '-0.2px',
              }}
            >
              Почему выбирают I GO WED
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 24,
              }}
            >
              {ADVANTAGES.map((a, idx) => (
                <div
                  key={`adv-${idx}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 14,
                    padding: '24px 20px',
                  }}
                >
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: '50%',
                      background: 'rgba(211,157,85,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold)',
                      flexShrink: 0,
                    }}
                  >
                    {getAdvantageIcon(a.icon)}
                  </div>
                  <h4
                    style={{
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: 600,
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {a.title}
                  </h4>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.65)',
                      fontSize: 13,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {a.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            6. SERVICE CATALOG
        ══════════════════════════════════════════════════════════ */}
        <section style={{ background: 'var(--paper)', padding: '48px 0' }}>
          <div className="container">
            <SectionHeader title="Каталог услуг" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 12,
              }}
            >
              {SERVICES.map((svc) => (
                <a
                  key={svc.id}
                  href="#"
                  style={{
                    position: 'relative',
                    aspectRatio: '1/1',
                    borderRadius: 10,
                    overflow: 'hidden',
                    display: 'block',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={svc.img}
                    alt={svc.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 300ms',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 55%)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      left: 10,
                      right: 10,
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {svc.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            7. "ВЫ ПРОФЕССИОНАЛ?" BANNER
        ══════════════════════════════════════════════════════════ */}
        <section
          style={{
            position: 'relative',
            backgroundImage:
              'url(https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1400&h=500&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '60px 0',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(26,26,26,0.78)',
            }}
          />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <h2
              style={{
                color: '#fff',
                fontSize: 26,
                fontWeight: 600,
                textAlign: 'center',
                marginBottom: 36,
                letterSpacing: '-0.3px',
              }}
            >
              Вы профессионал в свадебной индустрии?
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 14,
                marginBottom: 36,
              }}
            >
              {[
                { icon: <Users size={22} />,  title: 'Бесплатная регистрация',        desc: 'Создайте профиль за несколько минут без вложений.' },
                { icon: <Users size={22} />,  title: 'Доступ к целевой аудитории',    desc: 'Тысячи пар ищут специалистов прямо сейчас.' },
                { icon: <Chart size={22} />,  title: 'Простое управление заказами',   desc: 'Удобная CRM для работы с клиентами и заявками.' },
                { icon: <Star  size={22} />,  title: 'Продвижение вашей услуги',      desc: 'Попадите в топ выдачи и получите больше заказов.' },
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: 10,
                    padding: '22px 18px',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <span style={{ color: 'var(--gold)' }}>{card.icon}</span>
                  <h4
                    style={{
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      margin: 0,
                      lineHeight: 1.35,
                    }}
                  >
                    {card.title}
                  </h4>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.65)',
                      fontSize: 12,
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <a href="#" className="btn btn-gold btn-lg btn-pill">
                Перейти »
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            8. BEST VENUES
        ══════════════════════════════════════════════════════════ */}
        <section style={{ padding: '48px 0' }}>
          <div className="container">
            <SectionHeader title="Лучшие площадки" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 14,
              }}
            >
              {VENUES.map((v) => (
                <div
                  key={v.id}
                  style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                    <img
                      src={v.img}
                      alt={v.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 300ms',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--ink)',
                        margin: '0 0 4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {v.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                      <Pin size={12} style={{ color: 'var(--muted)' }} />
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{v.city}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <StarRow rating={v.rating} />
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                        от <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{v.price} ₽</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            9. PHOTO OF DAY
        ══════════════════════════════════════════════════════════ */}
        <section style={{ background: 'var(--paper)', padding: '48px 0' }}>
          <div className="container">
            <SectionHeader title="Фото дня" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 14,
              }}
            >
              {PHOTO_OF_DAY.map((p) => (
                <div
                  key={p.id}
                  style={{
                    position: 'relative',
                    aspectRatio: '3/4',
                    borderRadius: 12,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={p.img}
                    alt={p.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 400ms',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 50%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      right: 16,
                    }}
                  >
                    <p
                      style={{
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: 600,
                        margin: '0 0 4px',
                        lineHeight: 1.2,
                      }}
                    >
                      {p.title}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Pin size={12} style={{ color: 'rgba(255,255,255,0.8)' }} />
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>{p.place}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            10. BLOG
        ══════════════════════════════════════════════════════════ */}
        <section style={{ padding: '48px 0' }}>
          <div className="container">
            <SectionHeader
              title="Блог"
              right={
                <a href="#" className="btn btn-outline-gold btn-sm btn-pill">
                  Написать обзор
                </a>
              }
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 16,
              }}
            >
              {BLOG.map((post) => (
                <div
                  key={post.id}
                  style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden', flexShrink: 0 }}>
                    <img
                      src={post.img}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 300ms',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                  <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        background: 'var(--gold-soft)',
                        color: 'var(--gold-dark)',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: 999,
                        alignSelf: 'flex-start',
                      }}
                    >
                      {post.cat}
                    </span>
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--ink)',
                        margin: 0,
                        lineHeight: 1.35,
                      }}
                    >
                      {post.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 12,
                        color: 'var(--muted)',
                        lineHeight: 1.55,
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      {post.excerpt}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 4,
                      }}
                    >
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>{post.date}</span>
                      <a
                        href="#"
                        style={{
                          fontSize: 12,
                          color: 'var(--gold)',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold-dark)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold)';
                        }}
                      >
                        Читать
                        <ChevRight size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            11. PHOTOGRAPHERS
        ══════════════════════════════════════════════════════════ */}
        <section style={{ background: 'var(--paper)', padding: '48px 0' }}>
          <div className="container">
            <SectionHeader title="Фотограф для вашего события" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 14,
              }}
            >
              {PHOTOGRAPHERS.map((ph) => (
                <div
                  key={ph.id}
                  style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
                    <img
                      src={ph.avatar}
                      alt={ph.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 300ms',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--ink)',
                        margin: '0 0 3px',
                      }}
                    >
                      {ph.name}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: 'var(--muted)',
                        margin: '0 0 8px',
                      }}
                    >
                      {ph.spec}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <StarRow rating={ph.rating} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            12. DRESSES
        ══════════════════════════════════════════════════════════ */}
        <section style={{ padding: '48px 0' }}>
          <div className="container">
            <SectionHeader title="Образы невесты" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 14,
              }}
            >
              {DRESSES.map((d) => (
                <div
                  key={d.id}
                  style={{
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                    <img
                      src={d.img}
                      alt={d.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 300ms',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--ink)',
                        margin: '0 0 2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {d.name}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: 'var(--muted)',
                        margin: '0 0 6px',
                      }}
                    >
                      {d.brand}
                    </p>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'var(--gold)',
                      }}
                    >
                      {d.price} $
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            13. SEO TAGS
        ══════════════════════════════════════════════════════════ */}
        <section
          style={{
            borderTop: '1px solid var(--border)',
            padding: '36px 0 48px',
          }}
        >
          <div className="container">
            {Object.entries(SEO_TAGS).map(([label, tags], idx) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 20,
                  padding: '14px 0',
                  borderBottom:
                    idx < Object.keys(SEO_TAGS).length - 1
                      ? '1px solid var(--border)'
                      : 'none',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    minWidth: 220,
                    lineHeight: 1.5,
                    paddingTop: 2,
                    flexShrink: 0,
                  }}
                >
                  {label}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {tags.map((tag) => (
                    <a
                      key={tag}
                      href="#"
                      style={{
                        fontSize: 12,
                        color: 'var(--muted)',
                        padding: '4px 12px',
                        borderRadius: 999,
                        border: '1px solid var(--border)',
                        transition: 'all 150ms',
                        display: 'inline-block',
                        lineHeight: 1.5,
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.borderColor = 'var(--gold)';
                        el.style.color = 'var(--gold-dark)';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.borderColor = 'var(--border)';
                        el.style.color = 'var(--muted)';
                      }}
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

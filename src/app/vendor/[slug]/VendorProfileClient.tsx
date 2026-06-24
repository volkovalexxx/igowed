'use client';

import React, { useState } from 'react';
import { Pin, Phone, Globe, Star, Chat, Check, Close } from '@/components/ui/Icons';

/* ── Types ──────────────────────────────────────────────────────────────── */

export type DisplayMode = 'VERTICAL' | 'HORIZONTAL' | 'SQUARE';

export interface VendorService {
  id: string;
  category: string;
  price: string;
  description: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  date: string;
  rating: number;
  text: string;
}

export interface VendorPhoto {
  id: string;
  src: string;
  alt: string;
}

export interface VendorData {
  slug: string;
  name: string;
  username: string;
  city: string;
  isPro: boolean;
  rating: number;
  reviewCount: number;
  photosCount: number;
  price: string;
  coverPhoto: string;
  avatar: string;
  displayMode: DisplayMode;
  bio: string;
  address: string;
  phone: string;
  website: string;
  instagram: string;
  languages: string[];
  workingHours: string;
  bankDetails: string;
  photos: VendorPhoto[];
  services: VendorService[];
  reviews: Review[];
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? 'star-filled' : 'star-empty'}
        />
      ))}
    </span>
  );
}

function RatingBreakdown({ vendor }: { vendor: VendorData }) {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: vendor.reviews.filter((r) => r.rating === star).length,
  }));
  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1, color: 'var(--dark)' }}>
            {vendor.rating}
          </div>
          <StarRating rating={vendor.rating} size={16} />
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            {vendor.reviewCount} отзывов
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {counts.map(({ star, count }) => (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: 'var(--muted)', width: 16, textAlign: 'right' }}>{star}</span>
              <Star size={11} className="star-filled" />
              <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(count / max) * 100}%`,
                    background: 'var(--gold)',
                    borderRadius: 3,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <span style={{ fontSize: 12, color: 'var(--muted)', width: 16 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface LightboxProps {
  photos: VendorPhoto[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ photos, index, onClose, onPrev, onNext }: LightboxProps) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 20, right: 20,
          color: '#fff', background: 'rgba(255,255,255,0.15)',
          border: 'none', borderRadius: '50%', width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Close size={20} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        style={{
          position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
          color: '#fff', background: 'rgba(255,255,255,0.15)',
          border: 'none', borderRadius: '50%', width: 44, height: 44,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 22,
        }}
      >
        ‹
      </button>

      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
        <img
          src={photos[index].src}
          alt={photos[index].alt}
          style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8 }}
        />
        <div style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 10, fontSize: 13 }}>
          {index + 1} / {photos.length}
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        style={{
          position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
          color: '#fff', background: 'rgba(255,255,255,0.15)',
          border: 'none', borderRadius: '50%', width: 44, height: 44,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 22,
        }}
      >
        ›
      </button>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ minWidth: 120, fontSize: 13, color: 'var(--muted)', fontWeight: 500, paddingTop: 1 }}>
        {label}
      </div>
      <div style={{ flex: 1, fontSize: 14, color: 'var(--dark)', lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  );
}

/* ── Main client component ──────────────────────────────────────────────── */

type Tab = 'portfolio' | 'packages' | 'reviews' | 'info';

export default function VendorProfileClient({ vendor }: { vendor: VendorData }) {
  const [activeTab, setActiveTab] = useState<Tab>('portfolio');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [savedToFavorites, setSavedToFavorites] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);

  const gridConfig: Record<DisplayMode, { cols: string; aspectRatio: string }> = {
    VERTICAL: { cols: 'repeat(3, 1fr)', aspectRatio: '2/3' },
    HORIZONTAL: { cols: 'repeat(2, 1fr)', aspectRatio: '16/9' },
    SQUARE: { cols: 'repeat(4, 1fr)', aspectRatio: '1/1' },
  };
  const grid = gridConfig[vendor.displayMode];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'portfolio', label: 'Портфолио' },
    { key: 'packages', label: 'Пакеты' },
    { key: 'reviews', label: 'Отзывы' },
    { key: 'info', label: 'Инфо' },
  ];

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* ── Cover photo ── */}
      <div style={{ position: 'relative', height: 280, background: '#222', overflow: 'hidden' }}>
        <img
          src={vendor.coverPhoto}
          alt="Обложка"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
        <div
          style={{
            position: 'absolute', bottom: -40, left: 32,
            width: 80, height: 80, borderRadius: '50%',
            border: '3px solid var(--gold)',
            overflow: 'hidden', background: '#fff',
          }}
        >
          <img src={vendor.avatar} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* ── Profile info ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ paddingTop: 52 }}>
          {/* Name + actions */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--dark)', margin: 0 }}>{vendor.name}</h1>
                {vendor.isPro && (
                  <span style={{
                    background: 'var(--gold)', color: '#fff',
                    fontSize: 11, fontWeight: 700, padding: '2px 7px',
                    borderRadius: 4, letterSpacing: '0.04em',
                  }}>
                    PRO
                  </span>
                )}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 3 }}>{vendor.username}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
                <Pin size={14} />
                <span>{vendor.city}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSavedToFavorites(!savedToFavorites)}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', background: savedToFavorites ? '#fff5ec' : '#fff',
                  transition: '150ms', fontSize: 18,
                }}
              >
                <span style={{ color: savedToFavorites ? 'var(--gold)' : 'var(--muted)' }}>
                  {savedToFavorites ? '♥' : '♡'}
                </span>
              </button>
              <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Chat size={15} />
                Написать
              </button>
              <button className="btn btn-gold">В профиль</button>
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20,
            marginTop: 16, padding: '14px 0',
            borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <StarRating rating={vendor.rating} size={15} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>{vendor.rating}</span>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>({vendor.reviewCount} отзывов)</span>
            </div>
            <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              <span style={{ color: 'var(--dark)', fontWeight: 600 }}>{vendor.photosCount}</span> фото
            </div>
            <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              <span style={{ color: 'var(--dark)', fontWeight: 600 }}>{vendor.reviewCount}</span> отзывов
            </div>
            <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
            <div style={{ color: 'var(--dark)', fontWeight: 600, fontSize: 13 }}>{vendor.price}</div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginTop: 24 }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '10px 20px',
                  fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 400,
                  color: activeTab === tab.key ? 'var(--gold)' : 'var(--muted)',
                  background: 'none', border: 'none',
                  borderBottom: activeTab === tab.key ? '2px solid var(--gold)' : '2px solid transparent',
                  cursor: 'pointer', transition: '150ms', marginBottom: -1,
                  fontFamily: 'inherit',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ paddingTop: 24, paddingBottom: 48 }}>

            {/* PORTFOLIO */}
            {activeTab === 'portfolio' && (
              <div>
                {vendor.photos.length === 0 ? (
                  <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '48px 0' }}>
                    Фото пока нет
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: grid.cols, gap: 8 }}>
                    {vendor.photos.map((photo, idx) => (
                      <button
                        key={photo.id}
                        onClick={() => setLightboxIndex(idx)}
                        style={{
                          border: 'none', padding: 0, cursor: 'pointer',
                          borderRadius: 8, overflow: 'hidden',
                          aspectRatio: grid.aspectRatio,
                          background: 'var(--paper)',
                        }}
                      >
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                          onMouseOver={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }}
                          onMouseOut={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PACKAGES */}
            {activeTab === 'packages' && (
              <div>
                {vendor.services.length === 0 ? (
                  <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '48px 0' }}>Нет пакетов</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {vendor.services.map((svc) => (
                      <div
                        key={svc.id}
                        style={{
                          border: '1px solid var(--border)',
                          borderRadius: 10, padding: '20px 24px',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                          gap: 16, flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6, color: 'var(--dark)' }}>
                            {svc.category}
                          </div>
                          <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.5 }}>
                            {svc.description}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                          <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--gold)' }}>{svc.price}</div>
                          <button className="btn btn-gold btn-sm">Выбрать</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === 'reviews' && (
              <div>
                <RatingBreakdown vendor={vendor} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {vendor.reviews.map((review) => (
                    <div key={review.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 20 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{review.userName}</span>
                            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{review.date}</span>
                          </div>
                          <StarRating rating={review.rating} size={13} />
                          <p style={{ marginTop: 8, fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>
                            {review.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INFO */}
            {activeTab === 'info' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
                <div style={{
                  borderRadius: 10, height: 180,
                  background: 'var(--paper)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--muted)', fontSize: 13,
                }}>
                  Карта
                </div>

                <InfoRow label="Адрес">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Pin size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                    {vendor.address}
                  </span>
                </InfoRow>

                <InfoRow label="Телефон">
                  <a href={`tel:${vendor.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold)' }}>
                    <Phone size={15} />
                    {vendor.phone}
                  </a>
                </InfoRow>

                <InfoRow label="Сайт">
                  <a href={`https://${vendor.website}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold)' }}>
                    <Globe size={15} />
                    {vendor.website}
                  </a>
                </InfoRow>

                <InfoRow label="Instagram">
                  <span style={{ color: 'var(--gold)' }}>{vendor.instagram}</span>
                </InfoRow>

                <InfoRow label="Часы работы">
                  {vendor.workingHours}
                </InfoRow>

                <InfoRow label="Языки">
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {vendor.languages.map((lang) => (
                      <span key={lang} style={{
                        background: 'var(--paper)', border: '1px solid var(--border)',
                        borderRadius: 4, padding: '2px 8px', fontSize: 12,
                      }}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </InfoRow>

                <InfoRow label="Реквизиты">
                  {showBankDetails ? (
                    <div>
                      <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 6px' }}>{vendor.bankDetails}</p>
                      <button
                        onClick={() => setShowBankDetails(false)}
                        style={{ fontSize: 12, color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Скрыть
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowBankDetails(true)}
                      style={{
                        fontSize: 13, color: 'var(--gold)',
                        background: 'none', border: '1px solid var(--gold)',
                        borderRadius: 6, padding: '5px 12px', cursor: 'pointer',
                      }}
                    >
                      Показать реквизиты
                    </button>
                  )}
                </InfoRow>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={vendor.photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => ((i ?? 0) - 1 + vendor.photos.length) % vendor.photos.length)}
          onNext={() => setLightboxIndex((i) => ((i ?? 0) + 1) % vendor.photos.length)}
        />
      )}
    </div>
  );
}

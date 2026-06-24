'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Stars from './Stars';
import { Pin, Bookmark, Share, Chat } from './Icons';

/* ── Types ───────────────────────────────────────────────────────── */

export interface Vendor {
  id: string | number;
  name: string;
  username: string;
  /** URL slug for the vendor profile page */
  slug?: string;
  /** URL or null to show initials */
  avatar?: string | null;
  /** e.g. ["Беларусь", "Минск", "Гродно"] */
  cities: string[];
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  currency?: string;
  tags: string[];
  /** Up to 4 photo URLs for the grid */
  photos: string[];
  description?: string;
}

interface VendorCardProps {
  vendor: Vendor;
  onWriteMessage?: (vendor: Vendor) => void;
  onVisitProfile?: (vendor: Vendor) => void;
  onToggleBookmark?: (vendor: Vendor) => void;
  onShare?: (vendor: Vendor) => void;
  className?: string;
}

/* ── Avatar ──────────────────────────────────────────────────────── */

function Avatar({ src, name, size = 64 }: { src?: string | null; name: string; size?: number }) {
  const [error, setError] = useState(false);
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  if (src && !error) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        onError={() => setError(true)}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{
        width: size,
        height: size,
        background: 'var(--gold)',
        fontSize: size * 0.3,
      }}
    >
      {initials || '?'}
    </span>
  );
}

/* ── Photo grid ──────────────────────────────────────────────────── */

function PhotoGrid({ photos }: { photos: string[] }) {
  const [errors, setErrors] = useState<Record<number, boolean>>({});

  const handleError = (i: number) =>
    setErrors((prev) => ({ ...prev, [i]: true }));

  // Fill up to 4 slots
  const slots = Array.from({ length: 4 }, (_, i) => photos[i] ?? null);

  return (
    <div
      className="grid grid-cols-2 gap-1 shrink-0"
      style={{ width: 200 }}
      aria-label="Фотографии портфолио"
    >
      {slots.map((src, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded"
          style={{ aspectRatio: '1/1', borderRadius: 4, background: '#F4F4F4' }}
        >
          {src && !errors[i] ? (
            <img
              src={src}
              alt={`Фото ${i + 1}`}
              onError={() => handleError(i)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: '#ccc' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Tag pill ────────────────────────────────────────────────────── */

function Tag({ label }: { label: string }) {
  return (
    <span
      className="inline-block rounded-full font-medium"
      style={{
        fontSize: 11,
        padding: '3px 10px',
        background: '#F4F4F4',
        color: 'var(--ink-2, #333)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

/* ── Main VendorCard ─────────────────────────────────────────────── */

export default function VendorCard({
  vendor,
  onWriteMessage,
  onVisitProfile,
  onToggleBookmark,
  onShare,
  className = '',
}: VendorCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const currency = vendor.currency ?? 'RUB';
  const locationStr = vendor.cities.join(', ');

  function handleBookmark() {
    setBookmarked((v) => !v);
    onToggleBookmark?.(vendor);
  }

  return (
    <article
      className={`flex gap-4 bg-white ${className}`}
      style={{
        borderRadius: 8,
        border: '1px solid var(--border)',
        padding: 16,
      }}
    >
      {/* ── Column 1: Avatar + identity ─────────────────────── */}
      <div className="flex flex-col items-center shrink-0" style={{ width: 80 }}>
        <Avatar src={vendor.avatar} name={vendor.name} size={64} />
        <p
          className="mt-2 font-medium text-center truncate w-full"
          style={{ fontSize: 12, color: 'var(--gold)' }}
          title={`@${vendor.username}`}
        >
          @{vendor.username}
        </p>
        <div
          className="flex items-start gap-0.5 mt-1 text-center"
          style={{ color: 'var(--muted)', maxWidth: 80 }}
        >
          <Pin
            size={11}
            style={{ marginTop: 2, flexShrink: 0, color: 'var(--muted)' }}
          />
          <span
            style={{
              fontSize: 11,
              lineHeight: 1.4,
              color: 'var(--muted)',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {locationStr}
          </span>
        </div>
      </div>

      {/* ── Column 2: Main info ──────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {/* Name + rating */}
        <div className="flex items-start flex-wrap gap-x-3 gap-y-1">
          <h3
            className="font-semibold leading-tight"
            style={{ fontSize: 16, color: 'var(--ink)', margin: 0 }}
          >
            {vendor.name}
          </h3>
          <Stars
            value={vendor.rating}
            size={13}
            reviewCount={vendor.reviewCount}
          />
        </div>

        {/* Description */}
        {vendor.description && (
          <p
            className="leading-relaxed line-clamp-3"
            style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}
          >
            {vendor.description}
          </p>
        )}

        {/* Tags */}
        {vendor.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {vendor.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}
      </div>

      {/* ── Column 3: Photo grid (hidden on small screens) ── */}
      <div className="hidden lg:block shrink-0">
        <PhotoGrid photos={vendor.photos} />
      </div>

      {/* ── Column 4: Price + CTA ────────────────────────────── */}
      <div
        className="flex flex-col items-stretch gap-2 shrink-0"
        style={{ width: 160 }}
      >
        {/* Price */}
        <div>
          <p
            className="font-bold leading-tight"
            style={{ fontSize: 15, color: 'var(--ink)' }}
          >
            от {vendor.pricePerHour.toLocaleString('ru-RU')}{' '}
            <span style={{ fontSize: 12, fontWeight: 500 }}>
              {currency}/час
            </span>
          </p>
        </div>

        {/* Buttons */}
        <button
          type="button"
          onClick={() => onWriteMessage?.(vendor)}
          className="btn btn-outline w-full flex items-center justify-center gap-1.5"
          style={{ borderRadius: 6, fontSize: 13, padding: '8px 12px' }}
        >
          <Chat size={14} />
          Написать
        </button>
        <Link
          href={vendor.slug ? `/vendor/${vendor.slug}` : `/vendor/${vendor.id}`}
          onClick={() => onVisitProfile?.(vendor)}
          className="btn btn-gold w-full"
          style={{ borderRadius: 6, fontSize: 13, padding: '8px 12px', textDecoration: 'none', textAlign: 'center', display: 'block' }}
        >
          Перейти в профиль
        </Link>

        {/* Bookmark + Share */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleBookmark}
            aria-label={bookmarked ? 'Убрать из сохранённых' : 'Сохранить'}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[#F4F4F4]"
            style={{ color: bookmarked ? 'var(--gold)' : 'var(--muted)' }}
          >
            <Bookmark size={16} />
          </button>
          <button
            type="button"
            onClick={() => onShare?.(vendor)}
            aria-label="Поделиться"
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[#F4F4F4]"
            style={{ color: 'var(--muted)' }}
          >
            <Share size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

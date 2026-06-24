'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Search, Heart, ChevDown } from '@/components/ui/Icons';

/* ── Types ───────────────────────────────────────────────────────── */

interface HeaderProps {
  activePage?: string;
  onNavigate?: (page: NavLabel) => void;
}

/* ── Constants ───────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Главная',  href: '/' },
  { label: 'Площадки', href: '/catalog?cat=venues' },
  { label: 'Каталог',  href: '/catalog' },
  { label: 'Блог',     href: '/blog' },
  { label: 'Стать подрядчиком', href: '/become' },
] as const;

type NavLabel = (typeof NAV_LINKS)[number]['label'];

const CITIES = [
  'Барановичи',
  'Бобруйск',
  'Брест',
  'Борисов',
  'Витебск',
  'Гомель',
  'Гродно',
  'Минск',
  'Могилев',
  'Мозырь',
  'Молодечно',
  'Пинск',
  'Солигорск',
  'Орша',
] as const;

/* ── Logo ────────────────────────────────────────────────────────── */

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className="font-extrabold tracking-tight select-none"
      style={{ fontSize: 17, letterSpacing: '-0.3px', color: dark ? '#fff' : 'var(--ink)' }}
    >
      I GO{' '}
      <span style={{ color: 'var(--gold)' }}>WED</span>
    </span>
  );
}

/* ── Dropdown pill ───────────────────────────────────────────────── */

function DropdownPill({ label }: { label: string }) {
  return (
    <button
      className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[#F4F4F4]"
      style={{ borderColor: 'var(--border)', fontSize: 12 }}
      type="button"
    >
      {label}
      <ChevDown size={12} />
    </button>
  );
}

/* ── Hamburger icon ──────────────────────────────────────────────── */

function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-md transition-colors hover:bg-[#F4F4F4]"
      aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
      type="button"
    >
      <span
        className="block w-5 h-[1.5px] bg-current transition-all duration-200"
        style={{ transform: open ? 'translateY(4.5px) rotate(45deg)' : 'none' }}
      />
      <span
        className="block w-5 h-[1.5px] bg-current transition-all duration-200"
        style={{ opacity: open ? 0 : 1 }}
      />
      <span
        className="block w-5 h-[1.5px] bg-current transition-all duration-200"
        style={{ transform: open ? 'translateY(-4.5px) rotate(-45deg)' : 'none' }}
      />
    </button>
  );
}

/* ── Mobile menu ─────────────────────────────────────────────────── */

function MobileMenu({
  open,
  activePage,
  onNavigate,
  onClose,
}: {
  open: boolean;
  activePage?: string;
  onNavigate?: (page: NavLabel) => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="absolute top-full left-0 right-0 z-50 bg-white border-b shadow-lg md:hidden"
      style={{ borderColor: 'var(--border)' }}
    >
      <nav className="container py-3 flex flex-col gap-1">
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = activePage === label;
          return (
            <Link
              key={label}
              href={href}
              onClick={() => {
                onNavigate?.(label);
                onClose();
              }}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: isActive ? 'var(--gold)' : 'var(--ink)',
                background: isActive ? 'var(--gold-soft, #F5E6CC)' : 'transparent',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              {label}
            </Link>
          );
        })}
        <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            type="button"
            className="btn btn-gold w-full"
            style={{ borderRadius: 6, padding: '9px 14px', fontSize: 13 }}
          >
            Создать мероприятие
          </button>
        </div>
      </nav>
    </div>
  );
}

/* ── Main Header ─────────────────────────────────────────────────── */

export default function Header({ activePage = 'Главная', onNavigate }: HeaderProps) {
  // onNavigate is forwarded to Links for custom handling if needed
  const [activeCity, setActiveCity] = useState<string>('Минск');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const citiesRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 w-full bg-white"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {/* ── Row 1: main header ─────────────────────────────────── */}
      <div className="hd-top container relative">
        <div className="flex items-center h-[60px] gap-4">

          {/* Logo */}
          <Link href="/" aria-label="I GO WED — на главную" className="shrink-0">
            <Logo />
          </Link>

          {/* Desktop nav — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = activePage === label;
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => onNavigate?.(label)}
                  className="px-3 py-2 rounded-md transition-colors font-medium"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: isActive ? 'var(--gold)' : 'var(--ink)',
                    background: 'transparent',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)';
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right controls — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {/* Create event button */}
            <button
              type="button"
              className="btn btn-gold"
              style={{ borderRadius: 6, padding: '9px 14px', fontSize: 13 }}
            >
              Создать мероприятие
            </button>

            {/* Currency dropdown */}
            <DropdownPill label="RUB" />

            {/* Language dropdown */}
            <DropdownPill label="RU" />

            {/* Search icon */}
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-[#F4F4F4]"
              style={{ color: 'var(--ink)' }}
              aria-label="Поиск"
            >
              <Search size={18} />
            </button>

            {/* Bell with red dot */}
            <button
              type="button"
              className="relative w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-[#F4F4F4]"
              style={{ color: 'var(--ink)' }}
              aria-label="Уведомления"
            >
              <Bell size={18} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: 'var(--red)', border: '1.5px solid #fff' }}
              />
            </button>

            {/* Heart */}
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-[#F4F4F4]"
              style={{ color: 'var(--ink)' }}
              aria-label="Избранное"
            >
              <Heart size={18} />
            </button>

            {/* User avatar pill */}
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-[#EBEBEB]"
              style={{ background: '#F4F4F4' }}
              aria-label="Профиль пользователя"
            >
              {/* Avatar circle */}
              <span
                className="w-7 h-7 rounded-full inline-flex items-center justify-center text-white font-semibold text-xs shrink-0"
                style={{ background: 'var(--gold)', fontSize: 11 }}
              >
                О
              </span>
              <span
                className="text-sm font-medium pr-1"
                style={{ fontSize: 13, color: 'var(--ink)' }}
              >
                Ольга
              </span>
            </button>
          </div>

          {/* Right controls — mobile only */}
          <div className="flex md:hidden items-center gap-1">
            {/* Bell with red dot */}
            <button
              type="button"
              className="relative w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-[#F4F4F4]"
              aria-label="Уведомления"
            >
              <Bell size={18} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: 'var(--red)', border: '1.5px solid #fff' }}
              />
            </button>

            {/* Search */}
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-[#F4F4F4]"
              aria-label="Поиск"
            >
              <Search size={18} />
            </button>

            {/* Hamburger */}
            <Hamburger
              open={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
            />
          </div>
        </div>

        {/* Mobile flyout menu */}
        <MobileMenu
          open={mobileMenuOpen}
          activePage={activePage}
          onNavigate={onNavigate}
          onClose={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* ── Row 2: cities strip ────────────────────────────────── */}
      <div
        className="hd-cities border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          ref={citiesRef}
          className="container"
          style={{ overflowX: 'auto', scrollbarWidth: 'none' }}
        >
          {/* Hide webkit scrollbar via inline style injection is handled in globals.css */}
          <style>{`.hd-cities::-webkit-scrollbar{display:none}`}</style>
          <div className="flex items-center gap-1.5 py-2 w-max min-w-full">
            {CITIES.map((city) => {
              const isActive = activeCity === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setActiveCity(city)}
                  className="shrink-0 transition-colors font-medium"
                  style={{
                    fontSize: 11,
                    padding: '6px 14px',
                    borderRadius: 999,
                    color: isActive ? 'var(--gold-dark, #B8863E)' : 'var(--gold)',
                    background: isActive ? 'var(--gold-soft, #F5E6CC)' : 'transparent',
                    border: 'none',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    lineHeight: 1.4,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#F4F4F4';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

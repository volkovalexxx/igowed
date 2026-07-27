'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Bell, Search, Heart, ChevDown } from '@/components/ui/Icons';
import { hubLinksForRole } from '@/features/home/hub/hubLinks';
import { headerInitial, type HeaderViewer } from './header.helpers';

/* ── Types ───────────────────────────────────────────────────────── */

interface HeaderProps {
  activePage?: string;
  onNavigate?: (page: NavLabel) => void;
  /** Данные залогиненного пользователя; отсутствует/undefined — гость. */
  viewer?: HeaderViewer | null;
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

/* ── Auth: guest buttons ─────────────────────────────────────────── */

function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-md px-3 py-2 font-medium transition-colors hover:bg-[#F4F4F4]"
        style={{ fontSize: 13, color: 'var(--ink)', textDecoration: 'none' }}
      >
        Войти
      </Link>
      <Link href="/register" className="btn btn-gold" style={{ borderRadius: 6, padding: '9px 14px', fontSize: 13 }}>
        Регистрация
      </Link>
    </div>
  );
}

/* ── Auth: logged-in user menu ───────────────────────────────────── */

function UserMenu({ viewer }: { viewer: HeaderViewer }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const links = hubLinksForRole(viewer.role);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-[#EBEBEB]"
        style={{ background: '#F4F4F4' }}
      >
        <span
          className="w-7 h-7 rounded-full inline-flex items-center justify-center text-white font-semibold shrink-0"
          style={{ background: 'var(--gold)', fontSize: 11 }}
        >
          {headerInitial(viewer.name)}
        </span>
        <span className="font-medium pr-1" style={{ fontSize: 13, color: 'var(--ink)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {viewer.name ?? 'Профиль'}
        </span>
        <ChevDown size={12} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 z-50 rounded-xl bg-white overflow-hidden"
          style={{ minWidth: 220, border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}
        >
          <div style={{ padding: '4px' }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 transition-colors hover:bg-[#F7F7F7]"
                style={{ fontSize: 13, color: 'var(--ink)', textDecoration: 'none' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', padding: '4px' }}>
            <button
              type="button"
              role="menuitem"
              disabled={busy}
              onClick={() => {
                setBusy(true);
                void signOut({ redirectTo: '/' });
              }}
              className="w-full text-left rounded-lg px-3 py-2 transition-colors hover:bg-[#FDECEC]"
              style={{ fontSize: 13, color: 'var(--red, #E02C2C)', background: 'transparent', border: 0, cursor: busy ? 'default' : 'pointer', fontFamily: 'inherit' }}
            >
              {busy ? 'Выход…' : 'Выйти'}
            </button>
          </div>
        </div>
      )}
    </div>
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
  viewer,
}: {
  open: boolean;
  activePage?: string;
  onNavigate?: (page: NavLabel) => void;
  onClose: () => void;
  viewer?: HeaderViewer | null;
}) {
  const [busy, setBusy] = useState(false);
  if (!open) return null;

  const userLinks = viewer ? hubLinksForRole(viewer.role) : [];

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

        {viewer ? (
          <div className="mt-2 pt-2 border-t flex flex-col gap-1" style={{ borderColor: 'var(--border)' }}>
            {userLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="px-3 py-2.5 rounded-lg text-sm font-medium"
                style={{ color: 'var(--ink)', textDecoration: 'none' }}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setBusy(true);
                void signOut({ redirectTo: '/' });
              }}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium"
              style={{ color: 'var(--red, #E02C2C)', background: 'transparent', border: 0, fontFamily: 'inherit' }}
            >
              {busy ? 'Выход…' : 'Выйти'}
            </button>
          </div>
        ) : (
          <div className="mt-2 pt-2 border-t flex flex-col gap-2" style={{ borderColor: 'var(--border)' }}>
            <Link href="/login" onClick={onClose} className="px-3 py-2.5 rounded-lg text-sm font-medium text-center" style={{ color: 'var(--ink)', border: '1px solid var(--border)', textDecoration: 'none' }}>
              Войти
            </Link>
            <Link href="/register" onClick={onClose} className="btn btn-gold w-full" style={{ borderRadius: 6, padding: '9px 14px', fontSize: 13 }}>
              Регистрация
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}

/* ── Main Header ─────────────────────────────────────────────────── */

export default function Header({ activePage = 'Главная', onNavigate, viewer }: HeaderProps) {
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
            {/* Create event */}
            <Link
              href="/event/new"
              className="btn btn-gold"
              style={{ borderRadius: 6, padding: '9px 14px', fontSize: 13 }}
            >
              Создать мероприятие
            </Link>

            {/* Currency / language dropdowns */}
            <DropdownPill label="RUB" />
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

            {viewer ? (
              <>
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

                <UserMenu viewer={viewer} />
              </>
            ) : (
              <AuthButtons />
            )}
          </div>

          {/* Right controls — mobile only */}
          <div className="flex md:hidden items-center gap-1">
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
          viewer={viewer}
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

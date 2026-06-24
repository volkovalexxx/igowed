'use client';

import React, { useEffect, useCallback } from 'react';
import { Close } from '@/components/ui/Icons';

/* ── Types ───────────────────────────────────────────────────────────────── */

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  activePage?: string;
  onNavigate?: (page: string) => void;
}

/* ── Nav links ───────────────────────────────────────────────────────────── */

const NAV_LINKS = ['Главная', 'Площадки', 'Каталог', 'Фото', 'Блог'] as const;

/* ── Social icons ────────────────────────────────────────────────────────── */

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22 2L11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0" />
    </svg>
  );
}

function VKIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 7h3.5l2 5 2-5H13l-4 5 4 5H9.5l-2-5-2 5H2l4-5-4-5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M13 12h3.5c1.5 0 2.5 1 2.5 2.5V17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ── MobileNav ───────────────────────────────────────────────────────────── */

export default function MobileNav({
  open,
  onClose,
  activePage,
  onNavigate,
}: MobileNavProps) {
  /* ESC to close */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, handleKeyDown]);

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 150,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 250ms ease',
        }}
      />

      {/* ── Drawer ────────────────────────────────────────────────── */}
      <nav
        role="dialog"
        aria-modal="true"
        aria-label="Меню навигации"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 151,
          width: 320,
          maxWidth: '90vw',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.14)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 280ms cubic-bezier(0.32, 0.72, 0, 1)',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* ── Drawer header ─────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px',
            borderBottom: '1px solid var(--border, #E5E5E5)',
            flexShrink: 0,
          }}
        >
          {/* Logo */}
          <span
            style={{
              fontWeight: 800,
              fontSize: 18,
              letterSpacing: '-0.3px',
              color: '#1A1A1A',
            }}
          >
            I GO{' '}
            <span style={{ color: 'var(--gold, #D39D55)' }}>WED</span>
          </span>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть меню"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#6B6B6B',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#F4F4F4';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <Close size={20} />
          </button>
        </div>

        {/* ── Nav links ─────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px 0',
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = activePage === link;
            return (
              <button
                key={link}
                type="button"
                onClick={() => {
                  onNavigate?.(link);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '14px 20px',
                  fontSize: 16,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--gold, #D39D55)' : '#1A1A1A',
                  background: isActive ? 'rgba(211,157,85,0.08)' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--border, #E5E5E5)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  transition: 'background 150ms, color 150ms',
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.background = '#F4F4F4';
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                {link}
              </button>
            );
          })}
        </div>

        {/* ── CTA buttons ───────────────────────────────────────── */}
        <div
          style={{
            padding: '20px',
            borderTop: '1px solid var(--border, #E5E5E5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--gold, #D39D55)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
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
            Создать мероприятие
          </button>
          <button
            type="button"
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: 8,
              border: '2px solid var(--border, #E5E5E5)',
              background: 'transparent',
              color: '#1A1A1A',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'border-color 150ms, color 150ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                'var(--gold, #D39D55)';
              (e.currentTarget as HTMLButtonElement).style.color =
                'var(--gold, #D39D55)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                'var(--border, #E5E5E5)';
              (e.currentTarget as HTMLButtonElement).style.color = '#1A1A1A';
            }}
          >
            Войти
          </button>
        </div>

        {/* ── Social icons ──────────────────────────────────────── */}
        <div
          style={{
            padding: '16px 20px 20px',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {[
            { Icon: TelegramIcon, label: 'Telegram', href: '#' },
            { Icon: InstagramIcon, label: 'Instagram', href: '#' },
            { Icon: VKIcon, label: 'ВКонтакте', href: '#' },
          ].map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: '#F4F4F4',
                color: '#6B6B6B',
                textDecoration: 'none',
                transition: 'background 150ms, color 150ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  'rgba(211,157,85,0.12)';
                (e.currentTarget as HTMLAnchorElement).style.color =
                  'var(--gold, #D39D55)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#F4F4F4';
                (e.currentTarget as HTMLAnchorElement).style.color = '#6B6B6B';
              }}
            >
              <Icon />
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

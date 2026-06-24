'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { Close } from '@/components/ui/Icons';

/* ── Types ───────────────────────────────────────────────────────────────── */

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

/* ── Size map ────────────────────────────────────────────────────────────── */

const SIZE_WIDTH: Record<NonNullable<ModalProps['size']>, number> = {
  sm: 400,
  md: 560,
  lg: 720,
};

/* ── Modal ───────────────────────────────────────────────────────────────── */

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  /* ESC key */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    /* Lock body scroll while open */
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, handleKeyDown]);

  /* Focus trap: move focus to panel when it opens */
  useEffect(() => {
    if (open) {
      // Small timeout to allow transition to start
      const t = setTimeout(() => panelRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
  }, [open]);

  const maxWidth = SIZE_WIDTH[size];

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          /* Fade transition */
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 200ms ease',
        }}
      />

      {/* ── Centering container ────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 201,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {/* ── Panel ─────────────────────────────────────────────── */}
        <div
          ref={panelRef}
          tabIndex={-1}
          style={{
            width: '100%',
            maxWidth,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 25px 60px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.10)',
            padding: '24px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            /* Scale + fade animation */
            opacity: open ? 1 : 0,
            transform: open ? 'scale(1)' : 'scale(0.95)',
            transition: 'opacity 200ms ease, transform 200ms ease',
          }}
          /* Prevent backdrop click from bubbling through panel */
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ────────────────────────────────────────────── */}
          {(title || true) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: title ? 20 : 0,
                flexShrink: 0,
              }}
            >
              {title && (
                <h2
                  id="modal-title"
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 600,
                    color: '#1A1A1A',
                    lineHeight: 1.3,
                  }}
                >
                  {title}
                </h2>
              )}
              {!title && <div />}
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#6B6B6B',
                  transition: 'background 150ms, color 150ms',
                  flexShrink: 0,
                  marginLeft: 12,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#F4F4F4';
                  (e.currentTarget as HTMLButtonElement).style.color = '#1A1A1A';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = '#6B6B6B';
                }}
              >
                <Close size={18} />
              </button>
            </div>
          )}

          {/* ── Scrollable body ───────────────────────────────────── */}
          <div
            style={{
              overflowY: 'auto',
              flex: 1,
              /* Custom scrollbar */
              scrollbarWidth: 'thin',
              scrollbarColor: '#E5E5E5 transparent',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

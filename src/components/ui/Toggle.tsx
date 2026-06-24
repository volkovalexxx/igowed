'use client';

import React from 'react';

/* ── Types ───────────────────────────────────────────────────────────────── */

export interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  label?: string;
}

/* ── Toggle ──────────────────────────────────────────────────────────────── */

export default function Toggle({
  value,
  onChange,
  size = 'md',
  disabled = false,
  label,
}: ToggleProps) {
  const isMd = size === 'md';

  /* Dimensions */
  const trackW = isMd ? 40 : 32;
  const trackH = isMd ? 20 : 16;
  const circleSize = isMd ? 14 : 11;
  const circlePad = isMd ? 3 : 2.5;
  const circleTravel = trackW - circleSize - circlePad * 2;

  const handleClick = () => {
    if (!disabled) onChange(!value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled) onChange(!value);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: 'none',
        background: 'none',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        flexShrink: 0,
      }}
      // Visible focus ring for keyboard nav
      onFocus={(e) => {
        (e.currentTarget as HTMLButtonElement).style.outline = '2px solid #D39D55';
        (e.currentTarget as HTMLButtonElement).style.outlineOffset = '2px';
        (e.currentTarget as HTMLButtonElement).style.borderRadius = '999px';
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLButtonElement).style.outline = 'none';
      }}
    >
      {/* Track */}
      <span
        style={{
          display: 'inline-block',
          position: 'relative',
          width: trackW,
          height: trackH,
          borderRadius: 999,
          background: value ? 'var(--gold, #D39D55)' : '#E5E5E5',
          transition: 'background 150ms ease',
          flexShrink: 0,
        }}
      >
        {/* Circle / thumb */}
        <span
          style={{
            position: 'absolute',
            top: circlePad,
            left: circlePad,
            width: circleSize,
            height: circleSize,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.20)',
            transform: value ? `translateX(${circleTravel}px)` : 'translateX(0)',
            transition: 'transform 150ms ease',
          }}
        />
      </span>
    </button>
  );
}
